const { withEffectorReactAliases } = require("effector-next/tools")

const enhance = withEffectorReactAliases()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = enhance(nextConfig)
