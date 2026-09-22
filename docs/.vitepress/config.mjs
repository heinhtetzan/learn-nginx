import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: 'Web Servers Master Guide',
    description: 'An authoritative guide to Apache, NGINX, Caddy, and Ferron for Monolith and Microservices architectures.',
    base: process.env.BASE_PATH || '/',

    head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      ['meta', { name: 'theme-color', content: '#2563eb' }]
    ],

    themeConfig: {
      siteTitle: 'Web Servers Guide',

      nav: [
        { text: 'Home', link: '/' },
        { text: '01. Fundamentals', link: '/01-what-is-web-server/01-what-is-a-web-server' },
        {
          text: 'Servers',
          items: [
            { text: '02. Apache HTTP Server', link: '/02-apache/01-installation-and-setup' },
            { text: '03. NGINX', link: '/03-nginx/01-installation-and-setup' },
            { text: '04. Caddy', link: '/04-caddy/01-installation-and-setup' },
            { text: '05. Ferron (Rust)', link: '/05-ferron/01-installation-and-setup' }
          ]
        },
        { text: '06. Comparisons', link: '/06-comparisons-and-blueprints/01-concurrency-models' },
        { text: 'Rosetta Stone', link: '/06-comparisons-and-blueprints/03-rosetta-stone' }
      ],

      sidebar: {
        '/': [
          {
            text: '🌐 01. What is a Web Server?',
            collapsed: false,
            items: [
              { text: '01. What is a Web Server?', link: '/01-what-is-web-server/01-what-is-a-web-server' },
              { text: '02. How Web Servers Work', link: '/01-what-is-web-server/02-how-web-servers-work' },
              { text: '03. Monolith vs. Microservices', link: '/01-what-is-web-server/03-monolith-vs-microservices' }
            ]
          },
          {
            text: '🏛️ 02. Apache HTTP Server',
            collapsed: false,
            items: [
              { text: '01. Installation & Setup', link: '/02-apache/01-installation-and-setup' },
              { text: '02. Core Concepts & Overview', link: '/02-apache/02-core-concepts' },
              { text: '03. Architecture & MPM Engine', link: '/02-apache/03-architecture-and-mpm' },
              { text: '04. Monolith Deployments', link: '/02-apache/04-monolith-deployments' },
              { text: '05. Microservices & Reverse Proxy', link: '/02-apache/05-microservices-and-reverse-proxy' },
              { text: '06. Practical Examples & Code Samples', link: '/02-apache/06-practical-examples' }
            ]
          },
          {
            text: '⚡ 03. NGINX',
            collapsed: false,
            items: [
              { text: '01. Installation & Setup', link: '/03-nginx/01-installation-and-setup' },
              { text: '02. Core Concepts & Overview', link: '/03-nginx/02-core-concepts' },
              { text: '03. Architecture & Internals', link: '/03-nginx/03-architecture-and-internals' },
              { text: '04. Monolith Deployments', link: '/03-nginx/04-monolith-deployments' },
              { text: '05. Microservices API Gateway', link: '/03-nginx/05-microservices-api-gateway' },
              { text: '06. Practical Examples & Code Samples', link: '/03-nginx/06-practical-examples' }
            ]
          },
          {
            text: '🔒 04. Caddy',
            collapsed: false,
            items: [
              { text: '01. Installation & Setup', link: '/04-caddy/01-installation-and-setup' },
              { text: '02. Core Concepts & Overview', link: '/04-caddy/02-core-concepts' },
              { text: '03. Architecture & Auto-HTTPS', link: '/04-caddy/03-architecture-and-auto-https' },
              { text: '04. Monolith Deployments', link: '/04-caddy/04-monolith-deployments' },
              { text: '05. Microservices & Reverse Proxy', link: '/04-caddy/05-microservices-and-reverse-proxy' },
              { text: '06. Practical Examples & Code Samples', link: '/04-caddy/06-practical-examples' }
            ]
          },
          {
            text: '🦀 05. Ferron (Rust)',
            collapsed: false,
            items: [
              { text: '01. Installation & Setup', link: '/05-ferron/01-installation-and-setup' },
              { text: '02. Core Concepts & Overview', link: '/05-ferron/02-core-concepts' },
              { text: '03. Architecture & KDL Configuration', link: '/05-ferron/03-architecture-and-kdl' },
              { text: '04. Monolith Deployments', link: '/05-ferron/04-monolith-deployments' },
              { text: '05. Microservices & Reverse Proxy', link: '/05-ferron/05-microservices-and-reverse-proxy' },
              { text: '06. Practical Examples & Code Samples', link: '/05-ferron/06-practical-examples' }
            ]
          },
          {
            text: '⚖️ 06. Comparisons & Blueprints',
            collapsed: false,
            items: [
              { text: '01. Concurrency & I/O Models', link: '/06-comparisons-and-blueprints/01-concurrency-models' },
              { text: '02. Decision Matrix: Which to Choose?', link: '/06-comparisons-and-blueprints/02-decision-matrix' },
              { text: '03. Rosetta Stone: Config Cheat Sheet', link: '/06-comparisons-and-blueprints/03-rosetta-stone' },
              { text: '04. Production Security Hardening & TLS', link: '/06-comparisons-and-blueprints/04-security-hardening' }
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
        copyright: 'Web Servers Master Guide — Architected for Production.'
      }
    },

    mermaid: {
      theme: 'default'
    }
  })
)
