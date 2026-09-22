---
layout: home

hero:
  name: "Web Servers Master Guide"
  text: "Apache, NGINX, Caddy & Ferron"
  tagline: "A production-grade architectural guide for engineering teams. Master concurrency models, reverse proxies, and traffic routing across Monolith and Microservices workloads."
  actions:
    - theme: brand
      text: "01. What is a Web Service?"
      link: "./01-what-is-web-service/01-what-is-a-web-service.md"
    - theme: alt
      text: "06. Server Comparison"
      link: "./06-comparison/01-server-comparison.md"
    - theme: alt
      text: "Decision Guide"
      link: "./06-comparison/02-decision-guide.md"
    - theme: alt
      text: "Cheat Sheet"
      link: "./06-comparison/03-cheat-sheet.md"

features:
  - icon: 🌐
    title: 01. What is a Web Service?
    details: Web service vs web server vs app server, request lifecycle, sockets, TCP, TLS, and Monolith vs Microservices.
    link: ./01-what-is-web-service/01-what-is-a-web-service.md
  - icon: 🏛️
    title: 02. Apache HTTP Server
    details: (01) Install, (02) Core Concepts, (03) Architecture & MPMs, (04) Monolith, (05) Microservices, (06) Practical Examples.
    link: ./02-apache/01-installation-and-setup.md
  - icon: ⚡
    title: 03. NGINX
    details: (01) Install, (02) Core Concepts, (03) Architecture & epoll, (04) Monolith, (05) Microservices Gateway, (06) Practical Examples.
    link: ./03-nginx/01-installation-and-setup.md
  - icon: 🔒
    title: 04. Caddy
    details: (01) Install, (02) Core Concepts, (03) Architecture & Auto-HTTPS, (04) Monolith, (05) Microservices & Reverse Proxy, (06) Practical Examples.
    link: ./04-caddy/01-installation-and-setup.md
  - icon: 🦀
    title: 05. Ferron (Rust)
    details: (01) Install, (02) Core Concepts, (03) Architecture & KDL, (04) Monolith, (05) Microservices & Reverse Proxy, (06) Practical Examples.
    link: ./05-ferron/01-installation-and-setup.md
  - icon: ⚖️
    title: 06. Final Comparison & Guide
    details: Concurrency models, resource usage, memory safety, decision guide, and side-by-side Rosetta Stone cheat sheet.
    link: ./06-comparison/01-server-comparison.md
---

## 🧭 Architectural Landscape

Modern web infrastructure is not one-size-fits-all. As a lead engineer, choosing the right edge and reverse proxy tier dictates your system's connection capacity, memory footprint, operational overhead, and security posture.

```mermaid
flowchart TD
    subgraph Traffic["Incoming Client Traffic"]
        C1["Web Browsers (HTTP/1.1, HTTP/2, HTTP/3)"]
        C2["Mobile & API Clients (JSON / REST)"]
        C3["Realtime & Microservice RPC (WebSockets / gRPC)"]
    end

    subgraph EdgeLayer["Edge / Reverse Proxy Tier"]
        direction TB
        Apache["<b>Apache HTTP Server</b><br/>(Process / Threaded / MPM Event)"]
        Nginx["<b>NGINX</b><br/>(Event Loop / epoll / Reactor)"]
        Caddy["<b>Caddy</b><br/>(Go Goroutines / Auto-TLS)"]
        Ferron["<b>Ferron</b><br/>(Rust / Tokio Async / KDL)"]
    end

    subgraph Architectures["Deployment Targets"]
        direction LR
        subgraph Mono["Monolith Pattern"]
            direction TB
            M_Static["Static File Offloading (Sendfile)"]
            M_Socket["Local App Socket (PHP-FPM, Gunicorn, Node.js)"]
            M_Static --- M_Socket
        end

        subgraph Micro["Microservices Pattern"]
            direction TB
            GW_Auth["Rate Limiting & Auth Validation"]
            GW_Routing["Path / Host Ingress Routing"]
            GW_Pools["Upstream Pools & Active Health Checks"]
            GW_Auth --> GW_Routing --> GW_Pools
        end
    end

    Traffic --> EdgeLayer
    EdgeLayer -.->|Offload & Protect| Mono
    EdgeLayer -.->|Route & Balance| Micro
```

---

## 📊 Core Technology Matrix

| Dimension | Apache HTTP Server | NGINX | Caddy | Ferron |
| :--- | :--- | :--- | :--- | :--- |
| **Language** | C | C | Go | Rust |
| **Concurrency Engine** | Process / Thread Pool (`mpm_event`) | Event-driven Non-blocking (`epoll`) | Go M:N Scheduler (Goroutines) | Multi-threaded Async (`Tokio`) |
| **Memory Safety** | Manual C memory management | Manual C memory management | Managed Garbage Collected | Compile-time Rust Borrow Checker |
| **Configuration** | XML-like Apache syntax + `.htaccess` | Declarative block syntax (`nginx.conf`) | Human-readable `Caddyfile` & JSON API | KDL Document Language (`ferron.kdl`) |
| **Automatic TLS** | Manual / Certbot Cron | Manual / Certbot Cron | Native Built-in (ACME / ZeroSSL) | Native Built-in (Let's Encrypt) |
| **HTTP/3 (QUIC)** | Experimental (`mod_md` / `mod_http2`) | Supported (v1.25+) | Native & Default | Supported |
| **Primary Sweet Spot** | Legacy monoliths, dynamic `.htaccess` | High-concurrency edge, static offloading | Developer ergonomics, rapid zero-ops TLS | Memory-critical edge, memory safety |
