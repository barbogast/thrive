// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  buildOptions: {
    baseUrl: '/thrive',
    out: './docs',
  },
  plugins: ['@snowpack/plugin-typescript', '@snowpack/plugin-react-refresh'],
  alias: {
    'konva-types': './node_modules/konva/types',
  },
  routes: [{ match: 'routes', src: '.*', dest: '/index.html' }],
}
