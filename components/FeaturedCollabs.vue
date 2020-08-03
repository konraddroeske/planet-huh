<template>
  <div class="featuredCollabs">
    <div class="title">Featured Collabs</div>
    <div class="collabsContainer">
      <ul class="collabsList">
        <li class="collab"></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      featuredCollabPosts: (state) => state.homepage.featuredCollabPosts,
    }),
  },
  mounted() {
    console.log(this.featuredCollabPosts)
  },
}
</script>

<style lang="scss" scoped></style>
