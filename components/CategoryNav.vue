<template>
  <nav>
    <div class="explore" :class="{ visuallyHidden: variant !== 'light' }">
      Explore
    </div>

    <ul :class="`categoryList-${variant}`">
      <li>
        <Category
          :name="'Cities'"
          :to="{ name: 'cities' }"
          :variant="variant"
        />
      </li>
      <li>
        <Category
          :name="'Senses'"
          :to="{ name: 'senses' }"
          :variant="variant"
        />
      </li>
      <li>
        <Category :name="'Moods'" :to="{ name: 'moods' }" :variant="variant" />
      </li>
    </ul>
  </nav>
</template>

<script>
import Category from './Category'
export default {
  components: { Category },
  props: {
    variant: {
      type: String,
      required: true,
      validator(value) {
        return ['light', 'dark', 'gradient'].includes(value)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
nav {
  margin-top: 5rem;

  @media (min-width: $bp-desktop) {
    margin-top: 0;
    grid-area: categoryNav;
  }
}

.explore {
  color: $accent;
  text-transform: uppercase;
  text-align: center;
  font-weight: $medium;

  @media (min-width: $bp-desktop) {
    font-size: 1.5rem;
  }
}

.categoryList-dark {
  list-style: none;
  padding-left: 0;
  margin: 2rem 0;
  text-align: center;

  li:not(:last-child) {
    margin-bottom: 1rem;
  }

  @media (min-width: $bp-desktop) {
    margin: 5rem 0;
    display: flex;
    justify-content: space-between;
  }
}

.categoryList-light {
  list-style: none;
  padding-left: 0;
  margin: 1rem 0 2rem;
  text-align: center;

  @media (min-width: $bp-desktop) {
    display: flex;
    justify-content: space-around;
  }
}

.categoryList-gradient {
  list-style: none;
  padding-left: 0;
  margin: 5rem 0;
  text-align: center;

  li:not(:last-child) {
    margin-bottom: 5rem;
  }

  @media (min-width: $bp-desktop) {
    margin: 15rem 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    li:not(:last-child) {
      margin-bottom: 0;
    }
  }
}
</style>
