<template>
  <div :class="`container-${variant}`">
    <input
      :class="`searchInput-${variant}`"
      type="text"
      placeholder="Start typing..."
    />
    <button :class="`searchButton-${variant}`">
      Go!
    </button>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      required: true,
      validator(value) {
        return ['light', 'dark'].includes(value)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.container-dark {
  display: flex;
  flex-direction: column;

  @media (min-width: $bp-desktop) {
    display: block;
  }
}
.searchInput-dark {
  font-family: $font-display;
  font-size: 1.5rem;
  border-radius: 180px;
  border: 2px solid $white;
  background: transparent;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1.5rem;
  color: $white;

  &::placeholder {
    color: $gray;
  }

  @media (min-width: $bp-desktop) {
    margin-bottom: 0;
    margin-right: 0.5rem;
  }
}

.searchButton-dark {
  border: 0;
  cursor: pointer;
  border-radius: 180px;
  text-transform: uppercase;
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  background: $white;
  color: $black;
  padding: 1.25rem 1rem;
  font-size: 1.25rem;
  font-weight: $extrabold;

  &:hover,
  &:focus {
    background: $accent;
    color: $white;
  }
}

.container-light {
  display: flex;
  justify-content: center;

  @media (min-width: $bp-desktop) {
    display: block;
    flex: 1 1 auto;
  }
}
.searchInput-light {
  font-family: $font-display;
  font-size: 1rem;
  border-radius: 180px;
  border: 2px solid $black;
  background: transparent;
  padding: 0.75rem 1.25rem;
  margin-right: 0.5rem;
  color: $black;

  &::placeholder {
    color: $black;
  }

  @media (min-width: $bp-desktop) {
    margin-bottom: 0;
    margin-right: 0.5rem;
  }
}

.searchButton-light {
  cursor: pointer;
  border-radius: 180px;
  border: 2px solid $black;
  text-transform: uppercase;
  display: inline-block;
  background: $white;
  color: $black;
  padding: 0.75rem 0.5rem;
  font-size: 1rem;
  font-weight: $extrabold;

  &:hover,
  &:focus {
    background: $accent;
    color: $white;
  }
}
</style>
