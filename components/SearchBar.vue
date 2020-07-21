<template>
  <div class="flex flex-col desktop:block">
    <input
      class="searchInput border-white border-2 py-2 px-4 text-2xl mb-6 desktop:mb-0 desktop:mr-2"
      type="text"
      placeholder="Start typing..."
    />
    <button class="searchButton bg-white text-black p-3 text-xl font-extrabold">
      Go!
    </button>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.searchInput {
  border-radius: 180px;
  background: transparent;
  &::placeholder {
    color: #707070;
  }
}

.searchButton {
  border-radius: 180px;
  text-transform: uppercase;
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
}
</style>
