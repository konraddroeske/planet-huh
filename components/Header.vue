<template>
  <header
    class="fixed z-fixed w-screen py-6 px-8 flex justify-between items-center"
  >
    <Logo />
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

<style lang="scss" scoped></style>
