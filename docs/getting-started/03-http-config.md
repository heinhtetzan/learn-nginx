# HTTP Configuration

Learn how to configure an Nginx server block to serve a static website over HTTP (port 80).

---

## Server Block Configuration

On Debian/Ubuntu systems, site configurations live in `/etc/nginx/sites-available/` and are activated by symlinking to `/etc/nginx/sites-enabled/`.

Create `/etc/nginx/sites-available/example.com`:

```nginx
server {
    # Listen on IPv4 and IPv6 port 80
    listen 80;
    listen [::]:80;

    server_name example.com www.example.com;

    # Document root directory
    root /var/www/example.com;
    index index.html index.htm;

    # Logging
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log warn;

    # Standard static file handling
    location / {
        try_files $uri $uri/ =404;
    }

    # Custom error pages
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        internal;
    }
}
```

---

## Step-by-Step Setup

### 1. Create Web Root & Test Content

```bash
sudo mkdir -p /var/www/example.com

# Create an index.html file
sudo tee /var/www/example.com/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello Nginx!</title>
    <style>body { font-family: sans-serif; text-align: center; padding: 50px; }</style>
</head>
<body>
    <h1>Welcome to example.com!</h1>
    <p>Served by Nginx.</p>
</body>
</html>
EOF

# Set ownership to www-data (or current user)
sudo chown -R www-data:www-data /var/www/example.com
sudo chmod -R 755 /var/www/example.com
```

### 2. Enable the Site Configuration

Symlink the file into `sites-enabled`:

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
```

### 3. Test and Reload

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Handling Single Page Applications (SPAs)

For modern frontend applications built with **React**, **Vue**, **Angular**, or **Svelte** using client-side routing (e.g. React Router), change `try_files` to route unknown paths back to `index.html`:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

This prevents `404 Not Found` when a user navigates directly to a sub-route like `example.com/dashboard`.

---

## How `try_files` Works

The `try_files` directive checks for files in sequential order:

```nginx
try_files $uri $uri/ =404;
```

1. **`$uri`**: Checks if the exact file exists (e.g. `/style.css`).
2. **`$uri/`**: Checks if a directory exists, looking for `index.html` within it.
3. **`=404`**: If neither exists, returns an HTTP 404 status code.

---

[Next: HTTPS & SSL Configuration →](../core-concepts/04-https-config.md)
