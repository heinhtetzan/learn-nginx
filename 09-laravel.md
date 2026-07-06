# Laravel (PHP-FPM)

Configuring Nginx with PHP-FPM for Laravel or any PHP application on Ubuntu.

---

## Folder Setup

- Domain: `example.com`
- Laravel app path: `/var/www/example.com`
- PHP-FPM socket: `/run/php/php8.2-fpm.sock` (adjust version as needed)

Laravel's public files are in `/var/www/example.com/public` — Nginx points its `root` here.

---

## Nginx Configuration

Create `/etc/nginx/sites-available/example.com`:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/example.com/public;
    index index.php index.html;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    root /var/www/example.com/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    client_max_body_size 50M;
}
```

---

## Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Check PHP-FPM

```bash
sudo systemctl status php8.2-fpm
```

If not running:

```bash
sudo systemctl start php8.2-fpm
sudo systemctl enable php8.2-fpm
```

---

## Permissions

```bash
sudo chown -R www-data:www-data /var/www/example.com/storage /var/www/example.com/bootstrap/cache
sudo chmod -R 775 /var/www/example.com/storage /var/www/example.com/bootstrap/cache
```

---

## Cloudflare "Full (Strict)" Mode

Replace SSL lines with Cloudflare Origin Certificates:

```nginx
ssl_certificate /etc/ssl/certs/cloudflare.crt;
ssl_certificate_key /etc/ssl/private/cloudflare.key;
```

---

## How It Works

1. Nginx receives requests at `example.com`.
2. Static files (CSS, JS, images) are served directly from `/public`.
3. Dynamic requests are sent to `index.php` via PHP-FPM.
4. PHP-FPM runs Laravel and returns HTML through Nginx.

---

## Key Config Lines

| Directive | Purpose |
|-----------|---------|
| `root /var/www/example.com/public;` | Points to Laravel's public directory |
| `try_files $uri $uri/ /index.php?$query_string;` | Passes all routes to Laravel |
| `fastcgi_pass unix:/run/php/php8.2-fpm.sock;` | Connects to PHP-FPM |
| `location ~ /\.(?!well-known).* { deny all; }` | Blocks hidden files |
| `client_max_body_size 50M;` | Controls upload limits |

---

Next: [Java (Spring Boot)](./10-java.md)
