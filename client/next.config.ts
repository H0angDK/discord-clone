import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    experimental: {
        reactCompiler: true,
    },
    env: {
        API_URL: process.env.API_URL,
        WS_URL: process.env.WS_URL,
    },
    output: "standalone"
};

export default nextConfig;
