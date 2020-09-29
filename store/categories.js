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
  isFetching: false,
  artists: [],
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
      commit("setIsFetching", false)
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
            post {
              id
              title
              slug
            }
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
            post {
              id
              title
              slug
            }
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
            post {
              id
              title
              slug
            }
        }
      }`)

      const { senses } = data.data

      commit("setSenses", senses)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
  async getArtists({ commit, state }) {
    try {
      const { data } = await fetchContent(`{
        artists(orderBy: name_ASC) {
          id
          location
          name
          socialUrl
          website
          social
          about
          picture {
            url
            width
            height
          }
        }
      }`)

      const { artists } = data.data

      commit("setArtists", artists)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
  checkTitle({ state, commit }) {
    if (state.filters.length === 1) {
      if (state.allFilters[state.filters[0]]?.type === "moodCategory") {
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
      const city = []
      const mood = []
      const sense = []
      const artist = []
      const search = []

      // separate into categories
      state.filters.forEach((item) => {
        if (!state.allFilters[item]) {
          search.push(item)
        } else if (state.allFilters[item].type === "city") {
          city.push(item)
        } else if (
          state.allFilters[item].type === "mood" ||
          state.allFilters[item].type === "moodCategory"
        ) {
          mood.push(item)
        } else if (state.allFilters[item].type === "sense") {
          sense.push(item)
        } else if (state.allFilters[item].type === "artist") {
          artist.push(item)
        }
      })

      const filtersArr = []
      let cityObj = null
      let moodObj = null
      let senseObj = null
      let artistObj = null
      let searchObj = null

      // convert categories to query objects
      if (city.length > 0) {
        const cityFilters = city.filter((item) => item !== "cities")
        cityObj = { city_some: { id_not: "null" } }
        let str = "city_some.AND"

        for (let i = 0; i < cityFilters.length; i++) {
          set(cityObj, str, { name: state.allFilters[cityFilters[i]].query })
          str += ".AND"
        }
        filtersArr.push(cityObj)
      }

      if (sense.length > 0) {
        const senseFilters = sense.filter((item) => item !== "senses")
        senseObj = { sense_some: { id_not: "null" } }
        let str = "sense_some.AND"

        for (let i = 0; i < senseFilters.length; i++) {
          set(senseObj, str, { name: state.allFilters[senseFilters[i]].query })
          str += ".AND"
        }

        filtersArr.push(senseObj)
      }

      if (artist.length > 0) {
        const artistFilters = artist.filter((item) => item !== "artists")
        artistObj = { artist_some: { id_not: "null" } }
        let str = "artist_some.AND"

        for (let i = 0; i < artistFilters.length; i++) {
          set(artistObj, str, {
            name_contains: state.allFilters[artistFilters[i]].query,
          })
          str += ".AND"
        }

        filtersArr.push(artistObj)
      }

      if (search.length > 0) {
        let str = "AND"
        for (let i = 0; i < search.length; i++) {
          if (i === 0) {
            searchObj = { _search: search[i] }
          } else {
            set(searchObj, str, { _search: search[i] })
            str += ".AND"
          }
        }

        filtersArr.push(searchObj)
      }

      // must combine mood categories with mood
      if (mood.length > 0) {
        const moodFilters = mood.filter((item) => item !== "moods")

        moodObj = { mood: { id_not: "null" } }
        let str = "mood.AND"

        for (let i = 0; i < moodFilters.length; i++) {
          if (state.allFilters[moodFilters[i]].type === "mood") {
            set(moodObj, str, { mood: state.allFilters[moodFilters[i]].query })
          }

          if (state.allFilters[moodFilters[i]].type === "moodCategory") {
            moodCategories.push(moodFilters[i])

            set(moodObj, str, {
              moodCategory: state.allFilters[moodFilters[i]].query,
            })
          }

          str += ".AND"
        }

        filtersArr.push(moodObj)
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
          str = str.replace(
            `"${state.allFilters[category].query}"`,
            `"${state.allFilters[category].query}"`.replace(/"/g, "")
          )
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
      commit("setIsFetching", true)
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
      if (!state.allFilters[newFilter]) {
        // if it doesn't exist, do nothing
      } else if (state.allFilters[newFilter].hasParent === false) {
        // check if it has a parent
        queries = state.filters.filter((item) => {
          // account for mood/mood categories types
          if (
            state.allFilters[newFilter].type === "mood" ||
            state.allFilters[newFilter].type === "moodCategory"
          ) {
            return (
              state.allFilters[item]?.type !== "mood" &&
              state.allFilters[item]?.type !== "moodCategory"
            )
          }

          return (
            state.allFilters[item]?.type !== state.allFilters[newFilter].type
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
    cities.forEach((city) => {
      state.allFilters[city.name.toLowerCase()] = {
        type: "city",
        hasParent: "cities",
        query: `${city.name}`,
      }
    })

    state.cities = cities.map((city) => {
      return {
        ...city,
        name: city.name.toLowerCase(),
      }
    })
  },
  setMoods(state, moods) {
    moods.forEach((mood) => {
      state.allFilters[mood.mood.toLowerCase()] = {
        type: "mood",
        hasParent: "moods",
        query: `${mood.mood}`,
      }
    })

    const moodCategories = [...new Set(moods.map((mood) => mood.moodCategory))]

    moodCategories.forEach((moodCategory) => {
      state.allFilters[
        moodCategory.replace(/([a-z])([A-Z])/, "$1 $2").toLowerCase()
      ] = {
        type: "moodCategory",
        hasParent: "moods",
        query: `${moodCategory}`,
      }
    })

    state.moods = moods.map((mood) => {
      return {
        ...mood,
        mood: mood.mood.toLowerCase(),
      }
    })

    state.moodCategories = moodCategories.map((moodCategory) =>
      moodCategory.replace(/([a-z])([A-Z])/, "$1 $2").toLowerCase()
    )
  },
  setSenses(state, senses) {
    senses.forEach((sense) => {
      state.allFilters[sense.name.toLowerCase()] = {
        type: "sense",
        hasParent: "senses",
        query: `${sense.name}`,
      }
    })

    state.senses = senses.map((sense) => {
      return {
        ...sense,
        name: sense.name.toLowerCase(),
      }
    })
  },
  setArtists(state, artists) {
    artists.forEach((artist) => {
      state.allFilters[artist.name.toLowerCase()] = {
        type: "artist",
        hasParent: "artists",
        query: `${artist.name}`,
      }
    })

    state.artists = artists.map((artist) => {
      return {
        ...artist,
        name: artist.name.toLowerCase(),
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
  setIsFetching(state, payload) {
    state.isFetching = payload
  },
}
