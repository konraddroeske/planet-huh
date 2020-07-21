<template>
  <ul class="socialList text-3xl">
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
  display: flex;

  li:not(:last-child) {
    @apply mr-8;
  }
}
</style>
