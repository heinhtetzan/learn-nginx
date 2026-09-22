# 03. Rosetta Stone: Configuration Translation Matrix

Direct side-by-side configuration translations across **Apache**, **NGINX**, **Caddy**, and **Ferron**.

---

## 1. Static Website Hosting & SPA Fallback

### Apache (`httpd.conf`)
```apache
<VirtualHost *:80>
    ServerName example.com
    DocumentRoot /var/www/html
    <Directory /var/www/html>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

### NGINX (`nginx.conf`)
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Caddy (`Caddyfile`)
```caddy
example.com {
    root * /var/www/html
    try_files {path} {path}/ /index.html
    file_server
}
```

### Ferron (`ferron.kdl`)
```kdl
site "example.com" {
    root "/var/www/html"
    route "/*" {
        file_server
        try_files "$uri" "$uri/" "/index.html"
    }
}
```

---

## 2. Reverse Proxy with Header Propagation

### Apache
```apache
<VirtualHost *:80>
    ServerName api.example.com
    ProxyPreserveHost On
    RequestHeader set X-Real-IP %{REMOTE_ADDR}s
    RequestHeader set X-Forwarded-For "%{REMOTE_ADDR}s"
    RequestHeader set X-Forwarded-Proto "%{REQUEST_SCHEME}s"
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
```

### NGINX
```nginx
server {
    listen 80;
    server_name api.example.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Caddy
```caddy
api.example.com {
    reverse_proxy 127.0.0.1:3000
}
```

### Ferron
```kdl
site "api.example.com" {
    route "/*" {
        proxy "http://127.0.0.1:3000" {
            preserve_host true
        }
    }
}
```

---

## 3. Load Balancing Across Upstream Backends

### Apache
```apache
<Proxy "balancer://app_cluster">
    BalancerMember http://10.0.0.1:8080
    BalancerMember http://10.0.0.2:8080
    ProxySet lbmethod=bybusyness
</Proxy>
<VirtualHost *:80>
    ServerName app.example.com
    ProxyPass / balancer://app_cluster/
</VirtualHost>
```

### NGINX
```nginx
upstream app_cluster {
    least_conn;
    server 10.0.0.1:8080;
    server 10.0.0.2:8080;
    keepalive 32;
}
server {
    listen 80;
    server_name app.example.com;
    location / {
        proxy_pass http://app_cluster;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
}
```

### Caddy
```caddy
app.example.com {
    reverse_proxy 10.0.0.1:8080 10.0.0.2:8080 {
        lb_policy least_conn
        health_uri /healthz
        health_interval 5s
    }
}
```

### Ferron
```kdl
upstream "app_cluster" {
    server "10.0.0.1:8080"
    server "10.0.0.2:8080"
    policy "least_conn"
    health_check "/healthz" 5s
}
site "app.example.com" {
    route "/*" {
        proxy "upstream://app_cluster"
    }
}
```

---

## 4. Security Headers Comparison

| Header | Apache | NGINX | Caddy | Ferron |
| :--- | :--- | :--- | :--- | :--- |
| **HSTS** | `Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"` | `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;` | `header Strict-Transport-Security "max-age=31536000; includeSubDomains"` | `header "Strict-Transport-Security" "max-age=31536000"` |
| **X-Frame-Options** | `Header always set X-Frame-Options "DENY"` | `add_header X-Frame-Options "DENY" always;` | `header X-Frame-Options "DENY"` | `header "X-Frame-Options" "DENY"` |
| **X-Content-Type** | `Header always set X-Content-Type-Options "nosniff"` | `add_header X-Content-Type-Options "nosniff" always;` | `header X-Content-Type-Options "nosniff"` | `header "X-Content-Type-Options" "nosniff"` |
| **Server Token Removal** | `ServerTokens Prod` | `server_tokens off;` | `header -Server` | `server_tokens false` |
