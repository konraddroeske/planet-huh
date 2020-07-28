<template>
  <ul class="socialList">
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
export default {}
</script>

<style lang="scss" scoped>
.socialList {
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
</style>
