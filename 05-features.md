# Key Features

Nginx is a powerful and flexible web server known for **speed, scalability, and stability**.

---

## High Performance & Speed

- Designed to handle **thousands of simultaneous connections** with low memory use.
- Uses an **event-driven, asynchronous architecture**, unlike Apache's process/thread model.
- Ideal for **high-traffic websites**.

---

## Reverse Proxy & Load Balancing

- Acts as a **reverse proxy**, forwarding requests to backend servers (Node.js, Python, PHP).
- Supports **load balancing** across multiple servers: round-robin, least connections, IP hash.
- Distributes traffic evenly and improves reliability.

---

## SSL/TLS Termination (HTTPS)

- Handles **SSL certificates** (including Let's Encrypt).
- Supports **modern security features** like HTTP/2, OCSP stapling, and HSTS.
- Often used with **Cloudflare Full (Strict)** mode for end-to-end encryption.

---

## Static File Serving

- Excellent at serving **static content** (HTML, CSS, JS, images).
- Uses caching and compression to serve files extremely fast.

---

## Reverse Proxy Caching

- Can **cache responses** from backend servers to speed up repeated requests.
- Reduces load on backend servers.

---

## Flexible Configuration

- Configuration via text files (`/etc/nginx/nginx.conf`, `/etc/nginx/sites-available/`).
- Supports **virtual hosts**, **custom headers**, and **rewrite rules**.

---

## URL Rewriting & Redirection

- Supports advanced **rewrite rules** and **redirects** using regular expressions.
- Useful for SEO, domain redirection, and routing clean URLs.

---

## Security Features

- Supports **rate limiting**, **IP blocking**, and **request filtering**.
- Can protect against **DDoS** and **brute-force** attacks.
- Works well with modules like ModSecurity as a WAF.

---

## Modular Architecture

- Extendable via **modules** (caching, security, monitoring, etc.).
- Custom modules can be compiled for specific needs.

---

## Logging & Monitoring

- Access logs and error logs for debugging and analytics.
- Compatible with **Grafana**, **Prometheus**, or **ELK Stack**.

---

Next: [Reverse Proxy Setup](./06-reverse-proxy.md)
