<template>
  <header>
    <div class="logoContainer">
      <Logo />
    </div>
    <ModalNav />
  </header>
</template>

<script>
import Logo from './Logo'
import ModalNav from './ModalNav'
export default {
  components: { Logo, ModalNav },
}
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  z-index: $z-fixed;
  top: 0;
  right: 0;
  left: 0;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: $bp-desktop) {
    padding: 1.5rem 2rem;
  }
}

.logoContainer {
  position: relative;
  z-index: $z-fixed;
}
</style>
