import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/style.css',
          dest: '.'
        },
        {
          src: 'public/manifest.json',
          dest: '.'
        },
        {
          src: 'public/icons',
          dest: '.'
        }
      ]
    })
  ],
  build: {
    // 輸出目錄
    outDir: 'dist',
    rollupOptions: {
      input: {
        // 定義多個入口點
        popup: resolve(__dirname, 'public/popup.html'), // 彈出頁面
        background: resolve(__dirname, 'src/background.ts'), // 背景腳本
        content_script: resolve(__dirname, 'src/content_script.ts'), // 內容腳本
        // 如果還有其他頁面，如 options.html，也要在這裡定義
        options: resolve(__dirname, 'public/options.html'),
      },
      output: {
        // 定義輸出的檔名和路徑
        entryFileNames: '[name].js', // 例如：background.js, content-script.js
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
        // 確保 manifest.json 和 icons 被複製到 dist
        // 這需要額外的 Vite 外掛或手動複製，以下僅為概念
      },
    },
  },
  // 複製 public 目錄到 dist
  // 這通常由 Vite 預設處理，但如果需要更精細控制，可能需要插件
  // publicDir: 'public',
  publicDir: false,
});
