# Installation & Setup

Learn how to install and verify Nginx across modern Linux distributions, macOS, and Docker.

---

## 1. Ubuntu & Debian

### Using Default Repositories

```bash
# 1. Update package lists
sudo apt update

# 2. Install Nginx
sudo apt install -y nginx

# 3. Enable and start Nginx service
sudo systemctl enable nginx
sudo systemctl start nginx

# 4. Verify status
sudo systemctl status nginx
```

### Installing Latest Mainline from Official Nginx Repository

For cutting-edge features (like latest HTTP/3 support and security patches):

```bash
sudo apt install -y curl gnupg2 ca-certificates lsb-release ubuntu-keyring

curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null

echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list

sudo apt update
sudo apt install -y nginx
```

---

## 2. RHEL / Rocky Linux / AlmaLinux

```bash
sudo dnf install -y epel-release
sudo dnf install -y nginx
sudo systemctl enable --now nginx
```

---

## 3. macOS (Homebrew)

For local development and testing:

```bash
brew install nginx
brew services start nginx
```

Default config is located at `/opt/homebrew/etc/nginx/nginx.conf` (Apple Silicon) or `/usr/local/etc/nginx/nginx.conf` (Intel).

---

## 4. Docker (Instant Sandbox)

Run Nginx instantly without modifying your host system:

```bash
docker run -d --name my-nginx -p 8080:80 nginx:alpine
```

Visit `http://localhost:8080` in your browser.

---

## Service Management Cheat Sheet

| Action | Command | Purpose |
|:---|:---|:---|
| **Test Syntax** | `sudo nginx -t` | Validate config syntax before applying changes |
| **Zero-Downtime Reload** | `sudo systemctl reload nginx` | Re-read config without dropping active connections |
| **Restart Service** | `sudo systemctl restart nginx` | Full shutdown and restart |
| **Check Status** | `sudo systemctl status nginx` | Check active status and recent log messages |
| **Stop Server** | `sudo systemctl stop nginx` | Gracefully shut down the daemon |

> [!TIP]
> Always run `sudo nginx -t` before issuing `systemctl reload nginx`. This guarantees you never reload a broken configuration that could disrupt live traffic!

---

## Firewall Configuration

If your server runs **UFW (Uncomplicated Firewall)**:

```bash
# Allow both HTTP (80) and HTTPS (443)
sudo ufw allow 'Nginx Full'

# Verify status
sudo ufw status
```

If using **firewalld** (RHEL/CentOS):

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

[Next: HTTP Configuration →](./03-http-config.md)
