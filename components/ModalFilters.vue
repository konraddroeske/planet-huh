<template>
  <div class="modalFilters">
    <div class="filtersTop">
      <div class="topBar">
        <h2 class="filtersTitle">Filter By:</h2>
        <div class="modalButtonContainer">
          <ModalNavButton @onClick="closeModal" />
        </div>
      </div>
      <div class="filtersCategory">
        <button ref="sense" class="categoryButton">Sense</button>
        <ul class="filtersList senses">
          <li v-for="sense of senses" :key="sense.id" class="filtersItem">
            <button class="listButton">{{ sense.name }}</button>
          </li>
        </ul>
      </div>
      <div class="filtersCategory">
        <button ref="mood" class="categoryButton">Mood</button>
        <ul class="filtersList moods">
          <li v-for="mood of moods" :key="mood.id" class="filtersItem">
            <button class="listButton">{{ mood }}</button>
          </li>
        </ul>
      </div>
      <div class="filtersCategory">
        <button ref="city" class="categoryButton">City</button>
        <ul class="filtersList cities">
          <li v-for="city of cities" :key="city.id" class="filtersItem">
            <button class="listButton">{{ city.name }}</button>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <button class="clearButton">Clear Selection</button>
    </div>
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
    senses: (state) => state.categories.senses,
    moods: (state) =>
      [...new Set(state.categories.moods.map((mood) => mood.moodCategory))]
        .map((category) => category.replace(/([a-z])([A-Z])/, '$1 $2'))
        .sort()
        .reverse(),
  }),
  methods: {
    clearSelection() {},
    toggleFilter() {},
    closeModal() {},
    toggleCategory() {
      // add to filters
      // if mobile, expand and contract
    },
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
  z-index: $z-filters;

  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.5);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 1rem 1rem 4.4rem 1rem;

  .topBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .filtersCategory {
    padding: 1rem 0;
    border-bottom: 1px solid $black;
  }

  .filtersCategory:last-child {
    border-bottom: none;
  }

  h2,
  button {
    font-weight: $medium;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    padding: 0.5rem 0.8rem;
    font-size: $font-lg;
  }

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    white-space: nowrap;
  }

  .categoryButton {
    font-size: 1.2rem;
    color: $accent;
    padding: 0.6rem 0.9rem;
  }

  .listButton {
    font-size: $font-x-sm;
    margin: 0.2rem 0.6rem 0.2rem 0;
    border-radius: 180px;
    padding: 0.6rem 1rem;
  }

  .listButton:hover,
  .listButton:focus,
  .listButton:active {
    background-color: $accentTransparent;
  }

  .clearButton {
    text-decoration: underline;
    padding: 0.6rem 1rem;
  }

  ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
  }

  .senses,
  .moods,
  .cities {
    height: 0;
    overflow: hidden;
  }

  .senses {
    height: 100%;
  }

  .moods {
    li {
      width: 50%;
    }
  }
}

@media (min-width: $bp-mobile) {
  .filtersCategory {
    padding: 2rem 0;
  }
}

@media (min-width: $bp-desktop) {
  .modalFilters {
    padding: 1.5rem 2rem 3.4rem 2rem;
  }
}
</style>
