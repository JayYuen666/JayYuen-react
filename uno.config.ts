import {
  defineConfig, presetAttributify, presetIcons,
  presetTypography, presetUno,
  transformerDirectives, transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      // ...
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      prefix: 'i-',
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        carbon: () => import('@iconify-json/svg-spinners/icons.json').then(i => i.default),
      },
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
