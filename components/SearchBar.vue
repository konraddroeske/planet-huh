<template>
  <form :class="`container-${variant}`" @submit.prevent="onSubmit">
    <input
      v-model="input"
      :class="`searchInput-${variant}`"
      type="text"
      placeholder="Start typing..."
    />
    <button type="submit" :class="`searchButton-${variant}`">Go!</button>
  </form>
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
  data() {
    return {
      input: null,
    }
  },
  methods: {
    onSubmit() {
      this.$fb.track("Search", {
        value: this.input.toLowerCase(),
      })

      this.$emit("onSubmit", this.input.toLowerCase())
      this.input = null
    },
  },
}
</script>

<style lang="scss" scoped>
.container-dark {
  display: flex;
  flex-direction: column;

  @media (min-width: $bp-desktop) {
    flex-direction: row;
    justify-content: flex-end;
    width: 50%;
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
    margin-right: 1rem;
    width: 3.15rem;
    max-width: 28.15rem;
    flex: 1 0 auto;
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

  @media (min-width: $bp-desktop) {
    margin-left: 0;
    margin-right: 0;
  }
}

.container-light {
  display: flex;
  justify-content: center;

  @media (min-width: $bp-desktop) {
    display: flex;
    justify-content: space-between;
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
  flex-grow: 1;

  &::placeholder {
    color: $black;
  }

  @media (min-width: $bp-desktop) {
    width: 22rem;
  }
}

.searchButton-light {
  cursor: pointer;
  border-radius: 180px;
  border: 2px solid $black;
  text-transform: uppercase;
  display: inline-block;
  background: transparent;
  color: $black;
  padding: 0.75rem 0.5rem;
  font-size: 1rem;
  font-weight: $extrabold;

  &:hover,
  &:focus {
    background: $black;
    color: $white;
  }
}
</style>
