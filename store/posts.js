import { fetchContent } from "@/utils/api"

export const state = () => ({
  posts: null,
  collabs: null,
})

export const actions = {
  async getPosts({ commit, state }) {
    try {
      const { data } = await fetchContent(`{
        posts(orderBy: date_DESC) {
            id
            title
            headline
            slug
            blueTitle
            excerpt
            date
            featured
            featuredImages {
              id
              url
              fileName
            }
            content {
                html
                markdown
                raw
                text
            }
            coverImage {
                url
            }
            sense {
                name
            }
            mood {
                moodCategory
                mood
            }
            artist {
                name
                city {
                  name
                }
                about
                website
                social
                socialUrl
            }
            city {
                name
            }
        }
      }`)

      const { posts } = data.data
      commit("setPosts", posts)
      commit("setCollabs", posts)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
}

export const mutations = {
  setPosts(state, payload) {
    state.posts = payload
  },
  setCollabs(state, payload) {
    const collabs = payload.filter((post) => {
      if (post.artist.length > 1) {
        return post
      }
    })

    state.collabs = collabs
  },
}
