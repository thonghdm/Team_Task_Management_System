import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr({
            svgrOptions: {
                exportType: 'named', // Sử dụng export có tên cho các component SVG
                ref: true, // Hỗ trợ ref forwarding cho SVG components
                svgo: false, // Tắt SVGO, công cụ tối ưu hóa SVG
                titleProp: true // Cho phép sử dụng thuộc tính title cho SVG components
            },
            include: '**/*.svg', // Bao gồm tất cả các tệp SVG
            exclude: ['src/assets/img/**/*.svg'] // Loại trừ các tệp SVG trong thư mục này
        }),
    ],
    resolve: {
        alias: [
            { find: '~', replacement: '/src' } /// ~<=>../../src
        ]
    },
    server: {
        port: 3000,
    },
    define: {
        global: {}},
    
})