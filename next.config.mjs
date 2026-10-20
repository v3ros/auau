const isGithubPages = process.env.GITHUB_PAGES === 'true'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Mengizinkan akses dari jaringan lokal (IP 192.168.1.4) saat mode dev
  allowedDevOrigins: ['192.168.1.4', 'localhost:3000'],
  
  ...(isGithubPages && {
    output: 'export',
    trailingSlash: true,
    basePath: basePath || undefined,
    assetPrefix: basePath || undefined,
  }),
}

export default nextConfig