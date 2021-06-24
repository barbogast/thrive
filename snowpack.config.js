// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
// eslint-disable-next-line no-undef
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },

  plugins: ['@snowpack/plugin-typescript', '@snowpack/plugin-react-refresh'],
  alias: {
    'konva-types': './node_modules/konva/types',
  },
  routes: [{ match: 'routes', src: '.*', dest: '/index.html' }],
  testOptions: {
    files: ['**/*.test.*'],
  },
}
