# Caching Strategies & Compression

Optimizing latency and backend throughput using Nginx microcaching, proxy caching, and modern compression.

---

## 1. Reverse Proxy Caching

Nginx can store dynamic responses from upstream applications in a fast, in-memory index backed by disk storage.

```mermaid
flowchart LR
    Client["Client"] --> Nginx["Nginx Reverse Proxy"]
    Nginx -->|Cache Hit?| Cache[("Local Disk Cache\n/var/cache/nginx")]
    Cache -->|Yes (HIT)| Nginx
    Nginx -->|Return Cached Response| Client

    Nginx -->|No (MISS)| Backend["Upstream App Server"]
    Backend -->|Generate Response| Nginx
    Nginx -->|Save to Cache| Cache
```

### Configuration

In `/etc/nginx/nginx.conf` (inside the `http` block):

```nginx
# Configure cache storage
proxy_cache_path /var/cache/nginx/proxy_cache
    levels=1:2
    keys_zone=APP_CACHE:20m
    max_size=10g
    inactive=60m
    use_temp_path=off;
```

Inside your site's `server` or `location` block:

```nginx
location / {
    proxy_cache APP_CACHE;
    proxy_cache_key "$scheme$request_method$host$request_uri";

    # Cache status rules
    proxy_cache_valid 200 302 10m;
    proxy_cache_valid 404      1m;

    # Serve stale cache content during upstream outages or while updating
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    proxy_cache_background_update on;
    proxy_cache_lock on;

    # Bypass cache for authenticated requests or cookies
    proxy_cache_bypass $http_authorization $cookie_nocache;
    proxy_no_cache $http_authorization $cookie_nocache;

    # Inspect cache state in browser response headers
    add_header X-Cache-Status $upstream_cache_status always;

    proxy_pass http://127.0.0.1:8080;
}
```

### Interpreting `$upstream_cache_status`

| Status | Meaning |
|:---|:---|
| **HIT** | Response was served directly from Nginx cache. Zero backend load. |
| **MISS** | Not in cache; fetched from backend and stored for future requests. |
| **BYPASS** | Cache was skipped intentionally (e.g., due to auth header or cookie). |
| **EXPIRED** | Cached item was past its TTL; re-fetched from backend. |
| **STALE** | Backend failed or was updating; served older cached copy. |

---

## 2. Microcaching for Dynamic High-Traffic APIs

Even caching dynamic responses for just **1 to 5 seconds** can protect databases during sudden viral spikes:

```nginx
proxy_cache_valid 200 1s;
```

If 5,000 requests hit the endpoint within that second, **1 request hits the backend database**, and **4,999 requests are served in sub-millisecond time by Nginx**.

---

## 3. High-Efficiency Compression: Gzip & Brotli

### Gzip Configuration

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 5;
gzip_min_length 256;
gzip_types
    application/atom+xml
    application/geo+json
    application/javascript
    application/x-javascript
    application/json
    application/ld+json
    application/manifest+json
    application/rdf+xml
    application/rss+xml
    application/xhtml+xml
    application/xml
    font/eot
    font/otf
    font/ttf
    image/svg+xml
    text/css
    text/javascript
    text/plain
    text/xml;
```

### Brotli Configuration (via `ngx_brotli`)

Brotli offers 15–25% smaller file sizes than Gzip:

```nginx
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript image/svg+xml;
```

---

[Next: Backend Integrations — Node.js →](../backend-integrations/13-nodejs.md)
