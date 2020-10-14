import { fetchContent } from "@/utils/api"

export const state = () => ({
  cities: [],
  moods: {
    NegativeLow: {
      r: 209,
      g: 221,
      b: 188,
      latitude: 30,
      longitude: 0,
      posts: [],
      name: "green",
      // name: "blue",
    },
    NegativeHigh: {
      r: 193,
      g: 146,
      b: 224,
      latitude: 30,
      longitude: -120,
      posts: [],
      name: "purple",
      // name: "orange",
    },
    NegativeMedium: {
      r: 116,
      g: 155,
      b: 255,
      latitude: 30,
      longitude: 120,
      posts: [],
      name: "blue",
      // name: "green",
    },
    PositiveMedium: {
      r: 255,
      g: 147,
      b: 30,
      latitude: -30,
      longitude: 60,
      posts: [],
      name: "orange",
      // name: "magenta",
    },
    PositiveHigh: {
      r: 255,
      g: 123,
      b: 172,
      latitude: -30,
      longitude: -60,
      posts: [],
      name: "red",
    },
    PositiveLow: {
      r: 255,
      g: 229,
      b: 172,
      latitude: -30,
      longitude: 180,
      posts: [],
      name: "yellow",
    },
  },
})

export const actions = {
  async getMoods({ commit, state }) {
    try {
      const { data } = await fetchContent(`{
        moods(orderBy: createdAt_DESC) {
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
        cities(orderBy: createdAt_DESC) {
            id
            name
            coordinates {
                latitude
                longitude
            }
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
}

export const mutations = {
  setCities(state, cities) {
    cities.forEach((city) => {
      state.cities.push([
        city.coordinates.latitude,
        city.coordinates.longitude,
        city.name.toLowerCase(),
      ])
    })
  },
  setMoods(state, moods) {
    moods.forEach((mood) => {
      state.moods[mood.moodCategory].posts.push({
        title: mood.mood.toLowerCase(),
      })
    })
  },
}
