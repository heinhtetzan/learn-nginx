# HTTP Configuration

Setting up an Nginx server block to serve a static website over HTTP (port 80).

---

## Configuration File

Create `/etc/nginx/sites-available/example.com`:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name example.com www.example.com;

    root /var/www/example.com;
    index index.html index.htm;

    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

## Setup Steps

1. **Create the web root:**

   ```bash
   sudo mkdir -p /var/www/example.com
   sudo chown -R $USER:$USER /var/www/example.com
   ```

2. **Create a test file:**

   ```bash
   echo "<h1>Welcome to example.com</h1>" | sudo tee /var/www/example.com/index.html
   ```

3. **Enable the site:**

   ```bash
   sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
   ```

4. **Test Nginx config:**

   ```bash
   sudo nginx -t
   ```

5. **Restart Nginx:**

   ```bash
   sudo systemctl restart nginx
   ```

---

## Result

- `http://example.com` and `http://www.example.com` will load your site.
- No HTTPS, no redirects, no SSL configuration.

---

Next: [HTTPS & SSL Configuration](./04-https-config.md)
