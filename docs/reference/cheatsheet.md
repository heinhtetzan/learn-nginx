# Nginx Quick Reference & Cheatsheet

A concise reference of essential Nginx commands, variables, common snippets, and troubleshooting status codes.

---

## Essential CLI Commands

```bash
# Test configuration syntax without downtime
sudo nginx -t

# Test specific configuration file
sudo nginx -t -c /path/to/custom.conf

# Reload configuration gracefully (zero downtime)
sudo nginx -s reload
# or via systemd:
sudo systemctl reload nginx

# Graceful shutdown (completes in-flight requests)
sudo nginx -s quit

# Fast shutdown (kills worker processes immediately)
sudo nginx -s stop

# Reopen log files (useful for logrotate)
sudo nginx -s reopen

# Check Nginx version and compiled-in modules
nginx -V
```

---

## Core Variables

| Variable | Description |
|:---|:---|
| `$host` | Host name from request header or primary server name |
| `$remote_addr` | Client IP address |
| `$binary_remote_addr` | Client IP in 4-byte (IPv4) or 16-byte (IPv6) format (ideal for `limit_req_zone`) |
| `$request_uri` | Complete original request URI with arguments (e.g. `/path?id=1`) |
| `$uri` | Normalized URI without arguments |
| `$args` / `$query_string` | Full query string arguments |
| `$status` | HTTP response status code |
| `$scheme` | HTTP scheme (`http` or `https`) |
| `$server_port` | Port number of the server accepting the request |
| `$upstream_response_time` | Latency taken by upstream backend server |
| `$upstream_status` | Status code returned by upstream server |

---

## Common Snippets

### 1. Enable CORS (Cross-Origin Resource Sharing)

```nginx
location /api/ {
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, Accept' always;
        add_header 'Access-Control-Max-Age' 86400;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }

    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, Accept' always;
    proxy_pass http://backend;
}
```

### 2. HTTP Basic Authentication

```bash
# Create htpasswd file
sudo apt install -y apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
```

```nginx
location /admin/ {
    auth_basic "Restricted Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://backend;
}
```

### 3. Canonical Domain (Enforce non-www)

```nginx
server {
    listen 443 ssl;
    server_name www.example.com;
    return 301 https://example.com$request_uri;
}
```

---

## Troubleshooting Nginx Status Codes

| Code | Name | Cause & Solution |
|:---|:---|:---|
| **499** | Client Closed Request | Nginx-specific code. The client closed the connection before Nginx could send a response (often due to browser timeout or user navigating away). Check upstream latency. |
| **502** | Bad Gateway | Upstream server is down, unreachable, or crashed. Verify backend service is running and listening on the specified port/socket. |
| **504** | Gateway Timeout | Upstream server took too long to respond. Increase `proxy_read_timeout` or optimize backend query performance. |
| **413** | Payload Too Large | Request body exceeds `client_max_body_size`. Increase `client_max_body_size` (e.g. `client_max_body_size 50M;`). |
