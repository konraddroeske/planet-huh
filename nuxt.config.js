import { fetchContent } from "./utils/api.js"

if (process.env.NODE_ENV !== "production") require("dotenv").config()

const dynamicRoutes = async () => {
  const { data } = await fetchContent(`{
        staticPages {
          slug
        }
        posts {
          slug
        }
      }`)

  return data.data.posts
    .map((post) => `/post/${post.slug}`)
    .concat(data.data.staticPages.map((page) => `/${page.slug}`))
}

const title = "Planet Huh"
const description =
  "HUH is a content platform exploring creativity through cities, senses, and moods. Discover multisensory contributions from artists around the planet participating in an evolving experiment in global collaboration."
const img = "/banner.jpg"

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
    title,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: description,
      },
      {
        hid: "twitter:card",
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: title,
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content: description,
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: img,
      },
      {
        hid: "twitter:image:alt",
        name: "twitter:image:alt",
        content: "Planet huh logo and planets",
      },
      {
        hid: "fb:app_id",
        property: "fb:app_id",
        content: "392644721931229",
      },
      {
        hid: "og:image",
        property: "og:image",
        content: img,
      },
      {
        hid: "og:site_name",
        property: "og:site_name",
        content: title,
      },
      { hid: "og:title", property: "og:title", content: title },
      {
        hid: "og:description",
        property: "og:description",
        content: description,
      },
      {
        hid: "og:url",
        property: "og:url",
        content: "http://www.planethuh.com",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/faviconBlk.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Oswald:wght@400&family=Work+Sans:wght@400;500;600;900&display=swap",
      },
    ],
    script: [
      {
        src: "/js/fb-sdk.js",
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
    "@nuxtjs/google-analytics",
    "nuxt-facebook-pixel-module",
  ],
  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID,
  },
  facebook: {
    /* module options */
    track: "PageView",
    pixelId: process.env.FACEBOOK_PIXEL_ID,
    disabled: false,
  },
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
  env: {
    previewToken: process.env.GRAPHCMS_PREVIEW_TOKEN,
    facebookToken: process.env.FACEBOOK_CLIENT_TOKEN,
  },
  babel: {
    presets(env, [preset, options]) {
      return [
        [
          "@nuxt/babel-preset-app",
          {
            exclude(modulePath) {
              return (
                /node_modules/.test(modulePath) &&
                !/node_modules\/three/.test(modulePath)
              )
            },
          },
        ],
      ]
    },
  },
  generate: {
    routes: dynamicRoutes,
  },
}
