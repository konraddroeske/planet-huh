import { fetchContent } from '@/utils/api'

export const state = () => ({
  ctaTitle: '',
  ctaText: '',
  featuredPosts: [],
  postsFeed: [],
})

export const mutations = {
  setHomepage(state, { ctaTitle, ctaText, featuredPosts }) {
    state.ctaTitle = ctaTitle
    state.ctaText = ctaText
    state.featuredPosts = featuredPosts
  },

  setSomePosts(state, newPosts) {
    state.postsFeed = state.postsFeed.concat(newPosts)
  },
}

export const actions = {
  async getHomepage({ commit }) {
    try {
      const { data } = await fetchContent(`{
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
      }`)

      const { ctaTitle, ctaText, featuredPosts } = data.data.homePages[0]
      commit('setHomepage', { ctaTitle, ctaText, featuredPosts })
    } catch (error) {
      console.log(error) // TODO: error handling
    }
  },

  async getSomePosts({ commit, state }, numPosts = 4) {
    try {
      const { data } = await fetchContent(`{
        posts(orderBy: date_DESC skip: ${state.postsFeed.length} first: ${numPosts} ) {
          id
          title
          slug
          date
          city {
            latitude
          }
          sense
          mood
          coverImage {
            url
          }
        }
      }`)
      const { posts } = data.data
      commit('setSomePosts', posts)
    } catch (error) {
      console.log(error)
    }
  },
}
