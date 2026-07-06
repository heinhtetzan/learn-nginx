# Learn Nginx

A comprehensive guide to learning Nginx — from basic concepts to advanced configurations for production deployments.

## Contents

| # | File | Description |
|---|------|-------------|
| 01 | [01-intro.md](./01-intro.md) | Introduction to Nginx — history, architecture, use cases |
| 02 | [02-install-setup.md](./02-install-setup.md) | Installing Nginx on Ubuntu and verifying the setup |
| 03 | [03-http-config.md](./03-http-config.md) | Basic HTTP server configuration for a static site |
| 04 | [04-https-config.md](./04-https-config.md) | HTTPS setup with Cloudflare Origin CA or Let's Encrypt |
| 05 | [05-features.md](./05-features.md) | Key Nginx features — performance, reverse proxy, security |
| 06 | [06-reverse-proxy.md](./06-reverse-proxy.md) | Reverse proxy configuration with SSL termination |
| 07 | [07-config.md](./07-config.md) | Detailed breakdown of Nginx configuration directives |
| 08 | [08-microservice.md](./08-microservice.md) | Nginx as an API gateway for microservices |
| 09 | [09-laravel.md](./09-laravel.md) | Configuring Nginx with PHP-FPM for Laravel |
| 10 | [10-java.md](./10-java.md) | Reverse proxy for Java Spring Boot applications |
| 11 | [11-dot-net.md](./11-dot-net.md) | Reverse proxy for .NET (C#) ASP.NET Core applications |
| 12 | [12-go.md](./12-go.md) | Reverse proxy for Go web applications |
| 13 | [13-nodejs.md](./13-nodejs.md) | Reverse proxy for Node.js applications |

## Prerequisites

- Basic familiarity with the Linux command line
- A Linux server (Ubuntu recommended) or a local VM for practice
- A domain name (for HTTPS and reverse proxy sections)

## How to Use This Guide

Each file builds on the previous one. Start from **01-intro.md** and work through sequentially, or jump to a specific topic using the table of contents above.

All configuration examples assume **Ubuntu** (or Debian-based) systems. Paths and commands may vary for other distributions.
