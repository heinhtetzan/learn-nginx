### 🧰 Step 1: Update your package list

Open your terminal and run:

```bash
sudo apt update
```

---

### 🌐 Step 2: Install Nginx

```bash
sudo apt install nginx -y
```

This command installs Nginx and any required dependencies.

---

### ⚙️ Step 3: Enable and start the Nginx service

```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```

To verify it’s running:

```bash
sudo systemctl status nginx
```

You should see **“active (running)”** in green.

---

### 🧪 Step 4: Test it in your browser

Open your browser and go to:

```
http://localhost
```

or use your server’s IP address:

```
http://<your_server_ip>
```

You should see the default **“Welcome to Nginx!”** page.

---

### 🔥 (Optional) Step 5: Allow Nginx through the firewall

If you’re using UFW (Uncomplicated Firewall):

```bash
sudo ufw allow 'Nginx Full'
sudo ufw status
```

---

Would you like me to include **SSL setup (HTTPS using Let’s Encrypt)** next?
