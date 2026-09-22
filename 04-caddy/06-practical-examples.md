# 06. Caddy: Practical Hands-On & Code Samples

Complete, copy-paste ready configurations and operational commands for real-world Caddy deployments.

---

## 1. Production Static Website with Automatic HTTPS & Security Headers

```caddy
# /etc/caddy/Caddyfile

static.company.com {
    # 1. Automatic compression
    encode zstd gzip

    # 2. Document root
    root * /var/www/static

    # 3. Security Headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        -Server # Remove Server header for security
    }

    # 4. SPA Fallback & Static File Server
    try_files {path} /index.html
    file_server

    # 5. Access Logging in JSON format
    log {
        output file /var/log/caddy/static_access.log
        format json
    }
}
```

---

## 2. Load-Balanced Reverse Proxy with Active Health Checks

```caddy
api.company.com {
    reverse_proxy 10.0.1.10:8080 10.0.1.11:8080 {
        lb_policy least_conn
        
        # Active Health Checks
        health_uri /healthz
        health_interval 5s
        health_timeout 2s

        # Upstream Header Forwarding
        header_up X-Real-IP {remote_host}
    }
}
```

---

## 3. Essential Operational Commands

```bash
# 1. Validate Caddyfile syntax without restarting
caddy validate --config /etc/caddy/Caddyfile

# 2. Inspect the compiled JSON structure
caddy adapt --config /etc/caddy/Caddyfile --pretty

# 3. Zero-downtime configuration reload
sudo systemctl reload caddy
# or directly via CLI:
caddy reload --config /etc/caddy/Caddyfile

# 4. Inspect automatic certificates on disk
ls -lah /var/lib/caddy/.local/share/caddy/certificates/acme-v02.api.letsencrypt.org-directory/

# 5. Tail live logs
journalctl -u caddy -f -o cat
```

---

**Next Chapter:** [05. Ferron: 01. Installation & Setup](../05-ferron/01-installation-and-setup.md)

