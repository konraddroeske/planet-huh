<template>
  <div>{{ id }}</div>
</template>

<script>
export default {
  layout: 'post',
  data() {
    return {
      id: this.$route.params.postId,
    }
  },
}
</script>

<style lang="scss" scoped></style>
