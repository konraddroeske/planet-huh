if (process.env.NODE_ENV !== "production") require("dotenv").config()

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: "universal",
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "server",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: "Planet Huh",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde eveniet veritatis possimus ab obcaecati, a excepturi quaerat distinctio atque pariatur tenetur voluptatibus nisi alias, est aspernatur? Sed quas magnam a?",
    img: "/banner.jpg",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde eveniet veritatis possimus ab obcaecati, a excepturi quaerat distinctio atque pariatur tenetur voluptatibus nisi alias, est aspernatur? Sed quas magnam a?",
      },
      {
        hid: "twitter:card",
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: this.title,
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content: this.description,
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: this.img,
      },
      {
        hid: "og:image",
        property: "og:image",
        content: this.img,
      },
      {
        hid: "og:site_name",
        property: "og:site_name",
        content: this.title,
      },
      { hid: "og:title", property: "og:title", content: this.title },
      {
        hid: "og:description",
        property: "og:description",
        content: this.description,
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Oswald:wght@400&family=Work+Sans:wght@400;500;600;900&display=swap",
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: ["~/assets/scss/global.scss"],
  styleResources: {
    scss: ["~/assets/scss/*.scss"],
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    "~plugins/fontAwesome.js",
    "~plugins/v-scroll-lock.js",
    "~/plugins/directives.js",
    "~/plugins/vue-formulate",
    "~/plugins/v-lazy-image.js",
    "~/plugins/globalComponents.js",
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module",
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "@nuxtjs/style-resources",
    "@nuxtjs/svg",
    "@nuxtjs/device",
    "nuxt-polyfill",
  ],
  /*
   ** Polyfills for older browser
   */
  polyfill: {
    features: [
      {
        require: "intersection-observer",
        detect: () => "IntersectionObserver" in window,
      },
    ],
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    transpile: ["three", "gsap"],
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
        })
      }
    },
  },
  server: {
    host: "0", // default: localhost
  },
  env: {},
  // router: {
  //   middleware: 'isMobile',
  // },
}
