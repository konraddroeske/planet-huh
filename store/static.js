import { fetchContent } from "@/utils/api"

export const state = () => ({
  staticPages: {},
  slugs: [],
  pages: [],
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
  async getStaticPages({ commit, state }) {
    try {
      const { data } = await fetchContent(`{
        staticPages {
          title
          slug
          id
          content {
            raw
          }
          shortTitle
        }
      }`)

      const { staticPages } = data.data

      commit("setPages", staticPages)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
}

export const mutations = {
  setStaticSlugs(state, slugs) {
    state.slugs = slugs
  },
  setPages(state, payload) {
    state.pages = payload
  },
}
