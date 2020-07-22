<template>
  <div>
    <div class="sandwichMenu relative z-fixed">
      <input
        id="menuButton"
        class="visuallyHidden"
        type="checkbox"
        name="menuButton"
        @click="isOpen = !isOpen"
      />
      <label for="menuButton">
        <span class="labelText visuallyHidden">View Menu</span>
        <span class="menuIcon" />
      </label>
    </div>

    <section class="modal" :class="{ visuallyHidden: !isOpen }">
      <CategoryNav />
      <FooterNav />
      <Social />
      <SearchBar />
    </section>
  </div>
</template>

<script>
import CategoryNav from './CategoryNav'
import FooterNav from './FooterNav'
import Social from './Social'
import SearchBar from './SearchBar'
export default {
  components: { CategoryNav, FooterNav, Social, SearchBar },
  data() {
    return {
      isOpen: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 10%;
  @apply bg-white;
  @apply z-modal;
}

// Styles for sandwich menu icon
#menuButton,
.labelText {
  position: absolute;
  opacity: 0;
}

label[for='menuButton'] {
  display: block;
  height: 2rem;
  width: 3.5rem;
  position: relative;
  float: right;
  cursor: pointer;
}

.menuIcon,
.menuIcon::before,
.menuIcon::after {
  content: '';
  display: block;
  height: 0.1rem;
  background: black;
  position: absolute;
}

.menuIcon {
  width: 60%;
  top: 0.92rem;
  left: 0.4rem;
}

.menuIcon::before {
  width: 100%;
  bottom: 0.4rem;
}

.menuIcon::after {
  width: 100%;
  top: 0.4rem;
}

.sandwichMenu input[type='checkbox']:checked + label > .menuIcon {
  background: none;
}

.sandwichMenu input[type='checkbox']:checked + label > .menuIcon::before {
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  bottom: 0;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}

.sandwichMenu input[type='checkbox']:checked + label > .menuIcon::after {
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  top: 0;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}

// .sandwichMenu input[type='checkbox']:focus + label {
//   -webkit-box-shadow: 0 0 0 0.12rem black;
//   box-shadow: 0 0 0 0.12rem black;
// }
</style>
