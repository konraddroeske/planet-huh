<template>
  <div ref="container" :class="`category-${variant}`">
    <div v-if="variant === 'gradient'" class="explore">Explore</div>
    <nuxt-link ref="link" :to="to">{{ name }}</nuxt-link>
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
  mounted() {
    this.$refs.link.$el.addEventListener('mouseover', this.startGradient)
    this.$refs.link.$el.addEventListener('mouseout', this.endGradient)
    this.$refs.link.$el.addEventListener('focus', this.startGradient)
    this.$refs.link.$el.addEventListener('blur', this.endGradient)
  },
  beforeDestroy() {
    this.$refs.link.$el.removeEventListener('mouseover', this.startGradient)
    this.$refs.link.$el.removeEventListener('mouseout', this.endGradient)
    this.$refs.link.$el.removeEventListener('focus', this.startGradient)
    this.$refs.link.$el.removeEventListener('blur', this.endGradient)
  },
  methods: {
    startGradient() {
      this.$refs.container.classList.add('largeGradient')
    },
    endGradient() {
      this.$refs.container.classList.remove('largeGradient')
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
  position: relative;

  ::before {
    content: '';
    position: absolute;
    z-index: -1;
    height: 15rem;
    width: 15rem;
    left: calc(50% - 7.5rem);
    top: calc(50% - 7.5rem);
    border-radius: 180px;
    background-image: radial-gradient(
      circle,
      $accent 0,
      #a3b1ff 30%,
      #c7cafe 40%,
      #e5e4fe 50%,
      #ffffff 70%
    );
    opacity: 0.2;
    filter: blur(10px);
  }

  a,
  a:visited {
    color: $black;
    text-decoration: none;

    &:hover,
    &:focus {
      color: $white;
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

.largeGradient {
  .explore {
    color: $white;
  }

  ::before {
    opacity: 0.5;
    height: 25rem;
    width: 25rem;
    left: calc(50% - 12.5rem);
    top: calc(50% - 12.5rem);
  }

  @media (min-width: $bp-desktop) {
    ::before {
      height: 35rem;
      width: 35rem;
      left: calc(50% - 17.5rem);
      top: calc(50% - 17.5rem);
    }
  }
}
</style>
