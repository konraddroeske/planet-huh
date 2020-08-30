<template>
  <nav>
    <ul :class="`navList-${variant}`">
      <li :class="`navItem-${variant}`">Sign In</li>
      <li :class="`navItem-${variant}`">About</li>
      <li :class="`navItem-${variant}`">Submit</li>
      <li :class="`navItem-${variant}`">Contact</li>
      <li :class="`navItem-${variant}`">FAQ</li>
      <li :class="`navItem-${variant}`">Legal</li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      required: true,
      validator(value) {
        return ["light", "dark"].includes(value)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
nav {
  font-weight: $semibold;
  @media (min-width: $bp-desktop) {
    grid-area: pageNav;
    align-self: center;
  }
}

.navList-dark {
  list-style: none;
  padding-left: 0;
  text-align: center;
  margin-bottom: 5rem;

  @media (min-width: $bp-desktop) {
    text-align: left;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 6rem;
    margin-bottom: 0;
  }
}

.navItem-dark {
  font-size: 1.5rem;
}

.navList-light {
  list-style: none;
  padding-left: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: center;

  @media (min-width: $bp-desktop) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 50%;
    margin: 0 auto;
  }
}

.navItem-light {
  font-size: 1rem;

  @media (min-width: $bp-desktop) {
    font-size: 1.25rem;
  }
}
</style>
