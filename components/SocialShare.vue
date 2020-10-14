<template>
  <div class="container">
    <h2 class="accentText title">Share:</h2>
    <ul class="socialList">
      <li>
        <a
          :href="`https://www.facebook.com/sharer/sharer.php?u=${link}`"
          target="_blank"
          rel="canonical noopener noreferrer"
        >
          <FontAwesomeIcon :icon="['fab', 'facebook-f']" />
          <span class="visuallyHidden">Facebook</span>
        </a>
      </li>
      <li>
        <a
          :href="`https://twitter.com/intent/tweet?via=somewherelse&text=${title}&url=${link}`"
          target="_blank"
          rel="canonical noopener noreferrer"
        >
          <FontAwesomeIcon :icon="['fab', 'twitter']" />
          <span class="visuallyHidden">Twitter</span>
        </a>
      </li>
      <li>
        <a
          :href="`mailto:?subject=${title}&body=${link}`"
          target="_blank"
          rel="canonical noopener noreferrer"
        >
          <FontAwesomeIcon :icon="['fas', 'envelope']" />
          <span class="visuallyHidden">Email</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin: 2rem 0;

  @media (min-width: $bp-desktop) {
    margin: 4rem 0;
  }
}
.title {
  text-align: center;
  margin: 0;
}

.socialList {
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 0.5rem;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;

  li:not(:last-child) {
    margin-right: 1rem;
  }

  a,
  a:visited {
    color: $black;
    text-decoration: none;

    &:hover,
    &:focus {
      color: $accent;
    }
  }

  @media (min-width: $bp-desktop) {
    font-size: 1.7rem;
    margin-bottom: 2rem;
  }
}
</style>
