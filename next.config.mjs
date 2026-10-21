const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Project and article pages now open as overlays on the homepage.
  async redirects() {
    return [
      { source: "/projects/:slug", destination: "/?project=:slug", permanent: true },
      { source: "/articles/:slug", destination: "/?article=:slug", permanent: true },
    ]
  },
}

export default nextConfig
