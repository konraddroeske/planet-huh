<template>
  <div ref="modalFilters" class="modalFilters">
    <resize-observer @notify="handleResize()" />
    <div class="filtersTop">
      <div class="topBar">
        <h2 class="filtersTitle">Filter By:</h2>
        <div class="modalButtonContainer">
          <ModalNavButton @clicked="closeModal()" />
        </div>
      </div>
      <div class="filtersCategory">
        <button
          ref="sense"
          class="categoryButton"
          :class="setCategoryClass('senses')"
          @click="toggleCategory('senses')"
        >
          Sense
        </button>
        <ul id="senses" class="filtersList senses">
          <li v-for="sense of senses" :key="sense.id" class="filtersItem">
            <button
              class="listButton"
              :class="setFiltersClass(sense.name)"
              @click="toggleFilter(sense.name)"
            >
              {{ sense.name }}
            </button>
          </li>
        </ul>
      </div>
      <div class="filtersCategory">
        <button
          ref="mood"
          class="categoryButton"
          :class="setCategoryClass('moods')"
          @click="toggleCategory('moods')"
        >
          Mood
        </button>
        <ul id="moods" class="filtersList moods">
          <li
            v-for="(moodCategory, index) of moodCategories"
            :key="index"
            class="filtersItem"
          >
            <button
              class="listButton"
              :class="setFiltersClass(moodCategory)"
              @click="toggleFilter(moodCategory)"
            >
              {{ moodCategory }}
            </button>
          </li>
        </ul>
      </div>
      <div class="filtersCategory">
        <button
          ref="city"
          class="categoryButton"
          :class="setCategoryClass('cities')"
          @click="toggleCategory('cities')"
        >
          City
        </button>
        <ul id="cities" class="filtersList cities">
          <li v-for="city of cities" :key="city.id" class="filtersItem">
            <button
              class="listButton"
              :class="setFiltersClass(city.name)"
              @click="toggleFilter(city.name)"
            >
              {{ city.name }}
            </button>
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
import Vue from "vue"
import VueResize from "vue-resize"
import gsap from "gsap"
import { mapState, mapActions } from "vuex"
import ModalNavButton from "@/components/ModalNavButton"
import "vue-resize/dist/vue-resize.css"

Vue.use(VueResize)

export default {
  components: {
    ModalNavButton,
  },
  data() {
    return {
      currentCategory: null,
      modalRef: null,
    }
  },
  computed: {
    setSubCategoryClass(name) {
      return {
        highlighted: this.filters.includes(name),
      }
    },
    ...mapState({
      cities: (state) => state.categories.cities,
      senses: (state) => state.categories.senses,
      moodCategories: (state) => state.categories.moodCategories,
      filters: (state) => state.categories.filters,
    }),
  },
  mounted() {
    this.onMount()
  },
  // activated() {
  //   console.log('activated')
  //   this.onMount()
  // },
  methods: {
    onMount() {
      this.modalRef = this.$refs.modalFilters
      this.setModalListener()
      this.openModal()
    },
    setModalListener() {
      this.$nuxt.$on("close-modal", () => {
        this.closeModal()
      })
    },
    ...mapActions({ toggleFilter: "categories/toggleFilter" }),
    clearSelection() {},
    openModal() {
      if (!gsap.isTweening(this.modalRef)) {
        gsap.to(this.modalRef, 0.4, { x: "0%" })
      }
    },
    closeModal() {
      if (!gsap.isTweening(this.modalRef)) {
        const tl = gsap.timeline({
          onComplete: () => {
            this.$store.commit("categories/setModal", false)
          },
        })

        tl.to(this.modalRef, 0.4, { x: "100%" })
      }
    },
    handleResize() {
      this.animateList(0)
    },
    animateList(time) {
      const filtersList = document.querySelectorAll(".filtersList")

      filtersList.forEach((list) => {
        if (list.id === this.currentCategory) {
          gsap.to(list, time, { maxHeight: list.scrollHeight + "px" })
        } else {
          gsap.to(list, time, { maxHeight: "0px" })
        }
      })
    },
    toggleCategory(category) {
      this.currentCategory === category
        ? (this.currentCategory = null)
        : (this.currentCategory = category)

      this.animateList(0.4)

      // add to filters
      // this.toggleFilter(category)
    },
    setCategoryClass(name) {
      return {
        bolded: this.filters.includes(name),
      }
    },
    setFiltersClass(name) {
      return {
        highlighted: this.filters.includes(name),
      }
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

  transform: translateX(100%);

  .filtersTop {
    position: relative;
  }

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

  .filtersList {
    max-height: 0;
    overflow: hidden;
    position: relative;
  }

  .moods {
    li {
      width: 50%;
    }
  }

  .bolded {
    font-weight: 600;
  }

  .highlighted {
    background-color: $accentTransparent;
  }
}

@media (min-width: $bp-mobile) {
  .modalFilters {
    left: auto;
    max-width: $bp-mobile;

    .filtersCategory {
      padding: 2rem 0;
    }
  }
}

@media (min-width: $bp-desktop) {
  .modalFilters {
    padding: 1.5rem 2rem 3.4rem 2rem;
  }
}
</style>
