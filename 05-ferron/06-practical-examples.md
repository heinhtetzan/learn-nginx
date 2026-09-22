# 06. Ferron: Practical Hands-On & Code Samples

Complete, production-ready configuration examples and operational commands for real-world Ferron deployments.

---

## 1. Production Static Website with Automatic TLS & Security Headers

```kdl
// /etc/ferron/ferron.kdl

server {
    auto_tls_letsencrypt_production
}

site "static.company.com" {
    root "/var/www/static"

    // Security Headers
    header "Strict-Transport-Security" "max-age=31536000; includeSubDomains"
    header "X-Frame-Options" "DENY"
    header "X-Content-Type-Options" "nosniff"

    // Static Assets with Cache-Control
    route "/assets/*" {
        file_server
        header "Cache-Control" "public, max-age=31536000, immutable"
    }

    // SPA Fallback (React / Vue / Svelte)
    route "/*" {
        file_server
        try_files "$uri" "$uri/" "/index.html"
    }
}
```

---

## 2. Load-Balanced Reverse Proxy with Health Checks

```kdl
upstream "api_nodes" {
    server "10.0.1.10:8000"
    server "10.0.1.11:8000"
    policy "least_conn"
    health_check "/healthz" 5s
}

site "api.company.com" {
    route "/*" {
        proxy "upstream://api_nodes" {
            preserve_host true
            timeout 15s
        }
    }
}
```

---

## 3. Essential Operational Commands

```bash
# 1. Validate KDL configuration syntax without starting
ferron --config /etc/ferron/ferron.kdl --validate

# 2. Run Ferron directly
ferron --config /etc/ferron/ferron.kdl

# 3. Reload configuration with zero downtime
sudo systemctl reload ferron
# or via kill signal:
sudo kill -HUP $(pgrep ferron)
```

---

**Next Chapter:** [06. Final Comparison & Decision Guide](../06-comparison/01-server-comparison.md)

