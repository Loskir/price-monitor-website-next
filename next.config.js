const { withEffectorReactAliases } = require("effector-next/tools")
const withPWA = require("next-pwa")({
  dest: "public",
})

const enhance = withEffectorReactAliases()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = withPWA(enhance(nextConfig))
