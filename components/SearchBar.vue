<template>
  <div class="flex flex-col desktop:block">
    <input
      class="placeholder rounded-full border-white border-2 bg-transparent py-2 px-4 text-2xl mb-6 desktop:mb-0 desktop:mr-2"
      type="text"
      placeholder="Start typing..."
    />
    <button
      class="rounded-full bg-white text-black p-3 text-xl font-extrabold uppercase inline-block mx-auto desktop:mt-4"
    >
      Go!
    </button>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.placeholder {
  &::placeholder {
    color: #707070;
  }
}
</style>
