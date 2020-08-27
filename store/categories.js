import set from "lodash.set"
import { fetchContent } from "@/utils/api"

export const state = () => ({
  title: "",
  filters: [],
  modal: false,
  formattedFilters: null,
  allFilters: {
    cities: { type: "city" },
    moods: { type: "mood" },
    senses: { type: "sense" },
  },
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
      commit("setCategoryPosts", posts)
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
      commit("setMoods", moods)
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
      commit("setCities", cities)
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

      commit("setSenses", senses)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
  checkTitle({ state, commit }, filters) {
    commit("setTitle", Array.isArray(filters) ? filters[0] : filters)
  },
  formatFilters({ state, dispatch, commit }, payload) {
    let filters = {}

    console.log("current filters", state.filters)

    // if empty, then no filters
    if (!state.filters) {
    } else {
      // create city, mood, sense strings
      const city = []
      const mood = []
      const sense = []

      // separate into categories
      state.filters.forEach((item) => {
        if (state.allFilters[item].type === "city") {
          city.push(item)
        }
        if (state.allFilters[item].type === "mood") {
          mood.push(item)
        }
        if (state.allFilters[item].type === "sense") {
          sense.push(item)
        }
      })

      const filtersArr = []
      let cityObj = null
      let moodObj = null
      let senseObj = null

      // interate through arrs, and create objects
      if (city.length > 0) {
        const cityFilters = city.filter((item) => item !== "cities")
        cityObj = { city_every: { id_not: "null" } }
        let str = "city_every.AND"

        for (let i = 0; i < cityFilters.length; i++) {
          set(cityObj, str, { name: cityFilters[i] })
          str += ".AND"
        }
        filtersArr.push(cityObj)
      }

      // must combine mood categories with mood
      if (mood.length > 0) {
        const moodFilters = city.filter((item) => item !== "moods")
        moodObj = { mood: { id_not: "null" } }
        let str = "mood.AND"

        for (let i = 0; i < moodFilters.length; i++) {
          set(moodObj, str, { mood: moodFilters[i] })
          str += ".AND"
        }

        filtersArr.push(moodObj)
      }

      if (sense.length > 0) {
        const senseFilters = sense.filter((item) => item !== "senses")
        senseObj = { sense_every: { id_not: "null" } }
        let str = "sense_every.AND"

        for (let i = 0; i < senseFilters.length; i++) {
          set(senseObj, str, { name: senseFilters[i] })
          str += ".AND"
        }

        filtersArr.push(senseObj)
      }

      let finalStr = ""

      // concatenate all on filter obj
      for (let i = 0; i < filtersArr.length; i++) {
        if (i === 0) {
          filters = filtersArr[i]
        } else {
          set(filters, finalStr, filtersArr[i])
        }

        finalStr += ".AND"
      }
    }

    const format = (obj) => {
      if (obj) {
        let str = JSON.stringify(obj, 0, 4)
        const arr = str.match(/".*?":/g)

        for (let i = 0; i < arr.length; i++)
          str = str.replace(arr[i], arr[i].replace(/"/g, ""))

        return str
      }

      return ""
    }

    console.log("formatted filters", format(filters))

    commit("setFormattedFilters", format(filters))
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
      commit("resetFeed")
      commit("setFilters", params)
      dispatch("checkTitle", params)
      dispatch("formatFilters")
      dispatch("getCategoryPosts")
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

    cities.forEach((city) => {
      state.allFilters[city.name] = {
        type: "city",
        query: `name: ${city.name}`,
      }
    })
  },
  setMoods(state, moods) {
    state.moods = moods

    moods.forEach((mood) => {
      state.allFilters[mood.mood] = {
        type: "mood",
        query: `name: ${mood.mood}`,
      }
    })
  },
  setSenses(state, senses) {
    state.senses = senses

    senses.forEach((sense) => {
      state.allFilters[sense.name] = {
        type: "sense",
        query: `name: ${sense.name}`,
      }
    })
  },
  setModal(state, payload) {
    state.modal = payload
  },
}
