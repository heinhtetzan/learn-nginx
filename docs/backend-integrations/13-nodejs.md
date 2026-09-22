# Node.js (Express, Next.js, Fastify)

Configuring Nginx as a reverse proxy for Node.js applications with **PM2** process management, WebSocket support, and static asset offloading.

---

## Architecture Overview

```mermaid
flowchart LR
    Client["Client Browser"] -->|HTTPS (443)| Nginx["Nginx Reverse Proxy"]
    Nginx -->|Static Assets\n(/_next/static/ or /public/)| Disk[("Static Files")]
    Nginx -->|Proxy Pass\n(http://127.0.0.1:3000)| PM2["PM2 Cluster Mode\n(Node.js App)"]
```

---

## 1. Process Management with PM2

Install PM2 globally and launch the application in cluster mode (auto-scaling to all CPU cores):

```bash
# Install PM2
sudo npm install -g pm2

# Start application in cluster mode
pm2 start app.js -i max --name my-node-app

# Configure PM2 to restart on server reboot
pm2 startup systemd
pm2 save
```

---

## 2. Nginx Reverse Proxy Configuration

Create `/etc/nginx/sites-available/node.example.com`:

```nginx
# Map connection upgrade for WebSockets
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

upstream node_app_pool {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name node.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name node.example.com;

    ssl_certificate /etc/letsencrypt/live/node.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/node.example.com/privkey.pem;

    client_max_body_size 50M;

    # Static file serving for Next.js / Express
    location /_next/static/ {
        alias /var/www/node.example.com/.next/static/;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /public/ {
        alias /var/www/node.example.com/public/;
        expires 30d;
        access_log off;
    }

    # Dynamic application proxy with WebSocket support
    location / {
        proxy_pass http://node_app_pool;
        proxy_http_version 1.1;

        # WebSocket / Socket.io support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_read_timeout 90s;
        proxy_send_timeout 90s;
    }
}
```

---

[Next: Quick Reference & Cheatsheet →](../reference/cheatsheet.md)
