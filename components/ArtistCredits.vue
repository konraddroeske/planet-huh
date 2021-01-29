<template>
  <section>
    <h2 class="visuallyHidden">Artist Information</h2>
    <div
      v-for="(artist, index) of artists"
      :key="artist.name"
      :class="{
        oddLastArtist: index + 1 === artists.length && index % 2 === 0,
      }"
      class="artistContainer"
    >
      <div class="wrapper">
        <div class="shortInfo">
          <div class="name">
            <h3 class="accentText">
              {{ isSingleArtist ? "Curated By" : "Who" }}
            </h3>
            <nuxt-link
              :to="`/categories?filters=${artist.name.toLowerCase()}`"
              >{{ artist.name }}</nuxt-link
            >
          </div>

          <div class="website">
            <h3 class="accentText">Website</h3>
            <a
              :href="artist.website"
              target="_blank"
              rel="canonical noopener noreferrer"
            >
              {{ artist.website.replace(/(^\w+:|^)\/\//, "") }}
            </a>
          </div>

          <div class="social">
            <h3 class="accentText">Social</h3>
            <a
              :href="artist.socialUrl"
              target="_blank"
              rel="canonical noopener noreferrer"
            >
              {{ artist.social }}
            </a>
          </div>
        </div>

        <div>
          <h3 class="accentText">
            {{ isSingleArtist ? "About the Author" : "About" }}
          </h3>
          <p class="bodyText">{{ artist.about }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    artists: {
      type: Array,
      required: true,
      validator(arr) {
        return arr.length > 0
      },
    },
  },
  computed: {
    isSingleArtist() {
      return this.$props.artists.length === 1
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 85%;
  margin: 0 auto;
}
section {
  @media (min-width: $bp-desktop) {
    display: flex;
    flex-wrap: wrap;

    > * {
      flex: 1 1 50%;
    }

    border-bottom: 1px solid $black;
  }
}
.artistContainer {
  text-align: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
  border-top: 1px solid $black;
  &:last-child {
    border-bottom: 1px solid $black;
  }

  @media (min-width: $bp-desktop) {
    padding-top: 3rem;
    padding-bottom: 3rem;
    &:nth-child(even):not(:last-child) {
      border-right: 1px solid $black;
    }
    &:last-child {
      border-bottom: none;
    }
  }

  h3,
  p {
    margin: 0;
  }

  a,
  span {
    font-family: $font-display;
    font-size: 1.25rem;
    font-weight: $semibold;
  }
  a,
  a:visited {
    color: $black;
    text-decoration: none;

    &:hover,
    &:focus {
      color: $accent;
    }
  }
}

.name,
.website,
.social {
  margin-bottom: 2rem;

  @media (min-width: $bp-desktop) {
    margin-bottom: 3rem;
  }
}

.oddLastArtist {
  @media (min-width: $bp-desktop) {
    padding-left: 12.5%;
    padding-right: 12.5%;
  }
}

.shortInfo {
  @media (min-width: $bp-xl-desktop) {
    display: flex;
    justify-content: space-between;
  }
}
</style>
