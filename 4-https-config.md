## 🔒 What “Full (Strict)” mode means

* **Traffic flow:**
  Visitor → Cloudflare (HTTPS) → Your Server (HTTPS)
* Cloudflare **validates** your SSL certificate on your origin server.
* So you need **a valid cert** (either from Cloudflare Origin CA, Let’s Encrypt, or another trusted CA).

---

## ✅ Step-by-step setup (recommended using Cloudflare Origin CA)

### 1. Generate an Origin Certificate from Cloudflare

1. Go to your Cloudflare Dashboard → **SSL/TLS** → **Origin Server** → **Create Certificate**.
2. Choose:

   * **Private key type:** RSA
   * **Validity:** 15 years (default)
   * **Hostnames:** `ygnsh.com` and `*.ygnsh.com`
3. Download both:

   * **Certificate** (e.g., `origin.crt`)
   * **Private Key** (e.g., `origin.key`)

---

### 2. Upload certs to your Ubuntu server

```bash
sudo mkdir -p /etc/ssl/ygnsh
sudo nano /etc/ssl/ygnsh/origin.crt
# Paste your certificate content

sudo nano /etc/ssl/ygnsh/origin.key
# Paste your private key content

sudo chmod 600 /etc/ssl/ygnsh/origin.key
```

---

### 3. Configure Nginx for HTTPS

Edit your site config:

```bash
sudo nano /etc/nginx/sites-available/ygnsh.com
```

Example configuration:

```nginx
server {
    listen 443 ssl;
    server_name ygnsh.com www.ygnsh.com;

    access_log /var/log/nginx/ygnsh.com.access.log;
    error_log /var/log/nginx/ygnsh.com.error.log;

    ssl_certificate /etc/ssl/ygnsh/origin.crt;
    ssl_certificate_key /etc/ssl/ygnsh/origin.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/ygnsh.com;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}

# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name ygnsh.com www.ygnsh.com;
    return 301 https://$host$request_uri;
}
```

Then test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### 4. In Cloudflare Dashboard

* Go to **SSL/TLS → Overview**
* Set the mode to **Full (Strict)** ✅

---

### 5. Verify

Visit your site with HTTPS:

```bash
https://ygnsh.com
```

And run:

```bash
curl -I https://ygnsh.com --resolve ygnsh.com:443:YOUR_SERVER_IP
```

You should get `HTTP/1.1 200 OK`.

---

### 🧩 Alternative: Use Let’s Encrypt (if you prefer public CA)

If you want to use a Let’s Encrypt certificate instead of Cloudflare’s origin cert:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d ygnsh.com -d www.ygnsh.com
```

Then also set Cloudflare SSL mode to **Full (Strict)**.

---

Would you like me to generate the exact Nginx config file for your current setup (e.g., your document root and domain)?
