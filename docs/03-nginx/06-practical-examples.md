# 06. NGINX: Practical Hands-On & Code Samples

Complete, production-ready configuration examples and operational commands for real-world NGINX deployments.

---

## 1. Production Static Website with HTTPS & Security Headers

```nginx
# /etc/nginx/conf.d/static.conf

server {
    listen 80;
    server_name static.company.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name static.company.com;

    root /var/www/static;
    index index.html;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/static.crt;
    ssl_certificate_key /etc/ssl/private/static.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Static Assets with Cache-Control
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2|webp)$ {
        expires 365d;
        access_log off;
        add_header Cache-Control "public, no-transform, immutable";
        try_files $uri =404;
    }

    # SPA Fallback (React / Vue / Svelte)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 2. Reverse Proxy with Custom Headers & Timeouts

```nginx
# /etc/nginx/conf.d/proxy.conf

server {
    listen 80;
    server_name api.company.com;

    location / {
        proxy_pass http://10.0.0.50:8000;

        # Upstream timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;

        # Forward client context
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 8k;
        proxy_buffers 8 8k;
    }
}
```

---

## 3. Essential Diagnostic Commands

```bash
# 1. Test configuration syntax (Always test before reloading!)
sudo nginx -t

# 2. Dump the entire active configuration into stdout (resolves all includes)
sudo nginx -T

# 3. Reload configuration with zero dropped sockets
sudo nginx -s reload

# 4. Check active worker processes and CPU affinity
ps -eo pid,cmd,psr | grep nginx

# 5. Tail live error logs
tail -f /var/log/nginx/error.log
```
