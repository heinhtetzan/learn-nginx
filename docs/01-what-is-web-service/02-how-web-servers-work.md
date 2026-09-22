# 02. How Web Servers Work: The Request Lifecycle

To troubleshoot complex production latency and connection issues, you must understand what happens beneath the surface when a client requests a URL.

---

## 1. End-to-End Request Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Kernel as OS Kernel (TCP/IP)
    participant Server as Web Server (epoll / Event Loop)
    participant Disk as NVMe / Page Cache
    participant Upstream as Application Server (PHP/Node/Python)

    Client->>Kernel: 1. TCP Handshake (SYN, SYN-ACK, ACK)
    Client->>Kernel: 2. TLS 1.3 Handshake (Key Exchange & Cipher Negotiation)
    Client->>Kernel: 3. HTTP GET /products (Data Packets in Socket Buffer)
    Kernel->>Server: 4. epoll_wait() notifies worker: Socket Readable!
    Server->>Kernel: 5. read() HTTP headers into user buffer
    Note over Server: Match Host & Location rules
    
    alt Case A: Static Asset (/static/app.js)
        Server->>Kernel: 6a. sendfile(out_fd, in_fd, offset, count)
        Disk->>Kernel: DMA transfer from disk to page cache
        Kernel-->>Client: 7a. Stream data packets directly to NIC
    else Case B: Dynamic API (/api/v1/orders)
        Server->>Upstream: 6b. Forward request via Unix Socket / Keepalive TCP
        Upstream-->>Server: 7b. Dynamic JSON response
        Server-->>Client: 8b. Return HTTP 200 OK + Payload
    end
```

---

## 2. The Socket Layer & File Descriptors

Under Linux, **everything is a file**. When a web server starts:
1. It executes `socket()` to create a network file descriptor.
2. It executes `bind()` to associate the socket with an IP and Port (e.g., `0.0.0.0:443`).
3. It executes `listen()` with a backlog queue (e.g., `somaxconn = 65535`).
4. Incoming connections are placed in the kernel's SYN backlog until the handshake completes, after which they move to the accept queue.

### Why `worker_rlimit_nofile` Matters:
Each open client connection, backend upstream socket, and open static file consumes **one file descriptor**.
If an NGINX worker has a limit of `1024` file descriptors (`ulimit -n`), it cannot handle more than ~500 concurrent connections. Production web servers must set:
```nginx
worker_rlimit_nofile 65535;
```

---

## 3. The TCP 3-Way Handshake & Keep-Alive

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Server as Web Server
    
    Client->>Server: SYN (Synchronize Sequence Number)
    Server-->>Client: SYN-ACK (Acknowledge + Synchronize)
    Client->>Server: ACK (Acknowledge)
    Note over Client,Server: TCP Connection Established (~1 RTT)
    
    Client->>Server: HTTP Request 1 (GET /index.html)
    Server-->>Client: HTTP Response 1
    
    Note over Client,Server: With Keep-Alive ON: Connection stays open!
    Client->>Server: HTTP Request 2 (GET /style.css)
    Server-->>Client: HTTP Response 2 (Zero Handshake Overhead)
```

Without **Keep-Alive**, the client and server must execute a new TCP handshake and TLS negotiation for every image, script, and API call, destroying throughput.
