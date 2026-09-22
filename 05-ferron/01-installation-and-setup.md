# 01. Ferron: Installation & Setup Guide

A production-ready guide to installing and configuring **Ferron** (formerly Project Karpacz), the modern, high-performance, memory-safe web server written in **Rust**.

---

## 1. Installation Across Environments

### Option A: Pre-built Binary (Recommended for Linux/macOS)
```bash
# 1. Download latest release for your architecture
curl -LO https://github.com/ferronweb/ferron/releases/latest/download/ferron-linux-x86_64.tar.gz

# 2. Extract binary
tar -xzf ferron-linux-x86_64.tar.gz

# 3. Move binary to system PATH
sudo mv ferron /usr/local/bin/
sudo chmod +x /usr/local/bin/ferron

# 4. Verify installation
ferron --version
```

### Option B: Install via Rust Cargo
```bash
# Requires Rust toolchain (rustup)
cargo install ferron
```

### Option C: Docker Container
```bash
docker run -d --name my-ferron \
  -p 80:80 -p 443:443 \
  -v /etc/ferron/ferron.kdl:/etc/ferron/ferron.kdl:ro \
  -v /var/www/html:/var/www/html:ro \
  ferronweb/ferron:latest
```

---

## 2. Directory Structure

```
/etc/ferron/
└── ferron.kdl        # Main configuration file in KDL format
/var/log/ferron/      # Structured application logs
```

---

## 3. Creating a Systemd Service

```ini
# /etc/systemd/system/ferron.service

[Unit]
Description=Ferron Web Server
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
ExecStart=/usr/local/bin/ferron --config /etc/ferron/ferron.kdl
ExecReload=/bin/kill -HUP $MAINPID
Restart=on-failure
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now ferron
```

---

## 4. Verification

```bash
# 1. Check version
ferron --version

# 2. Validate KDL configuration syntax
ferron --config /etc/ferron/ferron.kdl --validate

# 3. Test HTTP endpoint
curl -I http://localhost
```
