import { defineConfig } from "vite"
import stylelint from "vite-plugin-stylelint"
import eslint from "vite-plugin-eslint"
import { resolve } from "path";

export default defineConfig({
    plugins: [stylelint(), eslint()],
    root: './src',
    envDir:'../',

    // omdat de root nu in src zit is het pad naar de publicDir nu ../public
    publicDir: '../public',
    // voor in geval je de dist niet in de root van je webserver plaatst
    base: './',

    build: {
        // overschrijven, omdat de root nu "src" is,
        // anders komt de dist map ook in src en dat is... raar
        outDir: '../dist',
        emptyOutDir: true,

        rollupOptions: {
            input: {
                // een entrypoint voor elke HTML pagina
                // uiteraard is dat altijd index.html
                // om goed te kunnen werken heb ik alle content in de 'src' folder gestopt
                // dat is netter
                main: resolve(__dirname, 'src/index.html'),
                search: resolve(__dirname, 'src/search/index.html'),
                wishlist: resolve(__dirname, 'src/wishlist/index.html'),
                immo: resolve(__dirname, 'src/immo/index.html'),
                addListing: resolve(__dirname, 'src/addlisting/index.html'),
                employeeinvite: resolve(__dirname, 'src/employeeinvite/index.html'),
                editimmo: resolve(__dirname, 'src/editimmo/index.html'),
                detail: resolve(__dirname, 'src/detail/index.html'),
                login: resolve(__dirname, 'src/login/index.html'),
                logout: resolve(__dirname, 'src/logout/index.html'),
                register: resolve(__dirname, 'src/register/index.html'),
                immoregister: resolve(__dirname, 'src/immoregister/index.html'),
                admin: resolve(__dirname, 'src/admin/index.html'),
                displaysearch: resolve(__dirname, 'src/displaysearch/index.html'),
                404: resolve(__dirname, 'src/404/index.html'),
                401: resolve(__dirname, 'src/401/index.html'),
            },
        },
    },
})