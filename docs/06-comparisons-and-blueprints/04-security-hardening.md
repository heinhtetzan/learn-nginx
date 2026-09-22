# 04. Production Security Hardening & TLS

Hardening the edge layer across all four web servers to defend against denial of service, data leakage, and protocol attacks.

---

## 1. OWASP Recommended Security Headers

| Header | Production Value | Purpose |
| :--- | :--- | :--- |
| **Strict-Transport-Security** | `max-age=31536000; includeSubDomains; preload` | Forces HTTPS for 1 year |
| **X-Frame-Options** | `DENY` | Prevents Clickjacking |
| **X-Content-Type-Options** | `nosniff` | Blocks MIME-sniffing exploits |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Protects referrer leakage |
| **Content-Security-Policy** | `default-src 'self'; script-src 'self';` | Prevents XSS |

---

## 2. Information Disclosure Prevention

Hide server version tokens to prevent automated vulnerability scanners from targeting specific versions:

* **Apache**:
  ```apache
  ServerTokens Prod
  ServerSignature Off
  ```
* **NGINX**:
  ```nginx
  server_tokens off;
  ```
* **Caddy**:
  ```caddy
  header -Server
  ```
* **Ferron**:
  ```kdl
  server {
      server_tokens false
  }
  ```

---

## 3. Mozilla Modern TLS Configuration

Ensure only TLS 1.2 and TLS 1.3 with Perfect Forward Secrecy (PFS) ciphers are allowed:

### NGINX:
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305';
ssl_prefer_server_ciphers off;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_stapling on;
ssl_stapling_verify on;
```

### Caddy & Ferron:
* **Caddy**: Automatically applies modern TLS 1.2/1.3 ciphers, session resumption, and OCSP stapling with zero manual configuration.
* **Ferron**: Automatically configures modern TLS 1.3 via Rustls when `auto_tls_letsencrypt_production` is enabled.
