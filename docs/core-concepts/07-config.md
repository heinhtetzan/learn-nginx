# Configuration Reference & Directive Anatomy

An in-depth guide to Nginx configuration contexts, directive inheritance, and `location` block matching mechanics.

---

## Configuration Hierarchy & Contexts

Nginx directives operate within specific **contexts** (scopes). Directives defined in outer blocks are inherited by inner blocks unless explicitly overridden.

```nginx
# 1. Main Context (Global server-level settings)
user www-data;
worker_processes auto;
pid /run/nginx.pid;

# 2. Events Context (Connection processing settings)
events {
    worker_connections 1024;
    multi_accept on;
}

# 3. HTTP Context (HTTP, reverse proxy, caching, MIME types)
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 4. Upstream Context (Load-balanced server pools)
    upstream api_servers {
        server 10.0.0.1:8080;
        server 10.0.0.2:8080;
    }

    # 5. Server Context (Virtual host / domain)
    server {
        listen 80;
        server_name example.com;

        # 6. Location Context (URI pattern routing)
        location /api/ {
            proxy_pass http://api_servers;
        }
    }
}
```

---

## Location Matching Rules & Priority

When Nginx receives a request, it selects the matching `location` block according to a strict priority hierarchy:

| Modifier | Type | Priority | Description | Example |
|:---|:---|:---|:---|:---|
| `=` | Exact match | **1 (Highest)** | Matches the exact URI only. Stops searching immediately. | `location = /login { ... }` |
| `^~` | Preferential prefix | **2** | If this longest prefix matches, regexes are skipped. | `location ^~ /static/ { ... }` |
| `~` | Regex (Case-sensitive) | **3** | Regular expression evaluation in order of appearance. | `location ~ \.(png\|jpg)$ { ... }` |
| `~*` | Regex (Case-insensitive) | **3** | Case-insensitive regex evaluation in order of appearance. | `location ~* \.(jpeg\|gif)$ { ... }` |
| *(None)* | Standard prefix | **4 (Lowest)** | Standard prefix match; longest prefix wins if no regex matches. | `location /docs/ { ... }` |

> [!NOTE]
> Regular expressions (`~` and `~*`) are evaluated in the order they appear in the configuration file. The first regular expression to match wins!

---

## Common Built-in Nginx Variables

| Variable | Description | Example Value |
|:---|:---|:---|
| `$host` | Hostname from request header or server name | `example.com` |
| `$remote_addr` | Client's IP address | `192.168.1.50` |
| `$binary_remote_addr` | Client's IP address in binary form (ideal for rate limiting) | 4 bytes (IPv4) / 16 bytes (IPv6) |
| `$request_uri` | Full original request URI including query parameters | `/products?category=books` |
| `$uri` | Normalized request URI without query parameters | `/products` |
| `$args` | Raw query string arguments | `category=books` |
| `$arg_NAME` | Value of a specific query parameter | `$arg_category` → `books` |
| `$status` | HTTP response status code | `200`, `404`, `502` |
| `$scheme` | Protocol scheme used | `http` or `https` |
| `$upstream_response_time` | Time taken by upstream server to respond | `0.024` (seconds) |

---

## Directive Cheat Sheet

| Directive | Context | Description |
|:---|:---|:---|
| `worker_processes auto;` | `main` | Spawns one worker per CPU core |
| `worker_connections 1024;` | `events` | Max simultaneous connections per worker process |
| `client_max_body_size 50M;` | `http`, `server`, `location` | Sets maximum allowed request payload (upload limit) |
| `try_files $uri $uri/ =404;` | `server`, `location` | Fallback file lookup sequence |
| `return 301 https://$host$request_uri;` | `server`, `location` | Instant HTTP redirect |
| `rewrite ^/old/(.*)$ /new/$1 permanent;` | `server`, `location` | Regex-based URL rewrite |

---

[Next: WebSocket Reverse Proxying →](./websockets.md)
