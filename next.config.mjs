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
            { hostname: "randomuser.me", protocol: "https" }
        ]
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    }
};

export default nextConfig;
