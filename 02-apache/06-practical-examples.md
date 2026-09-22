# 06. Apache: Practical Hands-On & Code Samples

Complete, copy-paste ready configurations for common real-world scenarios, accompanied by troubleshooting and diagnostic commands.

---

## 1. Production Static Website with HTTPS & Gzip

```apache
# /etc/apache2/sites-available/static-site.conf

<VirtualHost *:80>
    ServerName static.company.com
    ServerAdmin admin@company.com
    Redirect permanent / https://static.company.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName static.company.com
    DocumentRoot /var/www/static

    # TLS 1.3 Configuration
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/static.crt
    SSLCertificateKeyFile /etc/ssl/private/static.key
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite HIGH:!aNULL:!MD5

    # Static Directory Permissions
    <Directory /var/www/static>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    # Compression Configuration
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json image/svg+xml
    </IfModule>

    # Browser Caching Headers
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType image/webp "access plus 1 year"
        ExpiresByType image/png  "access plus 1 year"
        ExpiresByType text/css   "access plus 30 days"
        ExpiresByType application/javascript "access plus 30 days"
    </IfModule>

    # Security Headers
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

    # Logging
    ErrorLog /var/log/apache2/static_error.log
    CustomLog /var/log/apache2/static_access.log combined
</VirtualHost>
```

---

## 2. Reverse Proxy with Custom Headers & Upstream Timeout

```apache
# /etc/apache2/sites-available/api-proxy.conf

<VirtualHost *:80>
    ServerName api.company.com

    ProxyPreserveHost On
    ProxyTimeout 30

    # Forward client IP context
    RequestHeader set X-Real-IP %{REMOTE_ADDR}s
    RequestHeader set X-Forwarded-For "%{REMOTE_ADDR}s"
    RequestHeader set X-Forwarded-Proto "%{REQUEST_SCHEME}s"

    # Forward traffic to internal API
    ProxyPass / http://10.0.0.50:8000/
    ProxyPassReverse / http://10.0.0.50:8000/
</VirtualHost>
```

---

## 3. Essential Diagnostic & Troubleshooting Commands

```bash
# 1. Test configuration syntax (Do this before every reload!)
sudo apachectl configtest

# 2. View all loaded virtual hosts and port bindings
sudo apachectl -S

# 3. List all compiled and dynamically loaded modules
sudo apachectl -M

# 4. Graceful zero-downtime reload
sudo apachectl -k graceful

# 5. Tail live error logs in real time
tail -f /var/log/apache2/error.log
```

---

**Next Chapter:** [03. NGINX: 01. Installation & Setup](../03-nginx/01-installation-and-setup.md)

