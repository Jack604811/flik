import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));
// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: "rnetulpcbgfmgdvyrsdh.supabase.co", protocol: "https"},
            { hostname: "mbcobsjjxvpydprpyybp.supabase.co", protocol: "https"},
            { hostname: "randomuser.me", protocol: "https" },
            { hostname: "lh3.googleusercontent.com", protocol: "https" }
        ]
    },
    async headers() {
        return [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'X-Content-Type-Options',
                value: 'nosniff',
              },
              {
                key: 'X-Frame-Options',
                value: 'DENY',
              },
              {
                key: 'Referrer-Policy',
                value: 'strict-origin-when-cross-origin',
              },
            ],
          },
          {
            source: '/sw.js',
            headers: [
              {
                key: 'Content-Type',
                value: 'application/javascript; charset=utf-8',
              },
              {
                key: 'Cache-Control',
                value: 'no-cache, no-store, must-revalidate',
              },
              {
                key: 'Content-Security-Policy',
                value: "default-src 'self'; script-src 'self'",
              },
            ],
          },
        ]
      },
    // Remove or leave empty if you don't have other experimental features
    experimental: {
        // other supported experimental flags can go here
    }
};

export default nextConfig;
