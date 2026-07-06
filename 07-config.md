# Configuration Reference

Understanding the most common Nginx configuration directives and their purposes.

---

## Basic Structure

Configuration files are located at:

```
/etc/nginx/nginx.conf
/etc/nginx/sites-available/
/etc/nginx/sites-enabled/
```

A typical site config:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/example.com/html;
    index index.html index.htm index.php;

    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

## Section-by-Section Breakdown

### `server { }`

Defines a **virtual host** — one website or application. Multiple `server` blocks can exist for different domains.

### `listen`

Tells Nginx which **port** to listen on:

```nginx
listen 80;       # HTTP
listen 443 ssl;  # HTTPS (requires SSL)
```

### `server_name`

Specifies which **domain names** the block applies to:

```nginx
server_name example.com www.example.com;
```

### `root`

Sets the **directory where site files are stored**:

```nginx
root /var/www/example.com/html;
```

A request to `example.com/about.html` serves `/var/www/example.com/html/about.html`.

### `index`

Defines which file to load when a directory is requested:

```nginx
index index.html index.htm index.php;
```

### `location`

Handles **specific request paths or patterns**:

```nginx
location / {
    try_files $uri $uri/ =404;
}
```

Other examples:

```nginx
location /images/ {
    root /var/www/static;
}

location /api/ {
    proxy_pass http://127.0.0.1:8080;
}
```

### `access_log` and `error_log`

Sets log file locations:

```nginx
access_log /var/log/nginx/example.access.log;
error_log /var/log/nginx/example.error.log;
```

### `ssl_certificate` and `ssl_certificate_key`

Used for HTTPS:

```nginx
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

### `return`

Used for redirects:

```nginx
return 301 https://$host$request_uri;
```

### `proxy_pass`

Forwards traffic to a backend (reverse proxy):

```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
}
```

---

## Combined Config Example

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

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Summary Table

| Directive | Purpose |
|-----------|---------|
| `server` | Defines one website/app |
| `listen` | Sets the port (80 = HTTP, 443 = HTTPS) |
| `server_name` | Matches the domain |
| `root` | Folder containing website files |
| `index` | Default file to load |
| `location` | Handle specific paths or patterns |
| `try_files` | Check for existing files before errors |
| `proxy_pass` | Send requests to backend app |
| `ssl_certificate` | Enable HTTPS |
| `access_log`, `error_log` | Logging for monitoring |

---

Next: [Microservices API Gateway](./08-microservice.md)
