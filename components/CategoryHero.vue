<template>
  <div class="categoryHero">
    <Category
      :name="title"
      :disabled="disabled"
      :to="{ name: '' }"
      :variant="variant"
    />
  </div>
</template>

<script>
import Category from '@/components/Category.vue'

export default {
  components: {
    Category,
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
