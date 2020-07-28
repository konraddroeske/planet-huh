<template>
  <nav>
    <ul class="categoryList">
      <li class="category">
        <nuxt-link :to="{ name: 'cities' }">Cities</nuxt-link>
      </li>
      <li class="category">
        <nuxt-link :to="{ name: 'senses' }">Senses</nuxt-link>
      </li>
      <li class="category">
        <nuxt-link :to="{ name: 'moods' }">Moods</nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.categoryList {
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

.category {
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
</style>
