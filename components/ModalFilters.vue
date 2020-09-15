<template>
  <div ref="modalFilters" class="modalFilters backdrop-blur">
    <resize-observer @notify="handleResize()" />
    <div class="filtersTop">
      <div class="topBar">
        <h2 class="filtersTitle">Filter By:</h2>
        <div class="modalButtonContainer">
          <ModalNavButton @clicked="closeModal()" />
        </div>
      </div>
      <div class="filtersSearch">
        <SearchBar variant="light" @onSubmit="routeFilter" />
        <ul class="tags">
          <li v-for="(filter, index) in filters" :key="index">
            <button
              class="listButton tagButton"
              :class="setFiltersClass(filter)"
              @click="routeFilter(filter)"
            >
              {{ filter }}
              <span class="tagClose"></span>
            </button>
          </li>
        </ul>
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
          <li class="filtersItem">
            <button
              class="listButton"
              :class="setFiltersClass('senses')"
              @click="routeFilter('senses')"
            >
              All
            </button>
          </li>
          <li v-for="sense of senses" :key="sense.id" class="filtersItem">
            <button
              class="listButton"
              :class="setFiltersClass(sense.name)"
              @click="routeFilter(sense.name)"
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
          <li class="filtersItem">
            <button
              class="listButton"
              :class="setFiltersClass('moods')"
              @click="routeFilter('moods')"
            >
              All
            </button>
          </li>
          <li
            v-for="(moodCategory, index) of moodCategories"
            :key="index"
            class="filtersItem"
          >
            <button
              class="listButton"
              :class="setFiltersClass(moodCategory)"
              @click="routeFilter(moodCategory)"
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
          <li class="filtersItem">
            <button
              class="listButton"
              :class="setFiltersClass('cities')"
              @click="routeFilter('cities')"
            >
              All
            </button>
          </li>
          <li v-for="city of cities" :key="city.id" class="filtersItem">
            <button
              class="listButton"
              :class="setFiltersClass(city.name)"
              @click="routeFilter(city.name)"
            >
              {{ city.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <button class="clearButton" @click="routeFilter()">
        Clear Selection
      </button>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import VueResize from "vue-resize"
import gsap from "gsap"
import { mapState, mapActions } from "vuex"
import ModalNavButton from "@/components/ModalNavButton"
import SearchBar from "@/components/SearchBar"
import "vue-resize/dist/vue-resize.css"

Vue.use(VueResize)

export default {
  components: {
    ModalNavButton,
    SearchBar,
  },
  data() {
    return {
      currentCategory: null,
      modalRef: null,
    }
  },
  computed: {
    isCategories() {
      return this.$route.fullPath.includes("categories")
    },
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
      allFilters: (state) => state.categories.allFilters,
    }),
  },
  watch: {
    // whenever question changes, this function will run
    isCategories(newVal, oldVal) {
      if (newVal === false) {
        this.closeModal()
      }
    },
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
    ...mapActions({
      getQueries: "categories/getQueries",
    }),
    async routeFilter(filter) {
      gsap.to(window, 0.4, {
        scrollTo: 0,
        ease: "power4.out",
      })

      let queries = []
      filter ? (queries = await this.getQueries(filter)) : (queries = [])

      this.$router.push({
        path: "/categories",
        query: { filters: queries },
      })
    },
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
    },
    setCategoryClass(name) {
      return {
        bolded: this.filters.some(
          (filter) =>
            this.allFilters[filter]?.hasParent === name || filter === name
        ),
      }
    },
    setFiltersClass(name) {
      return {
        highlighted: this.filters.includes(name),
      }
    },
    // formatMood(mood) {
    //   console.log(mood)
    //   return mood.replace(/([a-z])([A-Z])/, "$1 $2")
    // },
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;

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

  .filtersSearch,
  .filtersCategory {
    padding: 1rem 0;
    border-bottom: 1px solid $black;
  }

  .filtersCategory:last-child {
    border-bottom: none;
  }

  .tags {
    padding-top: 0.6rem;
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

  .tagButton {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tagClose {
    width: 1rem;
    position: relative;
    left: 0.5rem;

    &::before,
    &::after {
      content: "";
      display: block;
      height: 0.06rem;
      background: $black;
      position: absolute;
      width: 0.8rem;
    }

    &::before {
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      bottom: -0.025rem;
      background-color: $black;
    }

    &::after {
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      top: -0.025rem;
      background-color: $black;
    }
  }

  .listButton:hover,
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

    .filtersSearch,
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
