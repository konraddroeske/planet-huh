<template>
  <div>{{ id }}</div>
</template>

<script>
export default {
  layout: 'post',
  data() {
    return {
      slug: this.$route.params.slug,
    }
  },
}
</script>

<style lang="scss" scoped></style>
