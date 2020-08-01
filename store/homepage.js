import axios from 'axios'

export const state = () => ({
  ctaTitle: '',
  ctaText: '',
  featuredPosts: [],
})

export const mutations = {
  setHomepage(state, { ctaTitle, ctaText, featuredPosts }) {
    state.ctaTitle = ctaTitle
    state.ctaText = ctaText
    state.featuredPosts = featuredPosts
  },
}

export const actions = {
  async getHomepage({ commit }) {
    try {
      const { data } = await axios({
        method: 'post',
        url:
          'https://api-us-east-1.graphcms.com/v2/ckcmojoyd1vly01xo5ubkgptp/master',
        data: {
          query: `{
            homePages {
              ctaTitle
              ctaText
              featuredPosts {
                title
                date
                slug
                coverImage {
                  url
                }
              }
            }
          }`,
        },
      })

      const { ctaTitle, ctaText, featuredPosts } = data.data.homePages[0]
      commit('setHomepage', { ctaTitle, ctaText, featuredPosts })
    } catch (error) {
      console.log(error) // TODO: error handling
    }
  },
}
