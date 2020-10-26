<template>
  <div ref="container" :class="`category-${variant}`">
    <div v-if="variant === 'gradient'" class="explore">Explore</div>
    <nuxt-link
      ref="link"
      :to="{
        path: '/categories',
        query: { filters: [name.toLowerCase()] },
      }"
      event=""
      @click.native="navigate('/categories', { filters: [name.toLowerCase()] })"
      >{{ name }}</nuxt-link
    >
  </div>
</template>

<script>
import gsap from "gsap"
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
    navigate(destination, filters) {
      if (this.$route.fullPath.includes(this.name.toLowerCase())) {
        this.$emit("close-modal")
      } else if (this.$route.fullPath.includes("categories")) {
        const tl = gsap.timeline()

        tl.to(window, 0.3, {
          scrollTo: 0,
          onComplete: () => {
            this.$router.push({
              path: destination,
              query: filters,
            })
          },
        })
      } else {
        this.$router.push({
          path: destination,
          query: filters,
        })
      }
    },
    onMount() {
      this.$refs.link.$el.addEventListener("mouseover", this.startGradient)
      this.$refs.link.$el.addEventListener("mouseout", this.endGradient)
      this.$refs.link.$el.addEventListener("focus", this.startGradient)
      this.$refs.link.$el.addEventListener("blur", this.endGradient)
    },
    onDestroy() {
      this.$refs.container.classList.remove("largeGradient")

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

  transition: all 0.4s;

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

  transition: all 0.4s;

  a,
  a:visited {
    color: $white;
    text-decoration: none;

    transition: all 0.4s;

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

  transition: all 0.4s;

  a,
  a:visited {
    color: $black;
    text-decoration: none;

    transition: all 0.4s;

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
  font-size: 3rem;
  line-height: 1;
  position: relative;

  transition: all 0.4s;

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

    transition: all 0.4s;
  }

  a,
  a:visited {
    color: $black;
    text-decoration: none;
    transition: all 0.4s;

    &:hover,
    &:focus {
      color: $white;
    }
  }

  @media (min-width: $bp-tablet) {
    font-size: 4rem;
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
