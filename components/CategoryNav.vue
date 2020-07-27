<template>
  <nav>
    <ul
      class="list-none my-8 desktop:my-20 desktop:flex justify-between text-center"
    >
      <li class="category mb-4">
        <nuxt-link :to="{ name: 'cities' }">Cities</nuxt-link>
      </li>
      <li class="category mb-4">
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
.category {
  @apply uppercase;
  @apply font-extrabold;
  @apply text-6xl;
  @apply leading-none;
}
</style>
