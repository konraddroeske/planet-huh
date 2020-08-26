<template>
  <div class="container">
    <div class="wrapper">
      <div class="heroRow">
        <img class="bannerImage" :src="imageSrc" alt="" @load="onImgLoad" />
        <h1 class="titleText postTitle">{{ title }}</h1>

        <div class="titleText artistOne">
          {{ artistOne.name }}
          <span class="artistCity">{{ artistOne.location }}</span>
        </div>

        <div class="titleText artistTwo">
          <span class="artistCity">{{ artistTwo.location }}</span>
          {{ artistTwo.name }}
        </div>
      </div>

      <div class="metaRow">
        <p class="accentText headline">{{ headline }}</p>
        <div class="dateContainer">
          <span class="accentText dateTitle">Posted:</span>
          <span class="date"><Date :input="date" /></span>
        </div>

        <div class="categoriesContainer">
          <span class="accentText categoriesTitle">Filed Under:</span>
          <ul class="categories">
            <li v-if="city.length > 0" class="category">
              <span class="visuallyHidden">City One: </span
              >{{ cityOneFormatted }}
            </li>
            <li v-if="city.length > 0" class="category">
              <span class="visuallyHidden">City Two: </span
              >{{ cityTwoFormatted }}
            </li>
            <li v-if="sense.length > 0" class="category">
              <span class="visuallyHidden">Sense: </span>{{ senseFormatted }}
            </li>
            <li v-if="mood" class="category">
              <span class="visuallyHidden">Mood: </span>{{ moodFormatted }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Date from '@/components/Date'
export default {
  components: { Date },
  props: {
    imageSrc: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    headline: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    artist: {
      type: Array,
      required: true,
      validator(arr) {
        return arr.length === 2
      },
    },
    city: {
      type: Array,
      default: () => [],
      validator(arr) {
        return arr.length >= 2
      },
    },
    sense: {
      type: [Array, String],
      default: () => null,
    },
    mood: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    senseFormatted() {
      return this.sense.length > 0 ? `${this.sense[0].name}` : null
    },
    moodFormatted() {
      return `${this.mood.mood}`
    },
    cityOneFormatted() {
      return this.city.length > 0 ? `${this.city[0].name}` : null
    },
    cityTwoFormatted() {
      return this.city.length > 0 ? `${this.city[1].name}` : null
    },
    artistOne() {
      return this.artist[0]
    },
    artistTwo() {
      return this.artist[1]
    },
  },
  activated() {
    setTimeout(() => {
      this.$store.dispatch('setNavContainerSmall')
    }, 300)
  },
  methods: {
    onImgLoad() {
      this.$store.dispatch('setNavContainerSmall')
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 6.5rem;
  text-align: center;

  @media (min-width: $bp-desktop) {
    margin-top: 0;
    margin-bottom: 0;
    text-align: left;
  }
}

.wrapper {
  width: 85%;
  margin: 0 auto;

  @media (min-width: $bp-desktop) {
    width: 100%;
    margin: 0;
  }
}

.heroRow {
  position: relative;
  min-height: 80vh;
  @media (min-width: $bp-desktop) {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    position: relative;
  }
}

.bannerImage {
  display: block;
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;

  @media (min-width: $bp-desktop) {
    width: 50%;
  }
}

.titleText {
  text-transform: uppercase;
  font-family: $font-display;
  font-weight: $extrabold;
  font-size: 2.25rem;
  @media (min-width: $bp-desktop) {
    font-size: 3.5rem;
    width: 75%;
    margin-bottom: 1rem;
  }
}

.postTitle {
  position: absolute;
  top: calc(50% - 1rem);
  left: 0;
  right: 0;
}

.artistOne {
  position: absolute;
  top: -1.5rem;
  left: 0;
  right: 0;
}

.artistTwo {
  position: absolute;
  bottom: -1.5rem;
  left: 0;
  right: 0;
}

.artistCity {
  display: block;
  font-weight: $medium;
  font-size: 1.15rem;
}

// .bannerText {
//   @media (min-width: $bp-desktop) {
//     width: 50%;
//     padding-left: 2rem;
//     padding-right: 5%;
//     padding-top: 1.5rem;
//     padding-bottom: 1.5rem;
//   }
// }

.headline {
  color: $gray;
  font-weight: $semibold;
  font-size: 1.1rem;
  margin: 5rem 0 3rem;
  @media (min-width: $bp-desktop) {
    font-size: 1.5rem;
  }
}

.metaRow {
  @media (min-width: $bp-desktop) {
    display: flex;
    width: calc(100% - 4rem);
    margin: 2rem 2rem 0 2rem;
  }
}

.dateContainer {
  @media (min-width: $bp-desktop) {
    width: 50%;
  }
}

.categoriesContainer {
  @media (min-width: $bp-desktop) {
    width: 50%;
    display: flex;
  }
}

.dateTitle,
.categoriesTitle {
  display: block;
  margin-top: 2rem;

  @media (min-width: $bp-desktop) {
    display: inline-block;
    margin-top: 0;
  }
}

.categoriesTitle {
  @media (min-width: $bp-desktop) {
    margin-right: 0.25rem;
  }
}

.date,
.category {
  font-weight: $semibold;
  font-size: 1.1rem;
  @media (min-width: $bp-desktop) {
    font-size: 1.25rem;
  }
}

.categories {
  list-style: none;
  padding-left: 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

.category {
  text-transform: capitalize;
  margin-right: 1rem;
  position: relative;

  &::before {
    content: '•';
    position: absolute;
    left: -0.75rem;
    top: 0;
  }

  @media (min-width: $bp-desktop) {
    margin-right: 1.5rem;

    &::before {
      content: '•';
      position: absolute;
      left: -1rem;
      top: 0;
    }
  }
}

.category:first-child {
  &::before {
    content: '';
  }
}

.category:last-child {
  margin-right: 0;
}
</style>
