<template>
  <div>
    <input class="searchInput" type="text" placeholder="Start typing..." />
    <button class="searchButton">Go!</button>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.searchInput {
  @apply rounded-full;
  @apply border-white;
  @apply border-2;
  @apply bg-transparent;
  @apply py-2;
  @apply px-4;
  @apply text-2xl;
  @apply mr-2;
  &::placeholder {
    color: #555;
  }
}
.searchButton {
  @apply rounded-full;
  @apply bg-white;
  @apply text-black;
  @apply p-3;
  @apply text-xl;
  @apply uppercase;
}
</style>
