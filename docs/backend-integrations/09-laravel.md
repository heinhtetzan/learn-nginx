# Laravel & PHP-FPM

Configuring Nginx with PHP-FPM for Laravel or modern PHP applications on Ubuntu/Debian.

---

## Architecture Overview

```mermaid
flowchart LR
    Client["Client Browser"] -->|HTTPS (443)| Nginx["Nginx Web Server"]
    Nginx -->|Static Assets\n(/public/*.css, *.js)| Disk[("Filesystem\n/public")]
    Nginx -->|FastCGI Protocol\n(unix:/run/php/php8.2-fpm.sock)| FPM["PHP-FPM Worker Pool"]
    FPM -->|Executes index.php| Laravel["Laravel Application"]
```

---

## Production Nginx Configuration

Create `/etc/nginx/sites-available/laravel.example.com`:

```nginx
# 1. HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name laravel.example.com;

    return 301 https://$host$request_uri;
}

# 2. Main HTTPS Server Block
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name laravel.example.com;

    # Point to Laravel's public directory
    root /var/www/laravel.example.com/public;
    index index.php index.html;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/laravel.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/laravel.example.com/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # File upload limit
    client_max_body_size 50M;

    # Logging
    access_log /var/log/nginx/laravel.access.log;
    error_log /var/log/nginx/laravel.error.log warn;

    # Route all requests to index.php
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Pass PHP scripts to PHP-FPM
    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;

        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;

        # FastCGI Buffering
        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;
        fastcgi_read_timeout 120s;
    }

    # Deny access to hidden files (.env, .git, etc.) except .well-known
    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Static asset caching
    location ~* \.(jpg|jpeg|gif|png|css|js|ico|webp|svg|woff|woff2)$ {
        expires 30d;
        access_log off;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## Permissions & PHP-FPM Service

```bash
# Set appropriate directory ownership
sudo chown -R www-data:www-data /var/www/laravel.example.com/storage /var/www/laravel.example.com/bootstrap/cache
sudo chmod -R 775 /var/www/laravel.example.com/storage /var/www/laravel.example.com/bootstrap/cache

# Ensure PHP-FPM is running
sudo systemctl enable --now php8.2-fpm

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

[Next: Java (Spring Boot) →](./10-java.md)
