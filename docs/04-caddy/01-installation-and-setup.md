# 01. Caddy: Installation & Setup Guide

A production-ready guide to installing and configuring Caddy across major Linux distributions, macOS, and Docker.

---

## 1. Installation Across Operating Systems

### Ubuntu / Debian (Official Repository)
```bash
# 1. Install prerequisites
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl

# 2. Add Caddy GPG signing key
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg

# 3. Add Caddy repository
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list

# 4. Install Caddy
sudo apt update
sudo apt install -y caddy

# 5. Enable and start systemd service
sudo systemctl enable --now caddy
```

### RHEL / Rocky Linux / Fedora
```bash
# 1. Enable Caddy copr repository
sudo dnf install -y 'dnf-command(copr)'
sudo dnf copr enable -y @caddy/caddy

# 2. Install Caddy
sudo dnf install -y caddy

# 3. Enable and start service
sudo systemctl enable --now caddy
```

### macOS (Homebrew)
```bash
brew install caddy
brew services start caddy
```

### Docker (Alpine Linux)
```bash
# Run Caddy with local Caddyfile and persistent data volume for certificates
docker run -d --name my-caddy \
  -p 80:80 -p 443:443 -p 443:443/udp \
  -v /etc/caddy/Caddyfile:/etc/caddy/Caddyfile \
  -v caddy_data:/data \
  caddy:alpine
```

---

## 2. Directory Structure

```
/etc/caddy/
└── Caddyfile       # Primary human-readable configuration file
/var/lib/caddy/
└── .local/share/caddy/   # Storage for automatic TLS certificates (ACME)
```

---

## 3. Verification

```bash
# 1. Check version
caddy version

# 2. Validate Caddyfile syntax
caddy validate --config /etc/caddy/Caddyfile

# 3. Check service status
sudo systemctl status caddy

# 4. Probe HTTP endpoint
curl -I http://localhost
```
