# Python (FastAPI, Flask, Django)

Configuring Nginx as a reverse proxy for Python web applications running behind **Uvicorn** (ASGI) or **Gunicorn** (WSGI).

---

## Architecture Overview

```mermaid
flowchart LR
    Client["Client"] -->|HTTPS (443)| Nginx["Nginx Reverse Proxy"]
    
    subgraph PythonApps["Python Application Layer"]
        Uvicorn["Uvicorn / ASGI\n(FastAPI / Starlette)\nUnix Socket / 127.0.0.1:8000"]
        Gunicorn["Gunicorn / WSGI\n(Django / Flask)\nUnix Socket / 127.0.0.1:8001"]
    end

    Nginx -->|Proxy Pass| Uvicorn
    Nginx -->|Proxy Pass| Gunicorn
```

---

## 1. FastAPI with Uvicorn (ASGI)

### Running Uvicorn as a Systemd Service

Create `/etc/systemd/system/fastapi.service`:

```ini
[Unit]
Description=FastAPI Uvicorn Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/my-fastapi-app
ExecStart=/var/www/my-fastapi-app/venv/bin/uvicorn main:app --uds /tmp/uvicorn.sock --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

### Nginx Server Block (Unix Domain Socket)

Unix sockets are ~10–20% faster than localhost TCP loops:

```nginx
upstream fastapi_app {
    server unix:/tmp/uvicorn.sock;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name fastapi.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name fastapi.example.com;

    ssl_certificate /etc/letsencrypt/live/fastapi.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fastapi.example.com/privkey.pem;

    client_max_body_size 25M;

    location / {
        proxy_pass http://fastapi_app;
        proxy_http_version 1.1;
        proxy_set_header Connection "";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support (often used in FastAPI)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 120s;
    }
}
```

---

## 2. Django with Gunicorn (WSGI)

Django requires Nginx to serve static (`/static/`) and media (`/media/`) files directly for optimal performance.

```nginx
upstream django_app {
    server 127.0.0.1:8000;
}

server {
    listen 443 ssl;
    server_name django.example.com;

    ssl_certificate /etc/letsencrypt/live/django.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/django.example.com/privkey.pem;

    # Serve static assets directly from disk
    location /static/ {
        alias /var/www/my-django-app/staticfiles/;
        expires 30d;
        access_log off;
    }

    # Serve uploaded user media directly
    location /media/ {
        alias /var/www/my-django-app/media/;
        expires 7d;
        access_log off;
    }

    # Forward all dynamic views to Gunicorn
    location / {
        proxy_pass http://django_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

[Next: Node.js Backend Integration →](./13-nodejs.md)
