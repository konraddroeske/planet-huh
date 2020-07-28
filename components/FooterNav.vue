<template>
  <nav>
    <ul class="navList">
      <li class="navItem">Sign In</li>
      <li class="navItem">About</li>
      <li class="navItem">Submit</li>
      <li class="navItem">Contact</li>
      <li class="navItem">FAQ</li>
      <li class="navItem">Legal</li>
    </ul>
  </nav>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.navList {
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

.navItem {
  font-size: 1.5rem;
}
</style>
