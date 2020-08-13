<template>
  <div>
    <div class="sandwichMenu">
      <input
        id="menuButton"
        class="visuallyHidden"
        type="checkbox"
        name="menuButton"
        @click="toggleModal"
      />
      <label for="menuButton">
        <span class="labelText visuallyHidden">View Menu</span>
        <span class="menuIcon" />
      </label>
    </div>

    <section class="modal" :class="{ visuallyHidden: !isOpen }">
      <CategoryNav variant="light" />
      <PageNav variant="light" />
      <div class="searchBarSocial">
        <Social variant="light" />
        <SearchBar variant="light" />
      </div>
    </section>
  </div>
</template>

<script>
import CategoryNav from './CategoryNav'
import PageNav from './PageNav'
import Social from './Social'
import SearchBar from './SearchBar'
export default {
  components: { CategoryNav, PageNav, Social, SearchBar },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    toggleModal() {
      const blurrableContent = document.getElementById('blurrableContent')
      if (this.isOpen) {
        blurrableContent.classList.remove('blurContent')
        document.body.classList.remove('lockScroll')
      } else {
        blurrableContent.classList.add('blurContent')
        document.body.classList.add('lockScroll')
      }
      this.isOpen = !this.isOpen
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  z-index: $z-modal;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.3);

  @media (min-width: $bp-desktop) {
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    grid-template-areas: 'empty1' 'empty2' 'categoryNav' 'pageNav' 'searchBarSocial';
  }
}

.searchBarSocial {
  @media (min-width: $bp-desktop) {
    grid-area: searchBarSocial;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: flex-end;
  }
}

// Styles for sandwich menu icon
.sandwichMenu {
  position: relative;
  z-index: $z-fixed;
  left: 0.75rem;
}

#menuButton,
.labelText {
  position: absolute;
  opacity: 0;
}

label[for='menuButton'] {
  display: block;
  height: 2rem;
  width: 4rem;
  position: relative;
  float: right;
  cursor: pointer;

  &:hover {
    .menuIcon,
    .menuIcon::before,
    .menuIcon::after {
      background: $accent;
    }
  }
}

.menuIcon,
.menuIcon::before,
.menuIcon::after {
  content: '';
  display: block;
  height: 0.125rem;
  background: $black;
  position: absolute;
}

.menuIcon {
  width: 60%;
  top: 0.92rem;
  left: 0.4rem;
}

.menuIcon::before {
  width: 100%;
  bottom: 0.45rem;
}

.menuIcon::after {
  width: 100%;
  top: 0.45rem;
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
</style>
