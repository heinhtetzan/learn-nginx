## Video Lesson from youtube?
- https://www.youtube.com/watch?v=iInUBOVeBCc
- https://www.youtube.com/watch?v=xo5V9g9joFs

---

## 🏗️ What is Nginx?

**Nginx** (pronounced *“engine-x”*) is a **high-performance web server** that can also function as a **reverse proxy**, **load balancer**, and **HTTP cache**.

In short:

> Nginx handles and serves web traffic — it delivers websites, APIs, and other web resources efficiently.

---

## 📜 History of Nginx

* **Created by:** Igor Sysoev
* **Year:** 2004
* **Origin:** Russia
* **Reason:** To solve the **C10k problem** — handling **10,000+ concurrent connections** efficiently.

At the time, most web servers (like **Apache**) used a *process-per-connection* model, which caused heavy CPU/memory usage.
Nginx introduced a new model: **asynchronous, event-driven architecture**, which could handle many connections with minimal resources.

Today, Nginx powers **over 30% of all websites**, including giants like **Netflix, Airbnb, and Dropbox**.

---

## 🤔 Why Nginx?

Here’s why Nginx became so popular:

| Feature                          | Description                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------ |
| ⚡ **Performance**                | Handles thousands of requests per second efficiently.                          |
| 🧠 **Low resource usage**        | Uses an event-driven model instead of creating new processes for each request. |
| 🌀 **Reverse proxy**             | Can forward client requests to backend servers (e.g., Node.js, Python, PHP).   |
| 🌐 **Load balancing**            | Distributes traffic across multiple servers.                                   |
| 🔒 **Security**                  | Supports SSL/TLS termination and rate limiting.                                |
| 🧱 **Static content**            | Excellent at serving static files like images, CSS, and HTML.                  |
| 🛠️ **Modular and configurable** | Flexible for many architectures (microservices, APIs, etc.).                   |

---

## ⚙️ How Nginx Works (Simplified)

Let’s visualize:

```
[ Client Browser ] → [ Nginx Server ] → [ Backend Servers / App ]
```

1. A **client** (browser or app) sends an HTTP request.
2. **Nginx** receives the request.
3. Depending on configuration:

   * It can **serve static files** (HTML, CSS, images, etc.)
   * Or **proxy** the request to another server (like Node.js, Django, or PHP-FPM)
   * Or **balance** the load across multiple backend servers.
4. Nginx **sends the response** back to the client.

Example:

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

Here, Nginx listens on port 80 and forwards traffic to an app running on port 3000.

---

## 🔄 Nginx vs Apache (for context)

| Feature              | Apache                      | Nginx                |
| -------------------- | --------------------------- | -------------------- |
| Architecture         | Process-based               | Event-driven         |
| Static file handling | Slower                      | Faster               |
| Memory usage         | Higher                      | Lower                |
| Reverse proxy        | Add-on modules              | Built-in             |
| Configuration        | More flexible per directory | Global configuration |

---

## 🧩 Common Use Cases

* Serving **static websites**
* Acting as a **reverse proxy** for backend apps (Node.js, Flask, Laravel, etc.)
* **Load balancing** multiple servers
* Terminating **SSL/TLS** (HTTPS)
* Acting as a **content cache**
* Hosting **multiple domains (virtual hosts)**

---

## 🧠 Summary

| Concept      | Description                                              |
| ------------ | -------------------------------------------------------- |
| **What**     | A high-performance web server and reverse proxy          |
| **Who**      | Created by Igor Sysoev in 2004                           |
| **Why**      | To efficiently handle massive web traffic (C10k problem) |
| **How**      | Uses an asynchronous, event-driven architecture          |
| **Used for** | Web serving, load balancing, caching, reverse proxying   |

---

Would you like me to show **a visual diagram** of how Nginx routes traffic (clients → Nginx → backend servers)? It helps a lot to understand how it fits into a real web setup.
