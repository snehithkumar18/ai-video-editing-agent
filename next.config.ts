import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      { protocol: "https", hostname: "replicate.delivery" },
      { protocol: "https", hostname: "pbxt.replicate.delivery" },
      { protocol: "https", hostname: "assets.mixkit.co" },
      { protocol: "https", hostname: "www.soundhelix.com" },
    ],
  },
  serverExternalPackages: ["sharp", "canvas", "fluent-ffmpeg", "ffmpeg-static", "ffprobe-static"],
};

export default nextConfig;
