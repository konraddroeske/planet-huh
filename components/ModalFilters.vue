<template>
  <div class="modalFilters">
    <div class="modalButtonContainer">
      <ModalNavButton @onClick="closeModal" />
    </div>
    <div class="filtersTop">
      <h2 class="filtersTitle">Filter By:</h2>
      <div class="filtersCategory">
        <h3><button>Sense</button></h3>
        <ul class="filtersList">
          <li v-for="sense of senses" :key="sense.id" class="filtersItem">
            <button>{{ sense.name }}</button>
          </li>
        </ul>
      </div>
      <div class="filtersCategory">
        <h3><button>Mood</button></h3>
        <ul class="filtersList">
          <li v-for="mood of moods" :key="mood.id" class="filtersItem">
            <button>{{ mood.moodCategory }}</button>
          </li>
        </ul>
      </div>
      <div class="filtersCategory">
        <h3><button>City</button></h3>
        <ul class="filtersList">
          <li v-for="city of cities" :key="city.id" class="filtersItem">
            <button>{{ city.name }}</button>
          </li>
        </ul>
      </div>
    </div>
    <button>Clear Selection</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ModalNavButton from '@/components/ModalNavButton'

export default {
  components: {
    ModalNavButton,
  },
  computed: mapState({
    cities: (state) => state.categories.cities,
    moods: (state) => state.categories.moods,
    senses: (state) => state.categories.senses,
  }),
  methods: {
    clearSelection() {},
    toggleFilter() {},
    closeModal() {},
  },
}
</script>

<style lang="scss" scoped>
.modalFilters {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100;
  z-index: $z-modal;
  padding: 2rem;

  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.5);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.modalButtonContainer {
  position: absolute;
  right: 2rem;
  top: 1.5rem;
}
</style>
