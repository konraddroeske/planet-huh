export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch("homepage/getFeatured")
    await dispatch("posts/getPosts")
    await dispatch("static/getStaticPages")
    await dispatch("nav/getMoods")
    await dispatch("nav/getCities")
    await dispatch("categories/getMoods")
    await dispatch("categories/getCities")
    await dispatch("categories/getSenses")
  },
}
