<template>
  <div class="sandwichMenu">
    <input
      id="menuButton"
      class="visuallyHidden"
      type="checkbox"
      name="menuButton"
      @click="onClick"
    />
    <label for="menuButton">
      <span class="labelText visuallyHidden">View Menu</span>
      <span class="menuIcon" />
    </label>
  </div>
</template>

<script>
export default {
  methods: {
    onClick(event) {
      this.$emit("clicked")
    },
  },
}
</script>

<style lang="scss" scoped>
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
  background: none;
}

.menuIcon::before {
  width: 100%;
  bottom: 0.45rem;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  bottom: 0;
}

.menuIcon::after {
  width: 100%;
  top: 0.45rem;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  top: 0;
}
</style>
