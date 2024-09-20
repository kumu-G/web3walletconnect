/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode：启用 React 的严格模式，帮助你识别潜在的问题，改进代码质量。严格模式不会影响生产环境，只会在开发环境中生效。
    reactStrictMode: true,
    // swcMinify：启用 SWC 的代码压缩器来替代 Terser，提升构建速度和效率。SWC 是一个超快的 JavaScript/TypeScript 编译器。
    swcMinify: true,
    webpack: config => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding')
        return config
    }
};

export default nextConfig;
