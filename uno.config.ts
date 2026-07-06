import { defineConfig } from 'unocss'
import presetMini from '@unocss/preset-mini'
export default defineConfig({
  // ...UnoCSS options
  presets: [presetMini()],
  preflights: [
    {
      getCSS: () => `
        /* 彻底清除常见标签的默认内外边距 */
        body, h1, h2, h3, h4, h5, h6, p, ul, ol, li, figure {
          margin: 0;
          padding: 0;
        }
        /* 全局规整盒模型 */
        *, *::before, *::after {
          box-sizing: border-box;
        }
      `,
    },
  ],
})
