# Key Features & Performance Tuning

Nginx is designed from the ground up for high concurrency, low latency, and efficient resource utilization.

---

## 1. High-Performance Static Serving

Nginx delivers static files (HTML, CSS, JS, images, videos) directly via the Linux kernel:

```nginx
http {
    # Transfers data directly between kernel file descriptor and socket
    sendfile on;

    # Sends HTTP response headers and beginning of file in one packet
    tcp_nopush on;

    # Disables Nagle's algorithm for low-latency delivery
    tcp_nodelay on;

    # How long to keep keepalive connections open
    keepalive_timeout 65;

    # Types hash max size
    types_hash_max_size 2048;
}
```

---

## 2. Load Balancing Algorithms

Nginx supports multiple algorithms for distributing traffic across backend pools:

```nginx
upstream backend_cluster {
    # 1. Round Robin (default): Requests distributed evenly
    # 2. Least Connections: Routes to server with fewest active connections
    # least_conn;

    # 3. IP Hash: Guarantees client IP always reaches same backend (session stickiness)
    # ip_hash;

    # 4. Consistent Generic Hash: Hashes custom key (e.g. request URI or cookie)
    # hash $request_uri consistent;

    server 10.0.0.1:8080 weight=3 max_fails=3 fail_timeout=10s;
    server 10.0.0.2:8080 weight=1 max_fails=3 fail_timeout=10s;
    server 10.0.0.3:8080 backup; # Only used when primaries are down
}
```

| Algorithm | Directive | Best Used For |
|:---|:---|:---|
| **Round Robin** | *(Default)* | Identical backend servers with similar capacity |
| **Least Connections** | `least_conn;` | Long-lived requests (e.g., file uploads, reports) |
| **IP Hash** | `ip_hash;` | Stateful legacy apps requiring session persistence |
| **Generic Hash** | `hash $key;` | Cache distribution, consistent routing |

---

## 3. Reverse Proxy Caching

Nginx can cache responses from upstream servers on local disk, dramatically reducing backend compute load:

```nginx
# Define cache zone in http block
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;

server {
    location / {
        proxy_cache my_cache;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404 1m;
        proxy_cache_use_stale error timeout updating http_500 http_502;
        
        # Add header to inspect cache status (HIT / MISS / BYPASS)
        add_header X-Cache-Status $upstream_cache_status;

        proxy_pass http://backend_cluster;
    }
}
```

---

## 4. Rate Limiting & Protection

Defend your APIs from brute force attacks and abusive scrapers:

```nginx
# Define rate limiting zone (10 requests per second per IP)
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    location /api/ {
        # Allow burst of 20 with nodelay
        limit_req zone=api_limit burst=20 nodelay;
        limit_req_status 429;

        proxy_pass http://backend_cluster;
    }
}
```

---

## 5. Modern Compression (Gzip & Brotli)

Reduce bandwidth and speed up page load times by compressing text assets:

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;
```

---

[Next: Reverse Proxy Setup →](./06-reverse-proxy.md)
