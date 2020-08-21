<template>
  <div class="categoryHero">
    <CategoryTitle
      :name="title"
      :disabled="disabled"
      :to="{ name: '' }"
      :variant="variant"
    />
  </div>
</template>

<script>
import CategoryTitle from '@/components/CategoryTitle.vue'

export default {
  components: {
    CategoryTitle,
  },
  props: {
    // variant: {
    //   type: String,
    //   required: true,
    //   validator(value) {
    //     return ['light', 'dark', 'gradient'].includes(value)
    //   },
    // },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      variant: 'gradient',
      disabled: true,
    }
  },
}
</script>

<style lang="scss" scoped>
.categoryHero {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
