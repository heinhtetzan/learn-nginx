# Microservices API Gateway

Configuring Nginx as a **gateway** or **reverse proxy** for microservice architectures.

---

## Role of Nginx in Microservices

In a microservices architecture, multiple backend services run independently on different ports or containers. Nginx acts as a **gateway** to route requests to the correct service.

---

## 1. Reverse Proxy (Core Concept)

```nginx
server {
    listen 80;
    server_name api.example.com;

    location /users/ {
        proxy_pass http://127.0.0.1:5001;
    }

    location /products/ {
        proxy_pass http://127.0.0.1:5002;
    }

    location /orders/ {
        proxy_pass http://127.0.0.1:5003;
    }
}
```

Nginx becomes the **API Gateway** — `/users/` → User Service, `/products/` → Product Service, `/orders/` → Order Service.

---

## 2. SSL (HTTPS) Termination

Only Nginx handles SSL/TLS. Backend microservices communicate over **HTTP internally**.

```nginx
server {
    listen 443 ssl;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

---

## 3. Load Balancing

Distribute traffic across multiple instances of a service:

```nginx
upstream user_service {
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

server {
    listen 80;
    location /users/ {
        proxy_pass http://user_service;
    }
}
```

---

## 4. Health Checks

```nginx
proxy_next_upstream error timeout invalid_header http_502;
```

If one instance fails, Nginx automatically switches to another.

---

## 5. Timeouts and Buffering

```nginx
proxy_connect_timeout 5s;
proxy_send_timeout 10s;
proxy_read_timeout 10s;
send_timeout 10s;
```

Disable buffering for streaming APIs:

```nginx
proxy_buffering off;
```

---

## 6. Headers Forwarding

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

---

## 7. Security Controls

Restrict access by IP:

```nginx
location /admin/ {
    allow 192.168.1.0/24;
    deny all;
}
```

Add rate limiting:

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    location / {
        limit_req zone=api_limit burst=20;
    }
}
```

---

## 8. Caching

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g;

location /products/ {
    proxy_pass http://127.0.0.1:5002;
    proxy_cache api_cache;
    proxy_cache_valid 200 1m;
}
```

---

## 9. Service Discovery

In Docker or Kubernetes, use DNS-based upstreams:

```nginx
upstream user_service {
    server user-service:5000;
}
```

---

## Summary: Must-Know Concepts

| Concept | Why It's Important |
|---------|-------------------|
| **Reverse Proxy** | Route traffic to correct microservice |
| **SSL Termination** | Secure external traffic (HTTPS) |
| **Load Balancing** | Scale horizontally across instances |
| **Headers Forwarding** | Preserve client identity info |
| **Timeouts & Buffers** | Prevent stuck or slow connections |
| **Caching** | Reduce load on microservices |
| **Rate Limiting / Security** | Protect against abuse |
| **Service Discovery** | Integrate with Docker or K8s networks |

---

Next: [Laravel (PHP-FPM)](./09-laravel.md)
