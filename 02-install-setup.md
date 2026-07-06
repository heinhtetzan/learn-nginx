# Installation & Setup

Installing Nginx on Ubuntu and verifying the setup.

---

## Update Package List

```bash
sudo apt update
```

---

## Install Nginx

```bash
sudo apt install nginx -y
```

---

## Enable and Start Nginx

```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```

Verify it's running:

```bash
sudo systemctl status nginx
```

You should see **"active (running)"**.

---

## Test in Browser

Open your browser and go to:

```
http://localhost
```

Or use your server's IP address:

```
http://<your_server_ip>
```

You should see the default **"Welcome to Nginx!"** page.

---

## Allow Nginx Through Firewall (Optional)

If you're using UFW (Uncomplicated Firewall):

```bash
sudo ufw allow 'Nginx Full'
sudo ufw status
```

---

Next: [HTTP Configuration](./03-http-config.md)
