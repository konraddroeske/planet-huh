<template>
  <div class="container">
    <input class="searchInput" type="text" placeholder="Start typing..." />
    <button class="searchButton">
      Go!
    </button>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;

  @media (min-width: $bp-desktop) {
    display: block;
  }
}
.searchInput {
  font-size: 1.5rem;
  border-radius: 180px;
  border: 2px solid $white;
  background: transparent;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;

  &::placeholder {
    color: #707070;
  }

  @media (min-width: $bp-desktop) {
    margin-bottom: 0;
    margin-right: 0.5rem;
  }
}

.searchButton {
  border: 0;
  cursor: pointer;
  border-radius: 180px;
  text-transform: uppercase;
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  background: $white;
  color: $black;
  padding: 0.75rem;
  font-size: 1.25rem;
  font-weight: $extrabold;

  &:hover,
  &:focus {
    background: $accent;
    color: $white;
  }
}
</style>
