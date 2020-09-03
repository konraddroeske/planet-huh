import { fetchContent } from "@/utils/api"

export const state = () => ({
  staticPages: {},
  slugs: [],
})

export const actions = {
  async getStaticSlugs({ commit }) {
    try {
      const { data } = await fetchContent(`{
        staticPages(orderBy: slug_ASC) {
          shortTitle
          slug
        }
      }`)

      const slugs = data.data.staticPages.map((page) => ({
        shortTitle: page.shortTitle.trim(),
        slug: page.slug.trim(),
      }))

      commit("setStaticSlugs", slugs)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error) // TODO: error handling
    }
  },
  async getStaticPage({ commit }, slug) {
    try {
      const { data } = await fetchContent(`{
        staticPage(where: {slug: "${slug}"}) {
          title
          content {
            raw
          }
        }
      }`)

      const staticPage = {
        title: data.data.staticPage.title.trim(),
        content: data.data.staticPage.content.raw.children,
      }
      commit("setStaticPage", { staticPage, slug })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error) // TODO: error handling
    }
  },
}

export const mutations = {
  setStaticSlugs(state, slugs) {
    state.slugs = slugs
  },
  setStaticPage(state, { staticPage, slug }) {
    state.staticPages = {
      ...state.staticPages,
      [slug]: staticPage,
    }
  },
}
