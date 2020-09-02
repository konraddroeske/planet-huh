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

    <section id="modalNav" ref="modalNav" v-scroll-lock="isOpen" class="modal">
      <CategoryNav variant="light" />
      <PageNav variant="light" />
      <div class="searchBarSocial">
        <SocialLinks variant="light" />
        <SearchBar variant="light" />
      </div>
    </section>
  </div>
</template>

<script>
import gsap from "gsap"
import CategoryNav from "./CategoryNav"
import PageNav from "./PageNav"
import SocialLinks from "./SocialLinks"
import SearchBar from "./SearchBar"
export default {
  components: { CategoryNav, PageNav, SocialLinks, SearchBar },
  data() {
    return {
      isOpen: false,
    }
  },
  watch: {
    $route(to, from) {
      if (this.isOpen) {
        setTimeout(() => {
          this.closeNav()
          document.getElementById("menuButton").checked = false
        }, 0.4)
      }
    },
  },
  methods: {
    toggleModal() {
      if (this.isOpen) {
        this.closeNav()
      } else {
        this.openNav()
      }
    },
    closeNav() {
      const blurrableContent = document.getElementById("blurrableContent")
      const modalNav = this.$refs.modalNav

      gsap.to(modalNav, 0.6, {
        autoAlpha: 0,
      })

      blurrableContent.classList.remove("blurContent")

      this.isOpen = !this.isOpen
    },
    openNav() {
      const blurrableContent = document.getElementById("blurrableContent")
      const modalNav = this.$refs.modalNav

      gsap.to(modalNav, 0.6, {
        autoAlpha: 1,
      })
      blurrableContent.classList.add("blurContent")

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
  visibility: hidden;

  @media (min-width: $bp-desktop) {
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    grid-template-areas: "empty1" "empty2" "categoryNav" "pageNav" "searchBarSocial";
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

label[for="menuButton"] {
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
  content: "";
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

.sandwichMenu input[type="checkbox"]:checked + label > .menuIcon {
  background: none;
}

.sandwichMenu input[type="checkbox"]:checked + label > .menuIcon::before {
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  bottom: 0;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}

.sandwichMenu input[type="checkbox"]:checked + label > .menuIcon::after {
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  top: 0;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}
</style>
