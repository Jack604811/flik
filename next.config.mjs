import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));
// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./src/env");

/** @type {import('next').NextConfig} */

const nextConfig = {
    async headers() {
        return [
            {
                // matching all API routes
                source: "/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                    { key: "Cross-Origin-Opener-Policy", value: "same-origin" }
                ]
            }
        ]
    },
    images: {
        remotePatterns: [
            { hostname: "rnetulpcbgfmgdvyrsdh.supabase.co", protocol: "https"},
            { hostname: "mbcobsjjxvpydprpyybp.supabase.co", protocol: "https"},
            { hostname: "randomuser.me", protocol: "https" }
        ]
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
        serverActions: {
            allowedOrigins: ["localhost:3000",".localhost:3000", ".ecohotel.xyz", ".naijaesecia.com"]
        }
    },
    crossOrigin: 'anonymous',
    // trailingSlash: true
};

export default nextConfig;
