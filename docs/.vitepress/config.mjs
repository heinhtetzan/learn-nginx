import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: 'Learn Nginx',
    description: 'A comprehensive, modern guide to mastering Nginx web server, reverse proxy, and API gateway architectures.',
    base: process.env.BASE_PATH || '/',
    
    head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      ['meta', { name: 'theme-color', content: '#009639' }]
    ],

    themeConfig: {
      siteTitle: 'Learn Nginx',
      logo: {
        light: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Nginx_logo.svg',
        dark: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Nginx_logo.svg'
      },

      nav: [
        { text: 'Home', link: '/' },
        { text: 'Getting Started', link: '/getting-started/01-intro' },
        { text: 'Core Concepts', link: '/core-concepts/04-https-config' },
        { text: 'Production Architecture', link: '/production-architecture/08-microservice' },
        { text: 'Backend Integrations', link: '/backend-integrations/13-nodejs' },
        { text: 'Cheatsheet', link: '/reference/cheatsheet' }
      ],

      sidebar: {
        '/': [
          {
            text: '🚀 Getting Started',
            collapsed: false,
            items: [
              { text: '01. Introduction to Nginx', link: '/getting-started/01-intro' },
              { text: '02. Installation & Setup', link: '/getting-started/02-install-setup' },
              { text: '03. HTTP Configuration', link: '/getting-started/03-http-config' }
            ]
          },
          {
            text: '🛡️ Core Concepts',
            collapsed: false,
            items: [
              { text: '04. HTTPS & SSL/TLS', link: '/core-concepts/04-https-config' },
              { text: '05. Key Features & Tuning', link: '/core-concepts/05-features' },
              { text: '06. Reverse Proxy Setup', link: '/core-concepts/06-reverse-proxy' },
              { text: '07. Configuration Reference', link: '/core-concepts/07-config' },
              { text: 'WebSocket Reverse Proxy', link: '/core-concepts/websockets' }
            ]
          },
          {
            text: '⚡ Production Architecture',
            collapsed: false,
            items: [
              { text: '08. Microservices API Gateway', link: '/production-architecture/08-microservice' },
              { text: 'Production Security Hardening', link: '/production-architecture/security-hardening' },
              { text: 'HTTP/3 & QUIC Protocol', link: '/production-architecture/http3-quic' },
              { text: 'Caching & Compression', link: '/production-architecture/caching-compression' }
            ]
          },
          {
            text: '🔌 Backend Integrations',
            collapsed: false,
            items: [
              { text: 'Node.js (Express / Next.js)', link: '/backend-integrations/13-nodejs' },
              { text: 'Python (FastAPI / Django)', link: '/backend-integrations/python' },
              { text: 'Laravel & PHP-FPM', link: '/backend-integrations/09-laravel' },
              { text: 'Go (Golang)', link: '/backend-integrations/12-go' },
              { text: 'Java (Spring Boot)', link: '/backend-integrations/10-java' },
              { text: 'C# ASP.NET Core (.NET)', link: '/backend-integrations/11-dot-net' }
            ]
          },
          {
            text: '📖 Quick Reference',
            collapsed: false,
            items: [
              { text: 'Nginx CLI & Cheatsheet', link: '/reference/cheatsheet' }
            ]
          }
        ]
      },

      search: {
        provider: 'local'
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/heinhtetzan/learn-nginx' }
      ],

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Learn Nginx Guide — Created for modern developers and DevOps engineers.'
      },

      editLink: {
        pattern: 'https://github.com/heinhtetzan/learn-nginx/edit/main/docs/:path',
        text: 'Edit this page on GitHub'
      }
    },

    mermaid: {
      theme: 'default'
    }
  })
)
