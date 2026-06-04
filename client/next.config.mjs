import path from "node:path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias = {
            ...(config.resolve.alias ?? {}),
            "@": path.resolve(process.cwd(), "src"),
        };
        config.module.rules.push({
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: "css-loader",
                    options: { sourceMap: true },
                },
                {
                    loader: "sass-loader",
                    options: { sourceMap: true },
                },
            ],
        });

        config.plugins.push(
            new MiniCssExtractPlugin({
                filename: "static/css/[name].[contenthash].css",
            }),
        );
        return config;
    },

    // Настройка для работы с SCSS
    sassOptions: {
        includePaths: ["./src/shared/styles"],
    },
    // Переменные окружения доступные на клиенте
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
};

export default nextConfig;
