# 04. Apache: Monolith Deployments

Monolithic applications combine application code, background workers, and static assets on a single host or identical horizontally-scaled hosts. Apache acts as the edge entry point: serving static assets, terminating TLS, and forwarding dynamic requests to local runtimes.

---

## 1. Monolith Traffic Topology

```mermaid
flowchart TD
    Client["Client Request (HTTPS)"] --> Apache["<b>Apache Edge (Port 443)</b><br/>mpm_event + mod_ssl + mod_deflate"]

    subgraph Host["Monolith Server Host"]
        direction TB
        Apache -->|Static Assets (*.css, *.js, *.png)| Disk["Local Filesystem / Page Cache"]
        Apache -->|PHP Requests (*.php)| UDS["Unix Domain Socket<br/>/run/php/php8.2-fpm.sock"]
        Apache -->|Python Requests (/app/*)| Gunicorn["Gunicorn Socket<br/>/run/gunicorn/app.sock"]
        
        UDS --> PHPFPM["PHP-FPM Worker Pool"]
        Gunicorn --> Python["Django / Flask App"]
    end
```

---

## 2. Production Monolith: PHP-FPM (Laravel / WordPress)

```apache
<VirtualHost *:80>
    ServerName app.company.com
    Redirect permanent / https://app.company.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName app.company.com
    DocumentRoot /var/www/app/public

    # SSL / TLS 1.3 Configuration
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/app.crt
    SSLCertificateKeyFile /etc/ssl/private/app.key
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite HIGH:!aNULL:!MD5

    # 1. Static Asset Caching (mod_expires)
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType image/webp "access plus 1 year"
        ExpiresByType image/png  "access plus 1 year"
        ExpiresByType text/css   "access plus 1 month"
        ExpiresByType application/javascript "access plus 1 month"
    </IfModule>

    # 2. Dynamic Gzip Compression (mod_deflate)
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
    </IfModule>

    # 3. Front Controller & Filesystem Security
    <Directory /var/www/app/public>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted

        # Route all non-file requests to index.php
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^(.*)$ index.php [QSA,L]
    </Directory>

    # 4. Route PHP to PHP-FPM via Unix Domain Socket
    <FilesMatch \.php$>
        SetHandler "proxy:unix:/run/php/php8.2-fpm.sock|fcgi://localhost/"
    </FilesMatch>

    # Deny access to hidden files (.env, .git)
    <FilesMatch "^\.">
        Require all denied
    </FilesMatch>

    # 5. File Upload Limit (50MB)
    LimitRequestBody 52428800
</VirtualHost>
```

---

## 3. Python WSGI Monolith (Gunicorn / Django)

```apache
<VirtualHost *:443>
    ServerName python.company.com
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/app.crt
    SSLCertificateKeyFile /etc/ssl/private/app.key

    # Direct static asset serving
    Alias /static/ /var/www/django/static/
    <Directory /var/www/django/static>
        Require all granted
        ExpiresActive On
        ExpiresDefault "access plus 30 days"
    </Directory>

    # Forward dynamic requests to Gunicorn Unix Socket
    ProxyPreserveHost On
    ProxyPass /static/ !
    ProxyPass / unix:/run/gunicorn/app.sock|http://127.0.0.1/
    ProxyPassReverse / unix:/run/gunicorn/app.sock|http://127.0.0.1/

    ProxyTimeout 60
</VirtualHost>
```
