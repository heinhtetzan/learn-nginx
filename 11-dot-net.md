# C# (.NET)

Configuring Nginx as a reverse proxy for an ASP.NET Core application running on Kestrel.

---

## Folder Setup

- Domain: `app.example.com`
- .NET app path: `/var/www/app.example.com`
- Backend port: `5000` (default ASP.NET Core Kestrel)

ASP.NET Core uses **Kestrel** as its internal web server. Nginx proxies public traffic to Kestrel.

---

## .NET Service Setup

Create a systemd service at `/etc/systemd/system/app.service`:

```ini
[Unit]
Description=ASP.NET Core Application
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/app.example.com
ExecStart=/usr/bin/dotnet /var/www/app.example.com/app.dll
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable app
sudo systemctl start app
```

---

## Nginx Configuration

Create `/etc/nginx/sites-available/app.example.com`:

```nginx
server {
    listen 80;
    server_name app.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name app.example.com;

    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
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
sudo ln -s /etc/nginx/sites-available/app.example.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Configure Kestrel for Reverse Proxy

In `appsettings.json`, set Kestrel to listen on the correct URL:

```json
{
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://127.0.0.1:5000"
      }
    }
  }
}
```

---

## Key Config Lines

| Directive | Purpose |
|-----------|---------|
| `proxy_pass http://127.0.0.1:5000;` | Forwards to ASP.NET Core Kestrel |
| `proxy_set_header Upgrade $http_upgrade;` | Supports SignalR / WebSocket connections |
| `proxy_cache_bypass $http_upgrade;` | Prevents caching WebSocket upgrades |

---

Next: [Go](./12-go.md)
