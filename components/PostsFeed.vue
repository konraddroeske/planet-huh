<template>
  <section>
    <ul>
      <li v-for="post in posts" :key="post.title">{{ post.title }}</li>
    </ul>
    <Button :on-click="getSomePosts">Load More</Button>
  </section>
</template>

<script>
import Button from '@/components/Button'
export default {
  components: { Button },
  props: {
    posts: {
      type: Array,
      required: true,
    },
    getSomePosts: {
      type: Function,
      required: true,
    },
  },
  created() {
    this.$props.getSomePosts()
  },
}
</script>

<style lang="scss" scoped></style>
