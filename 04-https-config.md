# HTTPS & SSL Configuration

Setting up HTTPS with Cloudflare **Full (Strict)** mode or Let's Encrypt.

---

## What "Full (Strict)" Mode Means

- **Traffic flow:** Visitor → Cloudflare (HTTPS) → Your Server (HTTPS)
- Cloudflare **validates** your SSL certificate on your origin server.
- You need **a valid cert** (Cloudflare Origin CA, Let's Encrypt, or another trusted CA).

---

## Option 1: Cloudflare Origin Certificate

### Generate an Origin Certificate

1. Go to Cloudflare Dashboard → **SSL/TLS** → **Origin Server** → **Create Certificate**.
2. Choose:
   - **Private key type:** RSA
   - **Validity:** 15 years (default)
   - **Hostnames:** `example.com` and `*.example.com`
3. Download both:
   - **Certificate** (`origin.crt`)
   - **Private Key** (`origin.key`)

### Upload Certificates to Server

```bash
sudo mkdir -p /etc/ssl/example
sudo nano /etc/ssl/example/origin.crt
sudo nano /etc/ssl/example/origin.key
sudo chmod 600 /etc/ssl/example/origin.key
```

### Configure Nginx

```nginx
server {
    listen 443 ssl;
    server_name example.com www.example.com;

    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;

    ssl_certificate /etc/ssl/example/origin.crt;
    ssl_certificate_key /etc/ssl/example/origin.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/example.com;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}

server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}
```

Test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Set Cloudflare SSL Mode

Go to **SSL/TLS → Overview** and set mode to **Full (Strict)**.

### Verify

```bash
curl -I https://example.com
```

You should get `HTTP/1.1 200 OK`.

---

## Option 2: Let's Encrypt (Public CA)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d example.com -d www.example.com
```

Then also set Cloudflare SSL mode to **Full (Strict)**.

---

Next: [Key Features](./05-features.md)
