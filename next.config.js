/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions estão disponíveis por padrão no Next.js 14
  generateBuildId: async () => {
    // Force new build ID
    return `build-${Date.now()}`
  },
}

module.exports = nextConfig
