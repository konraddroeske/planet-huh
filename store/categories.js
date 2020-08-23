import { fetchContent } from '@/utils/api'

export const state = () => ({
  title: '',
  filters: [],
  postsFeed: [],
})

export const actions = {}

export const mutations = {
  setTitle(state, title) {
    state.title = title
  },
}
