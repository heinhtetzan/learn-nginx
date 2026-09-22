# Learn Nginx 🚀

A comprehensive, production-grade guide to mastering **Nginx** — from core fundamentals and architecture to production deployments, HTTPS, reverse proxying, microservice gateways, and performance tuning.

---

## 📚 Documentation Site

This repository is powered by [VitePress](https://vitepress.dev/) with full-text search, dark/light theme, and interactive Mermaid architecture diagrams.

### Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run docs:dev

# 3. Build static documentation
npm run docs:build
```

---

## 🐳 Hands-On Sandbox (Docker Compose)

Test reverse proxying, health checks, and static serving locally with one command:

```bash
docker compose up -d
```

- **Static Website:** `http://localhost:8080/`
- **Reverse Proxy API:** `http://localhost:8080/api/`
- **Health Check:** `http://localhost:8080/healthz`

To shut down: `docker compose down`

---

## 📑 Table of Contents

### 1. Getting Started
- [01. Introduction to Nginx](./docs/getting-started/01-intro.md) — History, event-driven C10k architecture, Nginx vs. Apache.
- [02. Installation & Setup](./docs/getting-started/02-install-setup.md) — Installing on Ubuntu/Debian, RHEL, macOS, and Docker.
- [03. HTTP Configuration](./docs/getting-started/03-http-config.md) — Serving static websites, SPAs, MIME types, and `try_files`.

### 2. Core Concepts
- [04. HTTPS & SSL/TLS](./docs/core-concepts/04-https-config.md) — Let's Encrypt (Certbot) and Cloudflare Full (Strict) origin certificates.
- [05. Key Features & Performance Tuning](./docs/core-concepts/05-features.md) — `sendfile`, TCP optimizations, load balancing algorithms, and caching.
- [06. Reverse Proxy Setup](./docs/core-concepts/06-reverse-proxy.md) — Reverse proxying, upstream keepalives, and header preservation.
- [07. Configuration Reference](./docs/core-concepts/07-config.md) — Directives anatomy, contexts, and `location` matching priority.
- [WebSocket Reverse Proxying](./docs/core-concepts/websockets.md) — Connection upgrade headers, `$connection_upgrade` map, and timeouts.

### 3. Production Architecture
- [08. Microservices API Gateway](./docs/production-architecture/08-microservice.md) — Path routing, load balancing pools, and failover handling.
- [Production Security Hardening](./docs/production-architecture/security-hardening.md) — OWASP security headers, DDoS mitigation, and Mozilla Modern TLS.
- [HTTP/3 & QUIC Protocol](./docs/production-architecture/http3-quic.md) — Enabling HTTP/3 over UDP 443 with 0-RTT handshakes.
- [Caching Strategies & Compression](./docs/production-architecture/caching-compression.md) — Microcaching, proxy cache zones, Gzip, and Brotli.

### 4. Backend Integrations
- [Node.js (Express / Next.js)](./docs/backend-integrations/13-nodejs.md) — PM2 cluster mode, WebSocket support, and static asset offloading.
- [Python (FastAPI / Django)](./docs/backend-integrations/python.md) — Uvicorn (ASGI) and Gunicorn (WSGI) reverse proxying.
- [Laravel (PHP-FPM)](./docs/backend-integrations/09-laravel.md) — Unix socket FastCGI proxying, routing, and upload handling.
- [Go (Golang)](./docs/backend-integrations/12-go.md) — Reverse proxying high-throughput Go web services.
- [Java (Spring Boot)](./docs/backend-integrations/10-java.md) — Embedded Tomcat reverse proxying and Actuator security.
- [C# ASP.NET Core (.NET)](./docs/backend-integrations/11-dot-net.md) — Kestrel reverse proxying and SignalR support.

### 5. Quick Reference
- [CLI Commands & Cheatsheet](./docs/reference/cheatsheet.md) — Common commands, core variables, CORS snippets, and HTTP status codes.

---

## 🛠️ Verification & CI/CD

- **GitHub Actions:** Automatically lints configuration files (`nginx -t`) and deploys the VitePress site to GitHub Pages on every push to `main`.

---

## 📄 License

MIT License. Contributions and PRs welcome!
