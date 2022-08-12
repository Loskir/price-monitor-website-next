const { withEffectorReactAliases } = require("effector-next/tools")
const CopyPlugin = require("copy-webpack-plugin")

const enhance = withEffectorReactAliases()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  webpack(config, { isServer }) {
    // Copy zbar.wasm to where the chunk containing zbar-wasm is located
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            // In this project, zbar-wasm becomes part of static/chunks/pages/_app.js
            from: "node_modules/@undecaf/zbar-wasm/dist/zbar.wasm",
            to: "static/chunks/pages/",
          },
        ],
      }),
    )

    if (!isServer) {
      // Resolve node modules that are irrelevant for the client
      config.resolve.fallback = {
        ...config.resolve.fallback,

        fs: false,
        path: false,
      }
    }

    return config
  },
}

module.exports = enhance(nextConfig)
