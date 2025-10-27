Perfect — let’s set up a **reverse proxy with SSL (HTTPS)** using **Nginx**.
This is the most common and secure setup for modern web servers.

---

## 🔧 Example Goal

You have:

* Domain: `example.com`
* Nginx on your Ubuntu server
* Backend app running on port `8080` (like Node.js, PHP, or Flask)
* You want Nginx to:

  * Use **HTTPS (SSL)**
  * Forward traffic to your app (`localhost:8080`)
  * Work with **Cloudflare Full (Strict)** or normal SSL

---

## 🧱 Step 1 — Get SSL Certificate

### Option 1: **Let’s Encrypt (Free)**

Install **Certbot** (for automatic SSL):

```bash
sudo apt install certbot python3-certbot-nginx -y
```

Then request a certificate:

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

This automatically edits your Nginx config to enable HTTPS.

---

### Option 2: **Manual SSL**

If you already have your own SSL certificates:

* `fullchain.pem` → public certificate
* `privkey.pem` → private key

Place them in `/etc/ssl/example.com/`

---

## ⚙️ Step 2 — Nginx Reverse Proxy Config (with SSL)

Create a config file:

```bash
sudo nano /etc/nginx/sites-available/example.com
```

Paste this:

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

## ⚙️ Step 3 — Enable Config and Reload Nginx

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ What Happens Now

1. Users access `https://example.com`
2. Nginx:

   * Handles SSL/TLS encryption
   * Forwards traffic to your backend on `http://127.0.0.1:8080`
3. Backend sends response → Nginx sends it securely to the client.

---

## 🔒 (Optional) For Cloudflare “Full (Strict)” Mode

Cloudflare needs **valid SSL** on your origin server.
Make sure:

* You have a **Let’s Encrypt** or **Cloudflare Origin Certificate** installed.
* Use the same HTTPS reverse proxy config above.

If you use a Cloudflare Origin Certificate, replace:

```nginx
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

with:

```nginx
ssl_certificate /etc/ssl/certs/cloudflare.crt;
ssl_certificate_key /etc/ssl/private/cloudflare.key;
```

---

Would you like me to show the **Cloudflare Origin Certificate** setup steps too (for “Full Strict” mode)?
