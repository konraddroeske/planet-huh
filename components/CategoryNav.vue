<template>
  <nav>
    <div class="explore" :class="{ visuallyHidden: variant === 'dark' }">
      Explore
    </div>

    <ul :class="`categoryList-${variant}`">
      <li :class="`category-${variant}`">
        <nuxt-link :to="{ name: 'cities' }">Cities</nuxt-link>
      </li>
      <li :class="`category-${variant}`">
        <nuxt-link :to="{ name: 'senses' }">Senses</nuxt-link>
      </li>
      <li :class="`category-${variant}`">
        <nuxt-link :to="{ name: 'moods' }">Moods</nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      required: true,
      validator(value) {
        return ['light', 'dark'].includes(value)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
nav {
  margin-top: 5rem;

  @media (min-width: $bp-desktop) {
    margin-top: 0;
  }
}

.explore {
  color: $accent;
  text-transform: uppercase;
  text-align: center;
}

.categoryList-dark {
  list-style: none;
  padding-left: 0;
  margin: 2rem 0;
  text-align: center;

  li:not(:last-child) {
    margin-bottom: 1rem;
  }

  @media (min-width: $bp-desktop) {
    margin: 5rem 0;
    display: flex;
    justify-content: space-between;
  }
}

.category-dark {
  font-family: $font-display;
  text-transform: uppercase;
  font-weight: $extrabold;
  font-size: 4rem;
  line-height: 1;

  a,
  a:visited {
    color: $white;
    text-decoration: none;

    &:hover,
    &:focus {
      color: $accent;
    }
  }
}

.categoryList-light {
  list-style: none;
  padding-left: 0;
  margin: 1rem 0 2rem;
  text-align: center;

  @media (min-width: $bp-desktop) {
    margin: 5rem 0;
    display: flex;
    justify-content: space-between;
  }
}

.category-light {
  font-family: $font-display;
  text-transform: uppercase;
  font-weight: $extrabold;
  font-size: 4rem;
  line-height: 1;

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
</style>
