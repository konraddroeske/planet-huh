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
  @apply list-none;
  @apply py-12;
  @apply flex;
  @apply justify-between;
}
.category {
  @apply uppercase;
  @apply font-extrabold;
  @apply text-6xl;
}
</style>
