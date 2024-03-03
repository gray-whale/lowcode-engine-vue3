const { defineConfig } = require('@vue/cli-service');
const { defineLowCodePluginOption } = require('@knxcloud/vue-cli-plugin-lowcode');

module.exports = defineConfig({
  pluginOptions: {
    lowcode: defineLowCodePluginOption({}),
  },
});
