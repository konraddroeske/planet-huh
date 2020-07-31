<template>
  <div :class="`category-${variant}`">
    <div v-if="variant === 'gradient'" class="explore">Explore</div>
    <nuxt-link :to="to">{{ name }}</nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      required: true,
      validator(value) {
        return ['light', 'dark', 'gradient'].includes(value)
      },
    },
    to: {
      type: [String, Object],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.explore {
  color: $accent;
  text-transform: uppercase;
  text-align: center;
  font-weight: $medium;
  font-size: 1rem;
  margin-bottom: 0.5rem;

  @media (min-width: $bp-desktop) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
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

  @media (min-width: $bp-desktop) {
    font-size: 6rem;
  }
}

.category-gradient {
  font-family: $font-display;
  text-transform: uppercase;
  font-weight: $extrabold;
  font-size: 4rem;
  line-height: 1;
  border-radius: 180px;
  position: relative;

  ::before {
    content: '';
    position: absolute;
    z-index: -1;
    height: 10rem;
    width: 10rem;
    left: calc(50% - 5rem);
    top: calc(50% - 5rem);
    background: radial-gradient(#c7cafe 0, #e5e4fe 35%, $white 70%);
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

  @media (min-width: $bp-desktop) {
    font-size: 5rem;
    ::before {
      height: 20rem;
      width: 20rem;
      left: calc(50% - 10rem);
      top: calc(50% - 10rem);
    }
  }
}
</style>
