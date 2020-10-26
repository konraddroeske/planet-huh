<template>
  <div class="categoryHero">
    <CategoryTitle
      :name="title"
      :disabled="true"
      :to="{ name: '' }"
      :variant="variant"
    />
    <div class="buttonContainer">
      <ButtonFilter @clicked="toggleModal">
        Filter Posts
      </ButtonFilter>
    </div>
  </div>
</template>

<script>
import CategoryTitle from "@/components/CategoryTitle"
import ButtonFilter from "@/components/ButtonFilter"

export default {
  components: {
    CategoryTitle,
    ButtonFilter,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      variant: "gradient",
      disabled: true,
    }
  },
  methods: {
    toggleModal() {
      this.$store.state.categories.modal
        ? this.closeModal()
        : this.$store.commit("categories/setModal", true)
    },
    closeModal() {
      this.$nuxt.$emit("close-modal")
    },
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
  overflow-x: hidden;
}

.buttonContainer {
  position: absolute;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
}

@media (pointer: none), (pointer: coarse) {
  .buttonContainer {
    bottom: 6.5rem;
  }
}

@media (min-width: $bp-tablet) {
  .buttonContainer {
    left: 1rem;
    bottom: 3rem;
    transform: translateX(0);
  }
}

@media (min-width: $bp-desktop) {
  .buttonContainer {
    left: 2rem;
  }
}
</style>
