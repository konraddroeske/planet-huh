import { fetchContent } from '@/utils/api'

export const state = () => ({
  title: '',
  titles: {
    cities: true,
    moods: true,
    senses: true,
  },
  filters: [],
  formattedFilters: null,
  postsFeed: [],
})

export const actions = {
  async getSomePosts({ commit, state }, numPosts = 4) {
    try {
      const { data } = await fetchContent(`{
        posts(where:${state.formattedFilters} orderBy: date_DESC skip: ${state.postsFeed.length} first: ${numPosts} ) {
          id
          slug
          title
          mood {
            id
            mood
            moodCategory
          }
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

    // check if array
    if (Array.isArray(filters)) {
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
    } else {
      state.titles[filters] === true
        ? commit('setTitle', filters)
        : commit('setTitle', 'all')
    }
  },
  handleFilters({ dispatch, commit, state }, payload) {
    dispatch('checkTitle', payload)
    commit('setFilters', payload)
    commit('formatFilters', payload)
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
  formatFilters(state, payload) {
    // take filters array, turn it into a string for graph cms

    // only one major category at a

    state.formattedFilters = { mood: { id_not: 'null' } }
  },
  addFilter(state, filter) {
    state.fitlers.push(filter)
  },
}
