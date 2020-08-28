<template>
  <div ref="container" :class="`category-${variant}`">
    <div v-if="variant === 'gradient'" class="explore">Explore</div>
    <nuxt-link
      ref="link"
      :to="{
        path: 'categories',
        query: { filters: [name.toLowerCase()] },
      }"
      >{{ name }}</nuxt-link
    >
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      required: true,
      validator(value) {
        return ["light", "dark", "gradient"].includes(value)
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
  // mounted() {
  //   this.onMount()
  // },
  // beforeDestroy() {
  //   this.onDestroy()
  // },
  activated() {
    this.onMount()
  },
  deactivated() {
    this.onDestroy()
  },
  methods: {
    startGradient() {
      this.$refs.container.classList.add("largeGradient")
    },
    endGradient() {
      this.$refs.container.classList.remove("largeGradient")
    },
    navigate() {
      console.log("navigating programmatically")
    },
    onMount() {
      this.$refs.link.$el.addEventListener("mouseover", this.startGradient)
      this.$refs.link.$el.addEventListener("mouseout", this.endGradient)
      this.$refs.link.$el.addEventListener("focus", this.startGradient)
      this.$refs.link.$el.addEventListener("blur", this.endGradient)
    },
    onDestroy() {
      this.$refs.link.$el.removeEventListener("mouseover", this.startGradient)
      this.$refs.link.$el.removeEventListener("mouseout", this.endGradient)
      this.$refs.link.$el.removeEventListener("focus", this.startGradient)
      this.$refs.link.$el.removeEventListener("blur", this.endGradient)
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
    font-size: 5rem;
  }

  @media (min-width: $bp-lg-desktop) {
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
    content: "";
    position: absolute;
    z-index: -1;
    height: 2.5rem;
    width: 2.5rem;
    left: calc(50% - 1.25rem);
    top: calc(50% - 1.25rem);
    border-radius: 180px;
    background: $accent;
    box-shadow: 0 0 5rem 2rem $accent;
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
      box-shadow: 0 0 5rem 5rem $accent;
    }
  }
}

.largeGradient {
  .explore {
    color: $white;
  }

  ::before {
    opacity: 0.5;
    box-shadow: 0 0 5rem 6rem $accent;
  }

  @media (min-width: $bp-desktop) {
    ::before {
      box-shadow: 0 0 5rem 8rem $accent;
    }
  }
}
</style>
