# Reverse Proxy Setup

Setting up a reverse proxy with SSL (HTTPS) using Nginx — the most common and secure configuration for modern web servers.

---

## Example Goal

- Domain: `example.com`
- Nginx on Ubuntu
- Backend app running on port `8080` (Node.js, Java, Go, .NET, or Python)
- Nginx will use **HTTPS (SSL)** and forward traffic to the backend.

---

## Step 1: Get SSL Certificate

### Option A: Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d example.com -d www.example.com
```

### Option B: Manual SSL

Place your existing certificates (`fullchain.pem`, `privkey.pem`) in `/etc/ssl/example.com/`.

---

## Step 2: Nginx Reverse Proxy Config

Create `/etc/nginx/sites-available/example.com`:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Step 3: Enable Config and Reload

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## How It Works

1. Users access `https://example.com`
2. Nginx handles SSL/TLS encryption.
3. Nginx forwards traffic to the backend on `http://127.0.0.1:8080`.
4. Backend sends response → Nginx sends it securely to the client.

---

## For Cloudflare "Full (Strict)" Mode

Use a Cloudflare Origin Certificate instead of Let's Encrypt:

```nginx
ssl_certificate /etc/ssl/certs/cloudflare.crt;
ssl_certificate_key /etc/ssl/private/cloudflare.key;
```

---

Next: [Configuration Reference](./07-config.md)
