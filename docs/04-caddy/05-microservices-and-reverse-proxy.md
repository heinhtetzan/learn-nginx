# 05. Caddy: Microservices & Reverse Proxy

Caddy is an exceptional edge gateway for containerized microservices. With declarative named matchers, native load balancing, active health checks, and built-in mTLS capabilities, it simplifies cloud-native ingress.

---

## 1. Gateway Topology

```mermaid
flowchart TD
    Client["Client Traffic (HTTP/3 / HTTPS)"] --> Gateway["<b>Caddy API Gateway</b><br/>Auto-TLS, HTTP/3, Tracing"]

    subgraph Mesh["Microservices Fleet"]
        Gateway -->|@auth matcher| AuthPool["Auth Service Pool<br/>(least_conn + Active Health Check)"]
        Gateway -->|@catalog matcher| CatalogPool["Catalog Service Pool<br/>(round_robin)"]
        Gateway -->|@grpc matcher| GRPCPool["Billing Service<br/>(gRPC / h2c)"]
    end
```

---

## 2. Production API Gateway Configuration

```caddy
api.company.com {
    # 1. Enable modern HTTP/3 & compression
    encode zstd gzip

    # 2. Inject Distributed Tracing & Security Headers
    header {
        X-Request-ID {http.request.uuid}
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
    }

    # 3. Declarative Named Matchers
    @auth path /api/v1/auth/*
    @catalog path /api/v1/catalog/*
    @grpc path /billing.BillingService/*
    @websockets {
        header Connection *Upgrade*
        header Upgrade    websocket
    }

    # 4. Route to Auth Microservice (Least Connections + Active Health Checks)
    handle @auth {
        reverse_proxy 10.0.1.10:8080 10.0.1.11:8080 {
            lb_policy least_conn
            
            # Active Health Checks
            health_uri /healthz
            health_interval 5s
            health_timeout 2s
            health_status 200

            # Passive Health Checks (Circuit breaking)
            fail_duration 15s
            max_fails 3
        }
    }

    # 5. Route to Catalog Microservice (Round Robin)
    handle @catalog {
        reverse_proxy 10.0.2.10:8080 10.0.2.11:8080 {
            lb_policy round_robin
            health_uri /healthz
            health_interval 10s
        }
    }

    # 6. Route to gRPC Service (HTTP/2 Cleartext h2c)
    handle @grpc {
        reverse_proxy 10.0.3.10:50051 10.0.3.11:50051 {
            transport http {
                versions h2c
            }
        }
    }

    # 7. WebSocket Routing (Automatic in Caddy!)
    handle @websockets {
        reverse_proxy 10.0.4.10:9000
    }

    # Health check endpoint for external cloud load balancer
    handle /healthz {
        respond "OK" 200
    }
}
```

---

## 3. Active vs. Passive Health Checks

* **Active Health Checking**: Caddy probes the `health_uri` on a timer. If an instance fails to respond with `200 OK` within `health_timeout`, Caddy isolates it before real users ever experience an error.
* **Passive Health Checking**: Watches live client requests. If an instance returns 3 consecutive errors (`max_fails 3`), Caddy marks it down for 15 seconds (`fail_duration 15s`).
