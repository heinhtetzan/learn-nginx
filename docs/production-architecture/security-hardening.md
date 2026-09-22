# Production Security Hardening

Hardening Nginx against common vulnerabilities, DDoS attacks, information disclosure, and brute-force attempts.

---

## 1. Information Disclosure Prevention

By default, Nginx broadcasts its version number in HTTP response headers (`Server: nginx/1.24.0`) and on error pages. Attackers use this to identify unpatched vulnerabilities.

In `/etc/nginx/nginx.conf`:

```nginx
http {
    # Disable version broadcast
    server_tokens off;
}
```

---

## 2. OWASP Recommended Security Headers

Add security headers inside your `server` block to protect against Clickjacking, MIME-sniffing, and XSS:

```nginx
# 1. Prevent Clickjacking (disallows embedding your site in iframes)
add_header X-Frame-Options "SAMEORIGIN" always;

# 2. Prevent MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# 3. Referrer Policy (limits referrer leakage)
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# 4. HTTP Strict Transport Security (HSTS) - Enforce HTTPS for 1 year including subdomains
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# 5. Permissions Policy (restricts browser features like camera, microphone, geolocation)
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

# 6. Content Security Policy (CSP)
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;" always;
```

---

## 3. Slowloris & DoS Attack Mitigation

Slowloris attacks tie up server worker connections by transmitting request headers or bodies abnormally slowly. Mitigate this by enforcing strict timeouts:

```nginx
# Buffer sizes
client_body_buffer_size 128k;
client_header_buffer_size 1k;
client_max_body_size 10m;
large_client_header_buffers 4 4k;

# Timeouts: Drop connections that transmit too slowly
client_body_timeout 10s;
client_header_timeout 10s;
keepalive_timeout 15s;
send_timeout 10s;
```

---

## 4. Connection Limiting

Limit the number of concurrent connections permitted from a single IP address:

```nginx
# Define zone in http block
limit_conn_zone $binary_remote_addr zone=perip_conn:10m;
limit_conn_zone $server_name zone=perserver_conn:10m;

server {
    # Max 20 concurrent connections per single IP
    limit_conn perip_conn 20;

    # Max 500 concurrent connections across the whole virtual host
    limit_conn perserver_conn 500;
}
```

---

## 5. Blocking Hidden Files and Sensitive Extensions

Prevent unauthorized access to `.git`, `.env`, backup files, and script sources:

```nginx
# Block access to hidden files (.env, .git, etc.)
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}

# Block access to common sensitive file extensions
location ~* \.(bak|config|sql|fla|psd|ini|log|sh|inc|swp|dist)$ {
    deny all;
    access_log off;
    log_not_found off;
}
```

---

## 6. Mozilla Modern TLS Configuration

For maximum cryptographic security (TLS 1.3 only or TLS 1.2+):

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers off;

# Enable OCSP Stapling (speeds up TLS handshake and preserves privacy)
ssl_stapling on;
ssl_stapling_verify on;
resolver 1.1.1.1 8.8.8.8 valid=300s;
resolver_timeout 5s;
```

---

[Next: HTTP/3 & QUIC →](./http3-quic.md)
