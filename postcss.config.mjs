/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    'postcss-px-to-viewport-8-plugin': {
      // 视窗的宽度，对应的是我们设计稿的宽度，我们公司用的是750
      viewportWidth: 750,
      // 指定`px`转换为视窗单位值的小数位数
      unitPrecision: 3,
      // 指定需要转换成的视窗单位，建议使用vw
      viewportUnit: 'vw',
      // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      selectorBlackList: ['.ignore'],
      // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      minPixelValue: 1,
      // 允许在媒体查询中转换`px`
      mediaQuery: false,
      // exclude: undefined
    },
    // 自动补全
    autoprefixer: {
      overrideBrowserslist: [
        'Android 4.1',
        'iOS 7.1',
        'Chrome > 31',
        'ff > 31',
        'ie >= 8',
      ],
      grid: true,
    },
    ...(process.env.NODE_ENV === 'development' ? {} : { cssnano: {} }),
  },
};

export default config;
