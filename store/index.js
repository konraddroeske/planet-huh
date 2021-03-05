export const state = () => ({
  loading: true,
  finish: null,
})

export const actions = {
  async nuxtServerInit({ dispatch }) {
    console.log("fetching from nuxt server init")

    await dispatch("homepage/getFeatured")
    await dispatch("static/getStaticPages")
    await dispatch("nav/getMoods")
    await dispatch("nav/getCities")
    await dispatch("categories/getMoods")
    await dispatch("categories/getCities")
    await dispatch("categories/getSenses")
    await dispatch("categories/getArtists")
    await dispatch("categories/getCategoryPage")
  },
}

export const mutations = {
  setLoading(state, payload) {
    state.loading = payload
  },
  setFinish(state, fn) {
    state.finish = fn
  },
}
