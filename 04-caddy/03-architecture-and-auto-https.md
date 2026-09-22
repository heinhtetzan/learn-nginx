# 03. Caddy: Architecture & Automatic HTTPS

Deep dive into Caddy’s Go concurrency architecture, the mechanics of Automatic HTTPS, and the duality between the declarative `Caddyfile` and the imperative JSON REST API.

---

## 1. Concurrency Model: Go M:N Goroutine Scheduler

Unlike NGINX’s single-threaded event loop per worker, Caddy uses Go’s M:N scheduler:
* **Initial Stack Size**: Each connection spawns a goroutine with an initial stack of just **2KB** (dynamically expanding and contracting).
* **Work-Stealing Scheduler**: Maps thousands of goroutines ($M$) across a fixed pool of OS threads ($N$) matching the system's logical CPU cores.
* **Non-Blocking Network Poller**: The Go runtime intercepts socket I/O using the OS kernel's `epoll` or `kqueue`.

```mermaid
flowchart TD
    subgraph Sched["Go Runtime M:N Scheduler"]
        G1["Goroutine 1 (~2KB)"]
        G2["Goroutine 2 (~2KB)"]
        G3["Goroutine N (~2KB)"]
        
        Scheduler["Work-Stealing Scheduler"]
        
        T1["OS Thread 1 (Core 0)"]
        T2["OS Thread 2 (Core 1)"]
        
        G1 & G2 & G3 --> Scheduler
        Scheduler --> T1 & T2
    end
```

---

## 2. Automatic HTTPS: Step-by-Step Lifecycle

Caddy automates the complete PKI lifecycle:

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Caddy as Caddy Server
    participant CA as Let's Encrypt / ZeroSSL
    participant DNS as DNS Server

    Note over Caddy: On Startup with domain "app.company.com"
    Caddy->>CA: 1. Request Certificate (ACME Order)
    CA-->>Caddy: 2. Challenge: HTTP-01 or TLS-ALPN-01
    CA->>Caddy: 3. Verify Challenge on Port 80 / 443
    Caddy-->>CA: 4. Challenge Validated
    CA-->>Caddy: 5. Issue X.509 Certificate Chain
    Note over Caddy: Cert stored in /var/lib/caddy/.local/share/caddy/
    
    Client->>Caddy: 6. HTTPS Request
    Caddy-->>Client: 7. Serve with OCSP Stapling (Fast Handshake)
```

### Auto-HTTPS Features:
* **Zero-Downtime Renewals**: Renews certificates automatically when 2/3 of their lifespan remains.
* **Redundant CAs**: If Let's Encrypt has an outage, Caddy automatically fails over to **ZeroSSL**.
* **Internal CA**: If you specify `.local` or an IP address, Caddy creates an internal root CA for local development.

---

## 3. The Dual Configuration Model: Caddyfile vs. JSON API

Caddy is fundamentally a JSON-configured engine. The `Caddyfile` is an ergonomic human layer that compiles into JSON:

```mermaid
flowchart LR
    Caddyfile["Caddyfile (Declarative)"] -->|caddy adapt| JSON["JSON Document (Internal Model)"]
    JSON --> CaddyCore["Caddy Engine"]
    REST["REST API (localhost:2019/load)"] -->|Direct JSON| CaddyCore
```

### Modifying Configuration via REST API:
You can reconfigure Caddy at runtime without writing files:
```bash
# Push a new configuration dynamically
curl -X POST "http://localhost:2019/load" \
     -H "Content-Type: application/json" \
     -d @config.json
```
