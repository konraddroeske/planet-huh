<template>
  <footer>
    <div class="wrapper">
      <div class="logoContainer">
        <span class="logoSpan">
          <Logo />
        </span>
      </div>

      <CategoryNav variant="dark" />

      <div class="secondRow">
        <FooterNav />
        <SearchBar />
      </div>

      <div class="thirdRow">
        <Social />
        <span class="credit">A Project by SOMEWHERELSE</span>
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

<style lang="scss" scoped>
footer {
  background: $black;
}

.wrapper {
  width: 80%;
  margin: 0 auto;
  color: $white;
}

.logoContainer {
  display: flex;
  justify-content: center;
}

.logoSpan {
  background: $white;
  position: relative;
  bottom: 1.5rem;
  border-radius: 180px;
  padding: 0.25rem;
}

.secondRow {
  margin-top: 5rem;
  margin-bottom: 5rem;

  @media (min-width: $bp-desktop) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0;
  }
}

.thirdRow {
  padding-bottom: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (min-width: $bp-desktop) {
    flex-direction: row;
    justify-content: space-between;
  }
}

.credit {
  font-size: 1.25rem;
  text-align: center;
  display: block;
  margin-top: 5rem;

  @media (min-width: $bp-desktop) {
    margin-top: 0;
  }
}
</style>
