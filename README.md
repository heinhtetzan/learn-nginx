# Web Servers Master Guide 🚀

An exhaustive, production-grade guide to modern web servers: **Apache HTTP Server**, **NGINX**, **Caddy**, and **Ferron** across **Monolithic** and **Microservices** architectures.

Authored from the perspective of a 15-year Lead Software Engineer, this guide provides in-depth, topic-by-topic breakdowns: installation, core concepts, architecture, monolith patterns, microservice gateways, practical examples, and cross-cutting comparison matrices.

---

## 📑 Curriculum & Table of Contents

### 🌐 01. What is a Web Service?
* [01. What is a Web Service & Server?](./01-what-is-web-service/01-what-is-a-web-service.md) — Web service vs. application server vs. web server vs. reverse proxy.
* [02. How Web Servers Work](./01-what-is-web-service/02-how-web-servers-work.md) — Request lifecycle, sockets, TCP handshake, TLS 1.3, and kernel I/O.
* [03. Monolith vs. Microservices](./01-what-is-web-service/03-monolith-vs-microservices.md) — Web server duties in monolithic vs. microservices fleets.

### 🏛️ 02. Apache HTTP Server
* [01. Installation & Setup](./02-apache/01-installation-and-setup.md) — Step-by-step installation on Ubuntu, RHEL, macOS, and Docker.
* [02. Core Concepts & Overview](./02-apache/02-core-concepts.md) — Origins, strengths, weaknesses, and the 16-phase Hook pipeline.
* [03. Architecture & MPM Engine](./02-apache/03-architecture-and-mpm.md) — Prefork vs. Worker vs. Event MPM, directory precedence, and `.htaccess` penalties.
* [04. Monolith Deployments](./02-apache/04-monolith-deployments.md) — `mod_proxy_fcgi` for PHP-FPM, Gunicorn WSGI, and static asset caching.
* [05. Microservices & Reverse Proxy](./02-apache/05-microservices-and-reverse-proxy.md) — `mod_proxy_balancer`, active health checking (`mod_proxy_hcheck`), and WebSockets.
* [06. Practical Examples & Code Samples](./02-apache/06-practical-examples.md) — Complete copy-paste production configs and diagnostics.

### ⚡ 03. NGINX
* [01. Installation & Setup](./03-nginx/01-installation-and-setup.md) — Mainline vs. stable, installing on Ubuntu, RHEL, and Docker.
* [02. Core Concepts & Overview](./03-nginx/02-core-concepts.md) — The C10K problem, non-blocking event loops, and why NGINX conquered the web.
* [03. Architecture & Internals](./03-nginx/03-architecture-and-internals.md) — Master/worker processes, CPU affinity, location matching algorithm, and zero-copy `sendfile`.
* [04. Monolith Deployments](./03-nginx/04-monolith-deployments.md) — FastCGI over Unix domain sockets, front-controller routing, and edge microcaching.
* [05. Microservices API Gateway](./03-nginx/05-microservices-api-gateway.md) — Leaky bucket rate limiting (`limit_req`), upstream keepalives, and gRPC/WebSocket proxying.
* [06. Practical Examples & Code Samples](./03-nginx/06-practical-examples.md) — Complete copy-paste production configs and diagnostics.

### 🔒 04. Caddy
* [01. Installation & Setup](./04-caddy/01-installation-and-setup.md) — Installing on Debian/Ubuntu, RHEL, Arch, and Docker.
* [02. Core Concepts & Overview](./04-caddy/02-core-concepts.md) — Go runtime, memory safety, automatic HTTPS, and why modern teams adopt Caddy.
* [03. Architecture & Auto-HTTPS](./04-caddy/03-architecture-and-auto-https.md) — Go M:N scheduler, ACME certificate lifecycle, and Caddyfile vs. JSON API.
* [04. Monolith Deployments](./04-caddy/04-monolith-deployments.md) — `php_fastcgi` single-directive power, SPA fallback routing, and Zstandard compression.
* [05. Microservices & Reverse Proxy](./04-caddy/05-microservices-and-reverse-proxy.md) — Declarative named matchers, active and passive health checking, and internal mTLS.
* [06. Practical Examples & Code Samples](./04-caddy/06-practical-examples.md) — Complete copy-paste production configs and diagnostics.

### 🦀 05. Ferron (Rust)
* [01. Installation & Setup](./05-ferron/01-installation-and-setup.md) — Binary download, Cargo, and Docker setup.
* [02. Core Concepts & Overview](./05-ferron/02-core-concepts.md) — Eliminating C-memory vulnerabilities with Rust, zero GC pauses, and Tokio async runtime.
* [03. Architecture & KDL Configuration](./05-ferron/03-architecture-and-kdl.md) — Tokio work-stealing executor, zero-cost abstractions, and KDL syntax.
* [04. Monolith Deployments](./05-ferron/04-monolith-deployments.md) — High-throughput static file serving, FastCGI/SCGI integration, and SPA routing.
* [05. Microservices & Reverse Proxy](./05-ferron/05-microservices-and-reverse-proxy.md) — Upstream load balancing, structured JSON tracing for Loki/ELK, and low-memory routing.
* [06. Practical Examples & Code Samples](./05-ferron/06-practical-examples.md) — Complete copy-paste production configs and diagnostics.

### ⚖️ 06. Final Comparison & Decision Guide
* [01. Server Comparison: Apache vs. NGINX vs. Caddy vs. Ferron](./06-comparison/01-server-comparison.md) — Concurrency models, resource usage, memory safety, and feature matrix.
* [02. Decision Guide: Which Server Should You Choose?](./06-comparison/02-decision-guide.md) — Decision flowchart, production scenarios, and selection checklist.
* [03. Configuration Cheat Sheet (Side-by-Side)](./06-comparison/03-cheat-sheet.md) — Rosetta Stone directive translations across all four servers.

---

## 📄 License

Released under the MIT License.
