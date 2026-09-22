# Java (Spring Boot)

Configuring Nginx as a reverse proxy for a Java Spring Boot application running on embedded Tomcat.

---

## Architecture Overview

```mermaid
flowchart LR
    Client["Client Browser"] -->|HTTPS (443)| Nginx["Nginx Reverse Proxy"]
    Nginx -->|Proxy Pass\n(http://127.0.0.1:8080)| Tomcat["Embedded Tomcat / Spring Boot\n(app.jar)"]
    Nginx -->|Restricted Access| Actuator["/actuator/ (Metrics / Health)\nAllowed only from VPC"]
```

---

## Spring Boot Systemd Service

Create `/etc/systemd/system/springboot-app.service`:

```ini
[Unit]
Description=Spring Boot Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/api.example.com
ExecStart=/usr/bin/java -Xms512m -Xmx2048m -jar /var/www/api.example.com/app.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now springboot-app
```

---

## Nginx Reverse Proxy Configuration

Create `/etc/nginx/sites-available/api.example.com`:

```nginx
upstream spring_boot_upstream {
    server 127.0.0.1:8080;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name api.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    client_max_body_size 100M;

    # Forward traffic to Spring Boot
    location / {
        proxy_pass http://spring_boot_upstream;
        proxy_http_version 1.1;
        proxy_set_header Connection "";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;

        # Buffer & Timeouts
        proxy_connect_timeout 10s;
        proxy_read_timeout 90s;
    }

    # Restrict Spring Boot Actuator to private internal networks
    location /actuator/ {
        # Allow internal subnets
        allow 10.0.0.0/8;
        allow 172.16.0.0/12;
        allow 192.168.0.0/16;
        allow 127.0.0.1;
        deny all;

        proxy_pass http://spring_boot_upstream;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
    }
}
```

---

## Spring Boot `application.properties`

To ensure Spring Boot correctly detects the client's original scheme (HTTPS) and remote IP from Nginx headers, enable forwarded headers:

```properties
server.forward-headers-strategy=native
```

---

[Next: C# (.NET) Integration →](./11-dot-net.md)
