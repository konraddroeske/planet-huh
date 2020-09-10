import { fetchContent } from "@/utils/api"

export const state = () => ({
  posts: null,
})

export const actions = {
  async getPosts({ commit, state }) {
    try {
      const { data } = await fetchContent(`{
        posts(orderBy: date_DESC) {
            title
            slug
            excerpt
            date
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
                location
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
}
