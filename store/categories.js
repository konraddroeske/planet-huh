import { fetchContent } from '@/utils/api'

export const state = () => ({
  title: '',
  titles: {
    cities: true,
    moods: true,
    senses: true,
  },
  filters: [],
  filtersList: {
    moods: `{mood: {id_not: "null"}}`,
    senses: `{sense_every: {id_not: "null"}}`,
    cities: `{city_every: {id_not: "null"}}`,
  },
  formattedFilters: null,
  postsFeed: [],
})

export const actions = {
  async getCategoryPosts({ commit, state }, numPosts = 4) {
    try {
      const { data } = await fetchContent(`{
        posts(where: ${state.formattedFilters} orderBy: date_DESC skip: ${state.postsFeed.length} first: ${numPosts} ) {
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
      commit('setCategoryPosts', posts)
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
  formatFilters({ state, dispatch, commit }, payload) {
    // set categories
    let filters = ''

    if (Array.isArray(payload)) {
      payload.forEach((item) => {
        if (state.titles[item] && filters === '') {
          filters += state.filtersList[item]
        } else if (state.titles[item] && filters.length > 0) {
          filters += `AND: ${state.filtersList[item]}`
        }
      })
    } else {
      filters += state.filtersList[payload]
    }
    // where: {mood: {id_not: "null"}, AND: {sense_every: {id_not: "null"}, AND: {city_every: {id_not: "null"}}}}
    // set sub categories

    commit('setFormattedFilters', filters)
    dispatch('getCategoryPosts')
  },
  handlePosts({ dispatch, commit, state }, payload) {
    commit('resetFeed')
    commit('setFilters', payload)
    dispatch('checkTitle', payload)
    dispatch('formatFilters', payload)
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
    console.log('set filters')
    state.filters = payload
  },
  resetFeed(state) {
    state.postsFeed = []
  },
  setFormattedFilters(state, filters) {
    state.formattedFilters = filters
  },
  addFilter(state, filter) {
    state.fitlers.push(filter)
  },
  setCategoryPosts(state, newPosts) {
    state.postsFeed = state.postsFeed.concat(newPosts)
  },
}
