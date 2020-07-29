<template>
  <ul :class="`socialList-${variant}`">
    <li>
      <a href="https://facebook.com">
        <FontAwesomeIcon :icon="['fab', 'facebook-f']" />
        <span class="visuallyHidden">Facebook</span>
      </a>
    </li>
    <li>
      <a href="https://twitter.com">
        <FontAwesomeIcon :icon="['fab', 'twitter']" />
        <span class="visuallyHidden">Twitter</span>
      </a>
    </li>
    <li>
      <a href="https://instagram.com">
        <FontAwesomeIcon :icon="['fab', 'instagram']" />
        <span class="visuallyHidden">Instagram</span>
      </a>
    </li>
  </ul>
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
.socialList-dark {
  list-style: none;
  padding-left: 0;
  font-size: 1.875rem;
  display: flex;

  li:not(:last-child) {
    margin-right: 2rem;
  }

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

.socialList-light {
  list-style: none;
  padding-left: 0;
  font-size: 1.875rem;
  display: flex;
  justify-content: center;
  margin: 2rem 0;

  li:not(:last-child) {
    margin-right: 2rem;
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
    margin: 0;
  }
}
</style>
