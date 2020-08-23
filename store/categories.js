import { fetchContent } from '@/utils/api'

export const state = () => ({
  title: null,
  titles: {
    cities: true,
    moods: true,
    senses: true,
  },
  filters: [],
  postsFeed: [],
})

export const actions = {
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
            height
            width
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
  checkTitle({ state, commit }, filters) {
    let counter = 0
    let title = ''

    for (let i = 0; i < filters.length; i++) {
      if (state.titles[filters[i]] === true) {
        counter += 1
        title = filters[i]
      }

      if (counter >= 2) {
        break
      }
    }

    counter === 1 ? commit('setTitle', title) : commit('setTitle', 'all')
  },
  handleFilters({ dispatch, commit, state }, payload) {
    dispatch('checkTitle', payload)
    commit('setFilters', payload)
  },
}

export const mutations = {
  setTitle(state, title) {
    state.title = title
  },
  resetFilters(state) {
    state.filters = []
  },
  setFilters(state, payload) {
    state.filters = payload
  },
  addFilter(state, filter) {
    state.fitlers.push(filter)
  },
}
