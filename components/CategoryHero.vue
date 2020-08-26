<template>
  <div class="categoryHero">
    <CategoryTitle
      :name="title"
      :disabled="disabled"
      :to="{ name: '' }"
      :variant="variant"
    />
    <div class="buttonContainer">
      <ButtonFilter @onClick="toggleMenu">
        Filter Posts
      </ButtonFilter>
    </div>
  </div>
</template>

<script>
import CategoryTitle from '@/components/CategoryTitle'
import ButtonFilter from '@/components/ButtonFilter'

export default {
  components: {
    CategoryTitle,
    ButtonFilter,
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
  methods: {
    toggleMenu() {},
  },
}
</script>

<style lang="scss" scoped>
.categoryHero {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.buttonContainer {
  position: absolute;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
}
</style>
