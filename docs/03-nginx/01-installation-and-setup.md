# 01. NGINX: Installation & Setup Guide

A production-ready guide to installing and configuring NGINX from official repositories across enterprise Linux distributions, macOS, and Docker.

---

## 1. Mainline vs. Stable: Which Should You Install?

NGINX maintains two branches:
* **Mainline**: Contains the latest features, security patches, bug fixes, and performance improvements. **Recommended for production** by the core NGINX engineering team.
* **Stable**: Only receives critical security updates. Does not receive bug fixes or protocol updates (e.g., newer HTTP/3 enhancements).

---

## 2. Installation Across Operating Systems

### Ubuntu / Debian (Official NGINX Repository)
```bash
# 1. Install prerequisites
sudo apt install -y curl gnupg2 ca-certificates lsb-release ubuntu-keyring

# 2. Import official NGINX signing key
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null

# 3. Add official Mainline repository
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list

# 4. Install NGINX
sudo apt update
sudo apt install -y nginx

# 5. Enable and start service
sudo systemctl enable --now nginx
```

### RHEL / Rocky Linux / AlmaLinux
```bash
# 1. Install EPEL repository
sudo dnf install -y epel-release

# 2. Install NGINX
sudo dnf install -y nginx

# 3. Allow HTTP/HTTPS through firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# 4. Enable and start service
sudo systemctl enable --now nginx
```

### macOS (Homebrew)
```bash
brew install nginx
brew services start nginx
```

### Docker
```bash
docker run -d --name my-nginx -p 80:80 nginx:alpine
```

---

## 3. Directory Structure

```
/etc/nginx/
├── nginx.conf          # Main entrypoint configuration
├── conf.d/             # Virtual host configurations (*.conf)
├── mime.types          # MIME type mappings
└── fastcgi_params      # FastCGI environment variables
/var/log/nginx/
├── access.log          # Access log
└── error.log           # Error log
```

---

## 4. Verification

```bash
# 1. Check version and compiled modules
nginx -V

# 2. Test configuration syntax
sudo nginx -t

# 3. Check service status
sudo systemctl status nginx

# 4. Probe HTTP endpoint
curl -I http://localhost
```
