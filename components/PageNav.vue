<template>
  <nav>
    <ul :class="`navList-${variant}`">
      <li v-for="slug in slugs" :key="slug.slug" :class="`navItem-${variant}`">
        <nuxt-link :to="`/${slug.slug}`">
          {{ slug.shortTitle }}
        </nuxt-link>
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
        return ["light", "dark"].includes(value)
      },
    },
  },
  data() {
    return {
      extraSlugs: [
        {
          shortTitle: "Contact",
          slug: "contact",
        },
        {
          shortTitle: "Submit Mood",
          slug: "submit-mood",
        },
      ],
    }
  },
  computed: {
    slugs() {
      return [...this.$store.state.static.slugs, ...this.extraSlugs].sort(
        (a, b) => {
          const textA = a.shortTitle.toLowerCase()
          const textB = b.shortTitle.toLowerCase()

          return textA.localeCompare(textB)
        }
      )
    },
  },
  async mounted() {
    if (this.$store.state.static.slugs.length === 0) {
      await this.$store.dispatch("static/getStaticSlugs")
    }
  },
}
</script>

<style lang="scss" scoped>
nav {
  font-weight: $semibold;
  @media (min-width: $bp-desktop) {
    grid-area: pageNav;
    align-self: center;
  }
}

.navList-dark {
  list-style: none;
  padding-left: 0;
  text-align: center;
  margin-bottom: 5rem;

  @media (min-width: $bp-desktop) {
    text-align: left;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 6rem;
    margin-bottom: 0;
  }
}

.navItem-dark {
  font-size: 1.5rem;

  a,
  a:visited {
    color: $white;
    text-decoration: none;

    &:focus,
    &:hover {
      color: $accent;
    }
  }
}

.navList-light {
  list-style: none;
  padding-left: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: center;

  @media (min-width: $bp-desktop) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 50%;
    margin: 0 auto;
  }
}

.navItem-light {
  font-size: 1rem;

  @media (min-width: $bp-desktop) {
    font-size: 1.25rem;
  }

  a,
  a:visited {
    color: $black;
    text-decoration: none;

    &:focus,
    &:hover {
      color: $accent;
    }
  }
}
</style>
