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
  moodCategories: [],
  moodCategoriesUnformatted: [],
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

    // if empty, then no filters
    if (!state.filters) {
    } else {
      // create city, mood, sense arrays
      const city = []
      const mood = []
      const sense = []

      // separate into categories
      state.filters.forEach((item) => {
        if (state.allFilters[item].type === "city") {
          city.push(item)
        }
        if (
          state.allFilters[item].type === "mood" ||
          state.allFilters[item].type === "moodCategory"
        ) {
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
        const moodFilters = mood.filter((item) => item !== "moods")

        moodObj = { mood: { id_not: "null" } }
        let str = "mood.AND"

        for (let i = 0; i < moodFilters.length; i++) {
          if (state.allFilters[moodFilters[i]].type === "mood") {
            set(moodObj, str, { mood: moodFilters[i] })
          }

          if (state.allFilters[moodFilters[i]].type === "moodCategory") {
            set(moodObj, str, {
              moodCategory: moodFilters[i].replace(/\s+/g, ""),
            })
          }

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

      let finalStr = "AND"

      // concatenate all on filter obj
      for (let i = 0; i < filtersArr.length; i++) {
        if (i === 0) {
          filters = filtersArr[i]
        } else {
          set(filters, finalStr, filtersArr[i])
          finalStr += ".AND"
        }
      }
    }

    const format = (obj) => {
      if (obj) {
        let str = JSON.stringify(obj, 0, 4)
        const keys = str.match(/".*?":/g)

        for (let i = 0; i < keys.length; i++) {
          str = str.replace(keys[i], keys[i].replace(/"/g, ""))
        }

        // iterate through enumerations and replace
        state.moodCategoriesUnformatted.forEach((category) => {
          str = str.replace(`"${category}"`, `"${category}"`.replace(/"/g, ""))
        })

        return str
      }

      return ""
    }

    commit("setFormattedFilters", format(filters))
  },
  handleRouteQueries({ dispatch, commit, state }, payload) {
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
  toggleFilter({ state, dispatch, commit }, filter) {
    state.filters.includes(filter)
      ? commit("removeFilter", filter)
      : commit("addFilter", filter)

    dispatch("checkTitle", state.filters)
    dispatch("formatFilters")
    dispatch("getCategoryPosts")
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
  addFilter(state, filter) {
    state.filters.push(filter)
  },
  removeFilter(state, filter) {
    state.filters = state.filters.filter((ele) => ele !== filter)
  },

  resetFeed(state) {
    state.postsFeed = []
  },
  setFormattedFilters(state, filters) {
    state.formattedFilters = filters
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

    state.moodCategoriesUnformatted = [
      ...new Set(state.moods.map((mood) => mood.moodCategory)),
    ]

    state.moodCategories = state.moodCategoriesUnformatted.map((category) =>
      category.replace(/([a-z])([A-Z])/, "$1 $2")
    )

    moods.forEach((mood) => {
      state.allFilters[mood.mood] = {
        type: "mood",
        query: `name: ${mood.mood}`,
      }
    })

    state.moodCategories.forEach((moodCategory) => {
      state.allFilters[moodCategory] = {
        type: "moodCategory",
        query: `name: ${moodCategory}`,
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
