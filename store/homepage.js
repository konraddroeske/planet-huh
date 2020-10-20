import { fetchContent } from "@/utils/api"

export const state = () => ({
  ctaTitle: "",
  ctaText: "",
  postsFeed: [],
  maxPosts: 0,
  featured: [],
})

export const actions = {
  async getHomepage({ commit }) {
    try {
      const { data } = await fetchContent(`{
        homePages {
            ctaTitle
            ctaText
          }
      }`)

      const { ctaTitle, ctaText } = data.data.homePages[0]

      commit("setHomepage", {
        ctaTitle,
        ctaText,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error) // TODO: error handling
    }
  },
  async getFeatured({ commit }) {
    try {
      const { data } = await fetchContent(`{
          posts(where: {featured: true}, orderBy: date_DESC) {
            id
            slug
            title
            headline
            featured
            featuredImages {
              id
              url
              fileName
            }
            artist {
              name
              city {
                name
              }
            }
            city {
                name
            }
            date
        }
      }`)

      const { posts } = data.data

      commit("setFeatured", posts)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error) // TODO: error handling
    }
  },
  async getSomePosts({ commit, state }, numPosts = 4) {
    try {
      const { data } = await fetchContent(`{
        posts(where: {featured: false} orderBy: date_DESC skip: ${state.postsFeed.length} first: ${numPosts} ) {
          id
          title
          slug
          date
          featured
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
      commit("setSomePosts", posts)
      commit("setMaxPosts", 4)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
}

export const getters = {
  postLimit: (state) => {
    return state.postsFeed.length - state.maxPosts <= 0
  },
  postsTotal: (state) => {
    if (state.maxPosts >= state.postsFeed.length) {
      return state.postsFeed
    } else {
      return state.postsFeed.slice(0, state.maxPosts)
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
  setSomePosts(state, newPosts) {
    state.postsFeed = state.postsFeed.concat(newPosts)
  },
  setFeatured(state, featuredPosts) {
    state.featured = featuredPosts.filter((post) => {
      return post.featuredImages.length >= 2 && post.artist.length >= 2
    })
  },
  setMaxPosts(state, num) {
    state.maxPosts += num
  },
  resetMaxPosts(state) {
    state.maxPosts = 0
  },
}
