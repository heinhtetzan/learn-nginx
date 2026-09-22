# 01. Apache: Installation & Setup Guide

A production-ready guide to installing, configuring, and verifying the Apache HTTP Server across major enterprise Linux distributions, macOS, and Docker.

---

## 1. Installation Across Operating Systems

### Ubuntu / Debian
On Debian-based systems, the package and service name is `apache2`:
```bash
# 1. Update package repository
sudo apt update

# 2. Install Apache and utility tools
sudo apt install -y apache2 apache2-utils

# 3. Enable and start the systemd service
sudo systemctl enable apache2
sudo systemctl start apache2

# 4. Verify service status
sudo systemctl status apache2
```

### RHEL / Rocky Linux / AlmaLinux / CentOS
On Red Hat-based systems, the package and service name is `httpd`:
```bash
# 1. Install Apache HTTP Server
sudo dnf install -y httpd

# 2. Configure firewall to allow HTTP (80) and HTTPS (443)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# 3. Enable and start the service
sudo systemctl enable --now httpd

# 4. Verify service status
sudo systemctl status httpd
```

### macOS (Homebrew)
```bash
# 1. Install via Homebrew
brew install httpd

# 2. Start service
brew services start httpd
```

### Docker (Alpine Linux)
```bash
# Run lightweight official container
docker run -d --name my-apache -p 80:80 httpd:alpine
```

---

## 2. Directory Structure Differences (Debian vs. RHEL)

| Component | Debian / Ubuntu (`apache2`) | RHEL / Rocky (`httpd`) |
| :--- | :--- | :--- |
| **Main Config** | `/etc/apache2/apache2.conf` | `/etc/httpd/conf/httpd.conf` |
| **Site Configs** | `/etc/apache2/sites-available/` & `sites-enabled/` | `/etc/httpd/conf.d/*.conf` |
| **Module Configs** | `/etc/apache2/mods-available/` & `mods-enabled/` | `/etc/httpd/conf.modules.d/*.conf` |
| **Default Document Root**| `/var/www/html` | `/var/www/html` |
| **Log Directory** | `/var/log/apache2/` | `/var/log/httpd/` |

---

## 3. Enabling Essential Production Modules

In Ubuntu/Debian, Apache uses helper scripts (`a2enmod`, `a2dismod`, `a2ensite`, `a2dissite`):

```bash
# Enable Event MPM (disable prefork first if active)
sudo a2dismod mpm_prefork mpm_worker
sudo a2enmod mpm_event

# Enable SSL/TLS, Rewrites, Headers, and Proxy modules
sudo a2enmod ssl rewrite headers proxy proxy_http proxy_balancer proxy_wstunnel lbmethod_bybusyness

# Test configuration before applying
sudo apachectl configtest

# Apply changes with zero downtime
sudo systemctl reload apache2
```

---

## 4. Verification

Run the following commands to confirm Apache is listening and responding:

```bash
# Check version and compiled modules
apachectl -V

# Verify HTTP response headers
curl -I http://localhost
# HTTP/1.1 200 OK
# Server: Apache/...
```
