<template>
  <section class="curators">
    <Wrapper>
      <h2 class="sectionTitle">
        {{ artists.length > 1 ? "City Curators" : "City Curator" }}
      </h2>
      <p v-if="description" class="bodyText description">{{ description }}</p>
      <ul :class="getClass()">
        <li v-for="artist of viewableArtists" :key="artist.id">
          <CityCurator :artist="artist" />
        </li>
      </ul>
      <Button v-if="isViewable" ref="load" @clicked="addRow">
        Load More
      </Button>
    </Wrapper>
  </section>
</template>

<script>
import { mapState } from "vuex"
import CityCurator from "@/components/CityCurator"
import Wrapper from "@/components/Wrapper"
import Button from "@/components/Button"

export default {
  components: {
    CityCurator,
    Wrapper,
    Button,
  },
  props: {
    artists: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      width: null,
      postsPerRow: null,
      rowsLoaded: 1,
    }
  },
  computed: {
    ...mapState({
      description: (state) => state.categories.curatorDescription,
    }),
    viewableArtists() {
      return this.artists.slice(0, this.rowsLoaded * this.postsPerRow)
    },
    isViewable() {
      return this.rowsLoaded * this.postsPerRow < this.artists.length
    },
  },
  mounted() {
    this.onMount()
  },
  activated() {
    this.onMount()
  },
  deactivated() {
    this.onDestroy()
  },
  methods: {
    onMount() {
      this.width = window.matchMedia("(min-width: 1600px)")
      this.setCurators(this.width)
      this.width.addListener(this.setCurators)
    },
    onDestroy() {
      this.width.removeListener(this.setCurators)
    },
    getClass() {
      return {
        curatorsSingle: this.artists.length === 1,
        curatorsDouble: this.artists.length === 2,
        curatorsList: this.artists.length > 2,
      }
    },
    setCurators(width) {
      if (width.matches) {
        this.postsPerRow = 3
      } else {
        this.postsPerRow = 2
      }
    },
    addRow() {
      this.$refs.load.$el.blur()
      this.rowsLoaded += 1
    },
  },
}
</script>

<style lang="scss" scoped>
.curators {
  .wrapper {
    display: flex;
    flex-direction: column;

    button {
      margin: 3rem auto 0 auto;
    }
  }
}

ul {
  margin: 0;
  padding: 0;

  li {
    border: 1px solid $black;
    display: flex;

    &:hover {
      border: 1px solid $accent;
    }
  }
}

.curatorsSingle {
  display: flex;
  justify-content: center;

  li {
    width: 100%;
    max-width: calc(40rem - 1.5%);
  }
}

.curatorsDouble {
  margin: 0 auto;
  max-width: 80rem;
}

.curatorsList,
.curatorsDouble {
  display: grid;
  grid-row-gap: 3rem;

  li {
    width: 100%;
  }
}

.description {
  font-size: $font-x-sm;
  margin: 0rem auto 3.5rem auto;
  text-transform: none;
  font-weight: 400;
  text-align: center;

  @media (min-width: $bp-mobile) {
    font-size: $font-sm;
  }

  @media (min-width: $bp-desktop) {
    max-width: 75%;
  }
}

@media (min-width: $bp-desktop) {
  .curatorsList,
  .curatorsDouble {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-column-gap: 3%;
  }
}

@media (min-width: $bp-xl-desktop) {
  .curatorsList {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-column-gap: 3%;
  }
}
</style>
