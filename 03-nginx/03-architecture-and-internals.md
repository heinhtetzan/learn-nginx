# 03. NGINX: Architecture & Internals

Deep dive into NGINX's internal master-worker process architecture, CPU affinity, location matching priority algorithm, and zero-copy data path.

---

## 1. Master-Worker Process Model

```mermaid
flowchart TD
    subgraph Master["Master Process (Root)"]
        Init["Read & Validate nginx.conf"]
        Ports["Bind Sockets (:80, :443)"]
        Signal["Manage Worker Lifecycles via Signals"]
    end

    subgraph Workers["Worker Processes (nginx user)"]
        W1["Worker 0 (CPU 0)<br/>epoll event loop"]
        W2["Worker 1 (CPU 1)<br/>epoll event loop"]
        W3["Worker 2 (CPU 2)<br/>epoll event loop"]
        W4["Worker 3 (CPU 3)<br/>epoll event loop"]
    end

    Master -->|Spawns & Monitors| Workers
```

### Key Directives for Core Sizing:
```nginx
# 1. Spawn 1 worker per CPU core
worker_processes auto;

# 2. Pin workers to specific CPU cores to avoid cache thrashing
worker_cpu_affinity auto;

# 3. Maximum file descriptors per worker (conns + open files)
worker_rlimit_nofile 65535;

events {
    # Max connections per worker
    worker_connections 16384;
    use epoll;
    multi_accept on;
}
```

---

## 2. Location Matching Priority Algorithm

NGINX evaluates `location` blocks using a deterministic algorithm:

```mermaid
flowchart TD
    Req["Incoming URI"] --> Exact{"1. Exact Match? (= /path)"}
    Exact -- Yes --> RunExact["Execute Immediately"]
    
    Exact -- No --> FindPrefix["2. Find Longest Matching Prefix"]
    FindPrefix --> Pref{"Is it Preferential? (^~ /path)"}
    Pref -- Yes --> RunPref["Execute Immediately (Skip Regex)"]
    
    Pref -- No --> Regex{"3. Check Regex (~ or ~*) in file order"}
    Regex -- Match Found --> RunRegex["Execute First Matching Regex"]
    Regex -- No Match --> RunPrefix["Execute Longest Matching Prefix"]
```

### Hierarchy Rules:
1. `=` : **Exact Match**. Highest priority. Evaluation stops immediately.
2. `^~` : **Preferential Prefix**. If this is the longest prefix match, regex evaluation is skipped.
3. `~` / `~*` : **Regular Expressions** (`~` case-sensitive, `~*` case-insensitive). Evaluated in the exact order they appear in the file.
4. Standard Prefix (no modifier): Lowest priority. Fallback if no regex matches.

---

## 3. Zero-Copy Architecture (`sendfile`)

When serving static files, `sendfile` eliminates user-space context switches:

```mermaid
sequenceDiagram
    autonumber
    participant Disk as Hard Drive / NVMe
    participant Kernel as Kernel Page Cache
    participant Nginx as NGINX User Space
    participant Socket as Socket Buffer
    participant NIC as Network Card

    Note over Nginx: Traditional read/write: 4 context switches + 2 CPU copies
    Disk->>Kernel: DMA Copy
    Kernel->>Nginx: Copy to user buffer
    Nginx->>Socket: Copy to socket buffer
    Socket->>NIC: DMA Copy

    Note over Nginx: With sendfile on: 2 context switches + 0 CPU copies!
    Disk->>Kernel: DMA Copy
    Kernel-->>Socket: Direct kernel descriptor reference
    Socket->>NIC: DMA Copy
```

### Configuration Directives:
```nginx
http {
    sendfile on;          # Enables direct kernel file transfer
    tcp_nopush on;        # Sends HTTP header and file start in one packet
    tcp_nodelay on;       # Disables Nagle's algorithm for interactive low latency
    keepalive_timeout 65;
}
```
