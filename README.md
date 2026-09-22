# Web Servers Master Guide 🚀

An exhaustive, production-grade guide to modern web servers: **Apache HTTP Server**, **NGINX**, **Caddy**, and **Ferron** across **Monolithic** and **Microservices** architectures.

Authored from the perspective of a 15-year Lead Software Engineer, this guide provides in-depth, topic-by-topic breakdowns: installation, "what/why/how", architecture, monolith patterns, microservice gateways, practical examples, and cross-cutting comparison matrices.

---

## 📚 Documentation Site (VitePress + Mermaid)

The documentation site includes full-text search, dark/light theme, and interactive Mermaid architecture diagrams.

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

## 🐳 Hands-On Multi-Server Sandbox (Docker Compose)

Spin up all four web servers alongside a mock backend microservice with one command:

```bash
docker compose up -d
```

| Server | Technology | Static Asset URL | Reverse Proxy API URL | Health Check URL |
| :--- | :--- | :--- | :--- | :--- |
| **🏛️ Apache** | C / MPM Event | `http://localhost:8081/` | `http://localhost:8081/api/` | `http://localhost:8081/healthz` |
| **⚡ NGINX** | C / epoll Reactor | `http://localhost:8082/` | `http://localhost:8082/api/` | `http://localhost:8082/healthz` |
| **🔒 Caddy** | Go / Goroutines | `http://localhost:8083/` | `http://localhost:8083/api/` | `http://localhost:8083/healthz` |
| **🦀 Ferron** | Rust / Tokio Async | `http://localhost:8084/` | `http://localhost:8084/api/` | `http://localhost:8084/healthz` |

To tear down the sandbox:
```bash
docker compose down
```

---

## 📑 Curriculum & Table of Contents

### 🌐 01. What is a Web Server?
* [01. What is a Web Server?](./docs/01-what-is-web-server/01-what-is-a-web-server.md) — Web server vs. application server vs. web service vs. reverse proxy.
* [02. How Web Servers Work](./docs/01-what-is-web-server/02-how-web-servers-work.md) — Request lifecycle, sockets, TCP handshake, TLS 1.3, and kernel I/O.
* [03. Monolith vs. Microservices](./docs/01-what-is-web-server/03-monolith-vs-microservices.md) — Web server duties in monolithic vs. microservices fleets.

### 🏛️ 02. Apache HTTP Server
* [01. Installation & Setup](./docs/02-apache/01-installation-and-setup.md) — Step-by-step installation on Ubuntu, RHEL, macOS, and Docker.
* [02. What, Why & How](./docs/02-apache/02-what-why-how.md) — Origins, strengths, weaknesses, and the 16-phase Hook pipeline.
* [03. Architecture & MPM Engine](./docs/02-apache/03-architecture-and-mpm.md) — Prefork vs. Worker vs. Event MPM, directory precedence, and `.htaccess` penalties.
* [04. Monolith Deployments](./docs/02-apache/04-monolith-deployments.md) — `mod_proxy_fcgi` for PHP-FPM, Gunicorn WSGI, and static asset caching.
* [05. Microservices & Reverse Proxy](./docs/02-apache/05-microservices-and-reverse-proxy.md) — `mod_proxy_balancer`, active health checking (`mod_proxy_hcheck`), and WebSockets.
* [06. Practical Examples & Code Samples](./docs/02-apache/06-practical-examples.md) — Complete copy-paste production configs and diagnostics.

### ⚡ 03. NGINX
* [01. Installation & Setup](./docs/03-nginx/01-installation-and-setup.md) — Mainline vs. stable, installing on Ubuntu, RHEL, and Docker.
* [02. What, Why & How](./docs/03-nginx/02-what-why-how.md) — The C10K problem, non-blocking event loops, and why NGINX conquered the web.
* [03. Architecture & Internals](./docs/03-nginx/03-architecture-and-internals.md) — Master/worker processes, CPU affinity, location matching algorithm, and zero-copy `sendfile`.
* [04. Monolith Deployments](./docs/03-nginx/04-monolith-deployments.md) — FastCGI over Unix domain sockets, front-controller routing, and edge microcaching.
* [05. Microservices API Gateway](./docs/03-nginx/05-microservices-api-gateway.md) — Leaky bucket rate limiting (`limit_req`), upstream keepalives, and gRPC/WebSocket proxying.
* [06. Practical Examples & Code Samples](./docs/03-nginx/06-practical-examples.md) — Complete copy-paste production configs and diagnostics.

### 🔒 04. Caddy
* [01. Installation & Setup](./docs/04-caddy/01-installation-and-setup.md) — Installing on Debian/Ubuntu, RHEL, Arch, and Docker.
* [02. What, Why & How](./docs/04-caddy/02-what-why-how.md) — Go runtime, memory safety, automatic HTTPS, and why modern teams adopt Caddy.
* [03. Architecture & Auto-HTTPS](./docs/04-caddy/03-architecture-and-auto-https.md) — Go M:N scheduler, ACME certificate lifecycle, and Caddyfile vs. JSON API.
* [04. Monolith Deployments](./docs/04-caddy/04-monolith-deployments.md) — `php_fastcgi` single-directive power, SPA fallback routing, and Zstandard compression.
* [05. Microservices & Reverse Proxy](./docs/04-caddy/05-microservices-and-reverse-proxy.md) — Declarative named matchers, active and passive health checking, and internal mTLS.
* [06. Practical Examples & Code Samples](./docs/04-caddy/06-practical-examples.md) — Complete copy-paste production configs and diagnostics.

### 🦀 05. Ferron (Rust)
* [01. Installation & Setup](./docs/05-ferron/01-installation-and-setup.md) — Binary download, Cargo, and Docker setup.
* [02. What, Why & How](./docs/05-ferron/02-what-why-how.md) — Eliminating C-memory vulnerabilities with Rust, zero GC pauses, and Tokio async runtime.
* [03. Architecture & KDL Configuration](./docs/05-ferron/03-architecture-and-kdl.md) — Tokio work-stealing executor, zero-cost abstractions, and KDL syntax.
* [04. Monolith Deployments](./docs/05-ferron/04-monolith-deployments.md) — High-throughput static file serving, FastCGI/SCGI integration, and SPA routing.
* [05. Microservices & Reverse Proxy](./docs/05-ferron/05-microservices-and-reverse-proxy.md) — Upstream load balancing, structured JSON tracing for Loki/ELK, and low-memory routing.
* [06. Practical Examples & Code Samples](./docs/05-ferron/06-practical-examples.md) — Complete copy-paste production configs and diagnostics.

### ⚖️ 06. Comparisons & Blueprints
* [01. Concurrency & I/O Models](./docs/06-comparisons-and-blueprints/01-concurrency-models.md) — Process-per-connection vs. `epoll` vs. Go Goroutines vs. Rust Tokio async.
* [02. Decision Matrix: Which to Choose?](./docs/06-comparisons-and-blueprints/02-decision-matrix.md) — Decision flowchart and trade-off analysis across throughput, memory, security, and developer ergonomics.
* [03. Rosetta Stone: Config Cheat Sheet](./docs/06-comparisons-and-blueprints/03-rosetta-stone.md) — Side-by-side directive translations across all four servers.
* [04. Production Security Hardening & TLS](./docs/06-comparisons-and-blueprints/04-security-hardening.md) — OWASP recommended security headers, Mozilla Modern TLS, and payload buffer hardening.

---

## 📄 License

Released under the MIT License.
