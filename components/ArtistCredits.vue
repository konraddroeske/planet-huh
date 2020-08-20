<template>
  <section>
    <div v-for="artist in artists" :key="artist.name">
      <div>
        <h2 class="accentText">Who</h2>
        <p>{{ artist.name }}</p>
        <h2 class="accentText">Website</h2>
        <a href="">{{ artist.website }}</a>
        <h2 class="accentText">Social</h2>
        <p>{{ artist.social }}</p>
      </div>
      <div>
        <h2 class="accentText">About</h2>
        <p>{{ artist.about }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    artists: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
