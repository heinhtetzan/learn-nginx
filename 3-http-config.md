Got it ✅ — you want an **Nginx config for `ygnsh.com`** that serves **only HTTP (port 80)**, no HTTPS or redirect to HTTPS.

Here’s a minimal and clean configuration you can use:

---

### 📄 `/etc/nginx/sites-available/ygnsh.com`

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name ygnsh.com www.ygnsh.com;

    root /var/www/ygnsh.com;
    index index.html index.htm;

    access_log /var/log/nginx/ygnsh.com.access.log;
    error_log /var/log/nginx/ygnsh.com.error.log;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

### 📂 Setup steps

1. **Create the web root:**

   ```bash
   sudo mkdir -p /var/www/ygnsh.com
   sudo chown -R $USER:$USER /var/www/ygnsh.com
   ```
2. **Create a test file:**

   ```bash
   echo "<h1>Welcome to ygnsh.com</h1>" | sudo tee /var/www/ygnsh.com/index.html
   ```
3. **Enable the site:**

   ```bash
   sudo ln -s /etc/nginx/sites-available/ygnsh.com /etc/nginx/sites-enabled/
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

### ✅ Result

* `http://ygnsh.com` and `http://www.ygnsh.com` will load your site.
* No HTTPS, no redirects, no SSL configuration.

---

Would you like me to include a **custom 404 page** or **reverse proxy** setup (for example, to forward requests to a backend app on port 3000)?
