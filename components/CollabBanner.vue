<template>
  <div class="container">
    <div class="wrapper">
      <div class="heroRow">
        <img class="bannerImage" :src="imageSrc" alt="" />
        <h1 class="titleText postTitle">
          <span class="miniTitle">{{ titleArray[0] }}</span>
          {{ titleArray.slice(1).join(" ") }}
        </h1>

        <div class="titleText artistOne">
          {{ artistOne.name }}
          <span class="miniTitle">{{ artistOne.location }}</span>
        </div>

        <div class="titleText artistTwo">
          <span class="miniTitle">{{ artistTwo.location }}</span>
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
import Date from "@/components/Date"
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
    titleArray() {
      return this.title.split(/\s+/)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 6.5rem;
  text-align: center;

  @media (min-width: $bp-desktop) {
    margin-top: 9rem;
  }
}

.wrapper {
  width: 85%;
  margin: 0 auto;

  @media (min-width: $bp-desktop) {
    width: 90%;
    position: relative;
  }
}

.heroRow {
  position: relative;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (min-width: $bp-desktop) {
    height: 65vh;
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
}

.titleText {
  text-transform: uppercase;
  font-family: $font-display;
  font-weight: $extrabold;
  font-size: 2.25rem;
  @media (min-width: $bp-desktop) {
    font-size: 3.5rem;
  }
}

.postTitle {
  position: relative;
}

.artistOne {
  position: absolute;
  top: -1.5rem;
  left: 0;
  width: 100%;

  @media (min-width: $bp-desktop) {
    text-align: left;
    top: -2rem;
    left: -1.5rem;
    width: calc(100% + 3rem);
  }
}

.artistTwo {
  position: absolute;
  bottom: -1.5rem;
  right: 0;
  width: 100%;

  @media (min-width: $bp-desktop) {
    text-align: right;
    bottom: -2rem;
    right: -1.5rem;
    width: calc(100% + 3rem);
  }
}

.miniTitle {
  display: block;
  font-weight: $medium;
  font-size: 1.15rem;
  @media (min-width: $bp-desktop) {
    font-size: 1.5rem;
  }
}

.headline {
  color: $gray;
  font-weight: $medium;
  font-size: 1.1rem;
  margin: 4rem 0 2rem;
  @media (min-width: $bp-desktop) {
    font-family: $font-display;
    font-weight: $semibold;
    font-size: 1.25rem;
    color: $black;
    text-transform: none;
    margin: 6rem 0 4rem;
  }
}

.metaRow {
  margin: 0 0 3rem;
  @media (min-width: $bp-desktop) {
    margin: 2rem 2rem 0 2rem;
  }
}

.dateContainer {
  @media (min-width: $bp-desktop) {
    position: absolute;
    top: calc(65vh + 1rem);
    left: 0;
  }
}

.categoriesContainer {
  @media (min-width: $bp-desktop) {
    display: flex;
    position: absolute;
    right: 0;
    top: -2.5rem;
  }
}

.dateTitle,
.categoriesTitle {
  display: block;
  margin-top: 2.5rem;

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
    content: "•";
    position: absolute;
    left: -0.75rem;
    top: 0;
  }

  @media (min-width: $bp-desktop) {
    margin-right: 1.5rem;

    &::before {
      content: "•";
      position: absolute;
      left: -1rem;
      top: 0;
    }
  }
}

.category:first-child {
  &::before {
    content: "";
  }
}

.category:last-child {
  margin-right: 0;
}
</style>
