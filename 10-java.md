# Java (Spring Boot)

Configuring Nginx as a reverse proxy for a Java Spring Boot application.

---

## Folder Setup

- Domain: `api.example.com`
- Spring Boot app path: `/var/www/api.example.com`
- JAR file: `app.jar`
- Backend port: `8080` (default Spring Boot embedded Tomcat)

Spring Boot applications run with an **embedded Tomcat** server, so Nginx simply proxies HTTP requests to the port.

---

## Spring Boot Service Setup

Create a systemd service at `/etc/systemd/system/app.service`:

```ini
[Unit]
Description=Spring Boot Application
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/api.example.com
ExecStart=/usr/bin/java -jar /var/www/api.example.com/app.jar
Restart=always

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

Create `/etc/nginx/sites-available/api.example.com`:

```nginx
server {
    listen 80;
    server_name api.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /actuator/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # Restrict actuator endpoints
        allow 10.0.0.0/8;
        allow 172.16.0.0/12;
        deny all;
    }

    client_max_body_size 100M;
}
```

---

## Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/api.example.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Key Config Lines

| Directive | Purpose |
|-----------|---------|
| `proxy_pass http://127.0.0.1:8080;` | Forwards to Spring Boot embedded Tomcat |
| `location /actuator/` | Restricts Spring Boot Actuator to internal networks |
| `client_max_body_size 100M;` | Supports larger file uploads |

---

Next: [.NET](./11-dot-net.md)
