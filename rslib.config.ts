import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      dts: true,
    },
  ],
  output: {
    minify: {
      js: true, // 启用 JavaScript 压缩
      jsOptions: {
        minimizerOptions: {
          mangle: true, // 启用变量和函数名的混淆（压缩）
          minify: true, // 启用进一步的最小化（压缩）
          compress: {
            defaults: true, // 启用默认压缩选项
            unused: true, // 删除未使用的代码
            dead_code: true, // 删除死代码
            toplevel: true, // 删除顶层无用代码
          },
          format: {
            comments: false, // 移除所有注释
          },
        },
      },
    },
  },
});
