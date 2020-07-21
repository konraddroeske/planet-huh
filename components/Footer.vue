<template>
  <footer class="bg-black">
    <div class="w-10/12 mx-auto text-white">
      <div class="flex justify-center">
        <span class="bg-white relative bottom-6 rounded-full p-1">
          <Logo />
        </span>
      </div>

      <CategoryNav />
      <div class="desktop:flex justify-between content-center py-12">
        <FooterNav />
        <SearchBar />
      </div>
    </div>
  </footer>
</template>

<script>
import Logo from './Logo'
import CategoryNav from './CategoryNav'
import FooterNav from './FooterNav'
import SearchBar from './SearchBar'
export default {
  components: { Logo, CategoryNav, FooterNav, SearchBar },
}
</script>

<style lang="scss" scoped></style>
