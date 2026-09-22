# C# ASP.NET Core (.NET)

Configuring Nginx as a reverse proxy for ASP.NET Core applications running on the high-performance **Kestrel** web server.

---

## Architecture Overview

```mermaid
flowchart LR
    Client["Client Browser"] -->|HTTPS (443)| Nginx["Nginx Reverse Proxy"]
    Nginx -->|Proxy Pass\n(http://127.0.0.1:5000)| Kestrel["Kestrel Web Server\n(dotnet app.dll)"]
    Nginx -->|WebSocket Upgrade| SignalR["SignalR Real-time Hub"]
```

---

## .NET Systemd Service

Create `/etc/systemd/system/kestrel-app.service`:

```ini
[Unit]
Description=ASP.NET Core Kestrel Application
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/app.example.com
ExecStart=/usr/bin/dotnet /var/www/app.example.com/app.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=dotnet-app
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now kestrel-app
```

---

## Nginx Reverse Proxy Configuration

Create `/etc/nginx/sites-available/app.example.com`:

```nginx
upstream kestrel_app {
    server 127.0.0.1:5000;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name app.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name app.example.com;

    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    client_max_body_size 50M;

    location / {
        proxy_pass http://kestrel_app;
        proxy_http_version 1.1;

        # WebSocket / SignalR Support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        # Standard Forwarded Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 100s;
    }

    # Deny access to hidden files
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## ASP.NET Core Forwarded Headers Middleware

In ASP.NET Core `Program.cs`, you must configure `ForwardedHeadersMiddleware` so that `HttpContext.Connection.RemoteIpAddress` and `Request.Scheme` correctly reflect the original client:

```csharp
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

---

[Next: Go Web Application →](./12-go.md)
