---
layout: home

hero:
  name: "Web Servers Master Guide"
  text: "Apache, NGINX, Caddy & Ferron"
  tagline: "A production-grade architectural guide for engineering teams. Master concurrency models, reverse proxies, and traffic routing across Monolith and Microservices workloads."
  actions:
    - theme: brand
      text: "01. What is a Web Server?"
      link: "/01-what-is-web-server/01-what-is-a-web-server"
    - theme: alt
      text: "Rosetta Stone Cheat Sheet"
      link: "/06-comparisons-and-blueprints/03-rosetta-stone"
    - theme: alt
      text: "Decision Matrix"
      link: "/06-comparisons-and-blueprints/02-decision-matrix"

features:
  - icon: 🌐
    title: 01. Web Server Fundamentals
    details: Web server vs app server vs web service vs proxy, request lifecycle, sockets, TCP, TLS, and Monolith vs Microservices.
    link: /01-what-is-web-server/01-what-is-a-web-server
  - icon: 🏛️
    title: 02. Apache HTTP Server
    details: (01) Install, (02) Core Concepts, (03) Architecture & MPMs, (04) Monolith, (05) Microservices, (06) Practical Examples.
    link: /02-apache/01-installation-and-setup
  - icon: ⚡
    title: 03. NGINX
    details: (01) Install, (02) Core Concepts, (03) Architecture & epoll, (04) Monolith, (05) Microservices Gateway, (06) Practical Examples.
    link: /03-nginx/01-installation-and-setup
  - icon: 🔒
    title: 04. Caddy
    details: (01) Install, (02) Core Concepts, (03) Architecture & Auto-HTTPS, (04) Monolith, (05) Microservices & Reverse Proxy, (06) Practical Examples.
    link: /04-caddy/01-installation-and-setup
  - icon: 🦀
    title: 05. Ferron (Rust)
    details: (01) Install, (02) Core Concepts, (03) Architecture & KDL, (04) Monolith, (05) Microservices & Reverse Proxy, (06) Practical Examples.
    link: /05-ferron/01-installation-and-setup
  - icon: ⚖️
    title: 06. Comparisons & Blueprints
    details: Concurrency models, Decision matrix, Rosetta stone config translator, and Production security hardening.
    link: /06-comparisons-and-blueprints/01-concurrency-models
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
