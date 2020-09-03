import set from "lodash.set"
import isEmpty from "lodash.isempty"
import isEqual from "lodash.isequal"
import { fetchContent } from "@/utils/api"

export const state = () => ({
  title: "",
  filters: [],
  modal: false,
  formattedFilters: null,
  allFilters: {
    cities: { type: "city", hasParent: false },
    moods: { type: "mood", hasParent: false },
    senses: { type: "sense", hasParent: false },
  },
  postsFeed: [],
  maxPosts: 0,
  cities: [],
  moods: [],
  senses: [],
  moodCategories: [],
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
      commit("setMaxPosts", 4)
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
  checkTitle({ state, commit }) {
    if (state.filters.length === 1) {
      if (state.allFilters[state.filters[0]].type === "moodCategory") {
        commit("setTitle", state.filters[0].replace(/([a-z])([A-Z])/, "$1 $2"))
      } else {
        commit("setTitle", state.filters[0])
      }
    } else {
      commit("setTitle", "All")
    }
  },
  formatFilters({ state, dispatch, commit }, payload) {
    let filters = {}
    const moodCategories = []

    if (state.filters.length > 0) {
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

      // convert categories to query objects
      if (city.length > 0) {
        const cityFilters = city.filter((item) => item !== "cities")
        cityObj = { city_some: { id_not: "null" } }
        let str = "city_some.AND"

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
            moodCategories.push(moodFilters[i])

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
        senseObj = { sense_some: { id_not: "null" } }
        let str = "sense_some.AND"

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
      if (!isEmpty(obj)) {
        let str = JSON.stringify(obj, 0, 4)
        const keys = str.match(/".*?":/g)

        for (let i = 0; i < keys.length; i++) {
          str = str.replace(keys[i], keys[i].replace(/"/g, ""))
        }

        // remove quotes from enumerations
        moodCategories.forEach((category) => {
          str = str.replace(`"${category}"`, `"${category}"`.replace(/"/g, ""))
        })

        return str
      }

      return `{}`
    }

    commit("setFormattedFilters", format(filters))
  },
  handleRouteQueries({ dispatch, commit, state }, payload) {
    let params = []

    if (typeof payload === "string") {
      params.push(payload)
    } else {
      params = Object.values(payload)

      // check if nested or normal array
      Array.isArray(params[0])
        ? (params = JSON.parse(JSON.stringify(params[0])))
        : (params = JSON.parse(JSON.stringify(params)))
    }

    // check if current filters are already loaded
    if (state.filters.length === 0 || !isEqual(params, state.filters)) {
      commit("resetFeed")
      commit("resetMaxPosts")
      commit("setFilters", params)
      dispatch("checkTitle")
      dispatch("formatFilters")
      dispatch("getCategoryPosts", 8)
    }
  },
  getQueries({ state }, newFilter) {
    let queries = [...state.filters]

    if (state.filters.length === 0) {
      queries.push(newFilter)
    } else if (!state.filters.includes(newFilter)) {
      if (state.allFilters[newFilter].hasParent === false) {
        queries = state.filters.filter((item) => {
          // account for mood/mood categories types
          if (
            state.allFilters[newFilter].type === "mood" ||
            state.allFilters[newFilter].type === "moodCategory"
          ) {
            return (
              state.allFilters[item].type !== "mood" &&
              state.allFilters[item].type !== "moodCategory"
            )
          }

          return (
            state.allFilters[item].type !== state.allFilters[newFilter].type
          )
        })
      } else {
        // search for and remove parent
        queries = state.filters.filter(
          (item) => item !== state.allFilters[newFilter].hasParent
        )
      }

      queries.push(newFilter)
    } else {
      queries = state.filters.filter((ele) => ele !== newFilter)
    }

    return queries
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
  setCategoryPosts(state, newPosts) {
    state.postsFeed = state.postsFeed.concat(newPosts)
  },
  setCities(state, cities) {
    state.cities = cities

    cities.forEach((city) => {
      state.allFilters[city.name] = {
        type: "city",
        hasParent: "cities",
        query: `name: ${city.name}`,
      }
    })
  },
  setMoods(state, moods) {
    state.moods = moods

    state.moodCategories = [
      ...new Set(state.moods.map((mood) => mood.moodCategory)),
    ]

    moods.forEach((mood) => {
      state.allFilters[mood.mood] = {
        type: "mood",
        hasParent: "moods",
        query: `name: ${mood.mood}`,
      }
    })

    state.moodCategories.forEach((moodCategory) => {
      state.allFilters[moodCategory] = {
        type: "moodCategory",
        hasParent: "moods",
        query: `name: ${moodCategory}`,
      }
    })
  },
  setSenses(state, senses) {
    state.senses = senses

    senses.forEach((sense) => {
      state.allFilters[sense.name] = {
        type: "sense",
        hasParent: "senses",
        query: `name: ${sense.name}`,
      }
    })
  },
  setModal(state, payload) {
    state.modal = payload
  },
  setMaxPosts(state, num) {
    state.maxPosts += num
  },
  resetMaxPosts(state) {
    state.maxPosts = 0
  },
}
