<template>
  <footer class="bg-black">
    <div class="w-10/12 mx-auto text-white">
      <div class="flex justify-center">
        <span class="bg-white relative bottom-6 rounded-full p-1">
          <Logo />
        </span>
      </div>

      <CategoryNav />

      <div
        class="desktop:flex justify-between items-center mt-20 desktop:mt-0 mb-20"
      >
        <FooterNav />
        <SearchBar />
      </div>

      <div
        class="flex flex-col desktop:flex-row justify-center desktop:justify-between items-center pb-12"
      >
        <Social />
        <span class="text-xl block mt-20 desktop:mt-0"
          >A Project by SOMEWHERELSE</span
        >
      </div>
    </div>
  </footer>
</template>

<script>
import Logo from './Logo'
import CategoryNav from './CategoryNav'
import FooterNav from './FooterNav'
import SearchBar from './SearchBar'
import Social from './Social'
export default {
  components: { Logo, CategoryNav, FooterNav, SearchBar, Social },
}
</script>

<style lang="scss" scoped></style>
