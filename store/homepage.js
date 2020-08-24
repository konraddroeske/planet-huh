import { fetchContent } from '@/utils/api'

export const state = () => ({
  ctaTitle: '',
  ctaText: '',
  featuredPosts: [],
  featuredCollabPosts: [],
  postsFeed: [],
})

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
      }`)

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
      // eslint-disable-next-line no-console
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
            name
            coordinates {
              latitude
              longitude
            }
          }
          sense {
            name
          }
          mood {
            mood
            moodCategory
          }
          coverImage {
            url
            width
            height
          }
        }
      }`)

      const { posts } = data.data
      commit('setSomePosts', posts)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
}

export const getters = {}

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
  setSomePosts(state, newPosts) {
    state.postsFeed = state.postsFeed.concat(newPosts)
  },
}
