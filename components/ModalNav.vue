<template>
  <div class="modalNav">
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

    <section
      id="modalNav"
      ref="modalNav"
      v-scroll-lock="isOpen"
      class="modal backdrop-blur"
    >
      <CategoryNav variant="light" @close-modal="toggleModal" />
      <PageNav variant="light" />
      <div class="searchBarSocial">
        <SocialLinks variant="light" />
        <SearchBar variant="light" @onSubmit="routeModal" />
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
import categoryRouteReset from "~/mixins/categoryRouteReset"

export default {
  components: { CategoryNav, PageNav, SocialLinks, SearchBar },
  mixins: [categoryRouteReset],
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
      const modalNav = this.$refs.modalNav

      gsap.to(modalNav, 0.6, {
        autoAlpha: 0,
      })

      this.isOpen = !this.isOpen

      document.getElementById("menuButton").checked = false
    },
    openNav() {
      const modalNav = this.$refs.modalNav

      gsap.to(modalNav, 0.6, {
        autoAlpha: 1,
      })

      this.isOpen = !this.isOpen
    },
    routeModal(filter) {
      this.routeFilter(filter)
      this.toggleModal()
    },
  },
}
</script>

<style lang="scss" scoped>
.modalNav {
  pointer-events: auto;
}

.modal {
  position: fixed;
  z-index: $z-modal;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
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

@media (pointer: none), (pointer: coarse) {
  label[for="menuButton"] {
    &:hover {
      .menuIcon,
      .menuIcon::before,
      .menuIcon::after {
        background: $black;
      }
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
  background-color: $accent;
}

.sandwichMenu input[type="checkbox"]:checked + label > .menuIcon::after {
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  top: 0;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
  background-color: $accent;
}
</style>
