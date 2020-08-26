import { fetchContent } from '@/utils/api'

export const state = () => ({
  title: '',
  titles: {
    cities: true,
    moods: true,
    senses: true,
  },
  filters: [],
  modal: false,
  filtersList: {
    moods: `{mood: {id_not: "null"}}`,
    senses: `{sense_every: {id_not: "null"}}`,
    cities: `{city_every: {id_not: "null"}}`,
  },
  formattedFilters: null,
  postsFeed: [],
  cities: [],
  moods: [],
  senses: [],
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
  async getMoods({ commit, state }) {
    try {
      const { data } = await fetchContent(`{
        moods(orderBy: mood_ASC) {
            id
            mood
            moodCategory
            createdAt
        }
      }`)

      const { moods } = data.data
      commit('setMoods', moods)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
  async getCities({ commit, state }) {
    try {
      const { data } = await fetchContent(`{
        cities(orderBy: name_ASC) {
            id
            name
            createdAt
        }
      }`)

      const { cities } = data.data
      commit('setCities', cities)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
  async getSenses({ commit, state }) {
    try {
      const { data } = await fetchContent(`{
        senses(orderBy: name_ASC) {
            id
            name
            createdAt
        }
      }`)

      const { senses } = data.data

      commit('setSenses', senses)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
  checkTitle({ state, commit }, filters) {
    // console.log('check title', filters)

    // let counter = 0
    // let title = ''

    // // check if array
    // if (Array.isArray(filters)) {
    //   for (let i = 0; i < filters.length; i++) {
    //     if (state.titles[filters[i]] === true) {
    //       counter += 1
    //       title = filters[i]
    //     }

    //     if (counter >= 2) {
    //       break
    //     }
    //   }

    //   counter === 1 ? commit('setTitle', title) : commit('setTitle', 'all')
    // } else {
    //   state.titles[filters] === true
    //     ? commit('setTitle', filters)
    //     : commit('setTitle', 'all')
    // }

    commit('setTitle', Array.isArray(filters) ? filters[0] : filters)
  },
  formatFilters({ state, dispatch, commit }, payload) {
    let filters = ''

    // check if a mood, city, or sense
    if (state.filtersList[payload[0]]) {
      payload.forEach((item) => {
        if (state.titles[item] && filters === '') {
          filters += state.filtersList[item]
        } else if (state.titles[item] && filters.length > 0) {
          filters += `AND: ${state.filtersList[item]}`
        }
      })
    } else if (payload[1] === 'cities') {
      filters = `{city_every: {name: "${payload[0]}"}}`
    } else if (payload[1] === 'moods') {
      filters = `{mood: {mood: "${payload[0]}"}}`
    }

    // console.log('api filter', filters)

    commit('setFormattedFilters', filters)
    dispatch('getCategoryPosts')

    // where: {mood: {id_not: "null"}, AND: {sense_every: {id_not: "null"}, AND: {city_every: {id_not: "null"}}}}
    // set sub categories
  },
  handleQueries({ dispatch, commit, state }, payload) {
    let params = Object.values(payload)

    // check if nested or normal array
    Array.isArray(params[0])
      ? (params = JSON.parse(JSON.stringify(params[0])))
      : (params = JSON.parse(JSON.stringify(params)))

    let counter = 0

    if (state.filters.length > 0) {
      for (let i = 0; i < state.filters.length; i++) {
        if (params[i] !== state.filters[i]) {
          counter += 1
        }
      }
    }

    // check if page is already loaded
    if (state.filters.length === 0 || counter > 0) {
      commit('resetFeed')
      commit('setFilters', params)
      dispatch('checkTitle', params)
      dispatch('formatFilters', params)
    }
  },
}

export const mutations = {
  setTitle(state, payload) {
    state.title = payload
  },
  resetFilters(state) {
    state.filters = []
  },
  setFilters(state, payload) {
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
  setCities(state, cities) {
    state.cities = cities
  },
  setMoods(state, moods) {
    state.moods = moods
  },
  setSenses(state, senses) {
    console.log(senses)
    state.senses = senses
  },
  toggleModal(state) {
    console.log('toggle modal')
    state.modal = !state.modal
  },
}
