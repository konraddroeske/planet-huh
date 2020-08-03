import axios from 'axios'

export const state = () => ({
  ctaTitle: '',
  ctaText: '',
  featuredPosts: [],
  featuredCollabPosts: [],
})

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
              featuredCollabPosts(where: {featured: true}) {
                title
                slug
                date
                featured
                headline
                artist {
                  name
                  location
                }
                images {
                  url
                  id
                  fileName
                }
              }
            }
          }`,
        },
      })

      const {
        ctaTitle,
        ctaText,
        featuredPosts,
        featuredCollabPosts,
      } = data.data.homePages[0]
      commit('setHomepage', {
        ctaTitle,
        ctaText,
        featuredPosts,
        featuredCollabPosts,
      })
    } catch (error) {
      console.log(error) // TODO: error handling
    }
  },
}

export const mutations = {
  setHomepage(
    state,
    { ctaTitle, ctaText, featuredPosts, featuredCollabPosts }
  ) {
    state.ctaTitle = ctaTitle
    state.ctaText = ctaText
    state.featuredPosts = featuredPosts
    state.featuredCollabPosts = featuredCollabPosts
  },
}
