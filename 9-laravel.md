Excellent 👏 — let’s go over how to properly configure **Nginx for a Laravel or any PHP app** on Ubuntu.

Laravel runs on **PHP-FPM**, and Nginx serves as the **web server + reverse proxy** to PHP.

---

## 🧩 1. Folder Setup

Let’s assume:

* Domain: `example.com`
* Laravel app path: `/var/www/example.com`
* PHP-FPM socket: `/run/php/php8.2-fpm.sock` (adjust version as needed)

Your Laravel public files must be in:

```
/var/www/example.com/public
```

That’s where Nginx points its `root`.

---

## ⚙️ 2. Nginx Configuration

Create a new file:

```bash
sudo nano /etc/nginx/sites-available/example.com
```

Paste this config 👇

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/example.com/public;
    index index.php index.html;

    # Redirect all HTTP to HTTPS (optional)
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name example.com www.example.com;

    # SSL (Let's Encrypt or manual)
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    root /var/www/example.com/public;
    index index.php index.html;

    # Main Laravel handling
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM handling
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock; # adjust version if needed
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Security: deny access to sensitive files
    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Optional: increase upload size (e.g., for file uploads)
    client_max_body_size 50M;
}
```

---

## 🧱 3. Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## ⚙️ 4. Check PHP-FPM Is Running

```bash
sudo systemctl status php8.2-fpm
```

If not running, start it:

```bash
sudo systemctl start php8.2-fpm
sudo systemctl enable php8.2-fpm
```

---

## 🧰 5. Permissions

Make sure Laravel’s `storage` and `bootstrap/cache` folders are writable:

```bash
sudo chown -R www-data:www-data /var/www/example.com/storage /var/www/example.com/bootstrap/cache
sudo chmod -R 775 /var/www/example.com/storage /var/www/example.com/bootstrap/cache
```

---

## 🔒 (Optional) If Using Cloudflare “Full (Strict)” Mode

Replace the SSL certificate lines with Cloudflare Origin Certificates:

```nginx
ssl_certificate /etc/ssl/certs/cloudflare.crt;
ssl_certificate_key /etc/ssl/private/cloudflare.key;
```

---

## 🧠 How It Works

1. Nginx receives requests at `example.com`.
2. Static files (CSS, JS, images) are served directly from `/public`.
3. For dynamic requests:

   * Nginx sends them to `index.php` via PHP-FPM.
   * PHP-FPM runs Laravel and returns HTML back through Nginx.
4. Laravel handles routing internally.

---

## ✅ Key Config Lines to Remember

| Directive                                        | Purpose                              |
| ------------------------------------------------ | ------------------------------------ |
| `root /var/www/example.com/public;`              | Points to Laravel’s public directory |
| `try_files $uri $uri/ /index.php?$query_string;` | Passes all routes to Laravel         |
| `fastcgi_pass unix:/run/php/php8.2-fpm.sock;`    | Connects to PHP-FPM                  |
| `location ~ /\.(?!well-known).* { deny all; }`   | Blocks hidden files                  |
| `client_max_body_size 50M;`                      | Controls upload limits               |

---

Would you like me to show a version of this config **without HTTPS** (for local development or testing)?
 