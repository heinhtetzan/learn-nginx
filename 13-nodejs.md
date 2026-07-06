# Node.js

Configuring Nginx as a reverse proxy for a Node.js application (Express, Koa, Fastify, etc.).

---

## Folder Setup

- Domain: `node.example.com`
- Node.js app path: `/var/www/node.example.com`
- Backend port: `3000` (common Express default)

Node.js apps run their own HTTP server. Nginx proxies public traffic to the Node process.

---

## Node.js Process Management with PM2

Install PM2 (production process manager):

```bash
sudo npm install -g pm2
```

Start your app:

```bash
pm2 start /var/www/node.example.com/app.js --name app
pm2 save
pm2 startup
```

---

## Nginx Configuration

Create `/etc/nginx/sites-available/node.example.com`:

```nginx
server {
    listen 80;
    server_name node.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name node.example.com;

    ssl_certificate /etc/letsencrypt/live/node.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/node.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /var/www/node.example.com/public;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 50M;
}
```

---

## Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/node.example.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## WebSocket Support

Node.js frequently uses WebSockets (e.g., Socket.io). The critical headers are:

```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

This upgrades the HTTP connection to a WebSocket connection.

---

## Static File Optimization

Offload static assets to Nginx:

```nginx
location /static/ {
    alias /var/www/node.example.com/public;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

---

## Key Config Lines

| Directive | Purpose |
|-----------|---------|
| `proxy_pass http://127.0.0.1:3000;` | Forwards to Node.js process |
| `proxy_set_header Upgrade $http_upgrade;` | Enables WebSocket support |
| `proxy_set_header Connection "upgrade";` | Required for WebSocket handshake |
| `location /static/` | Serves static assets directly via Nginx |
