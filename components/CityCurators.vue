<template>
  <section class="curators">
    <Wrapper>
      <h2 class="sectionTitle">
        {{ artists.length > 1 ? "City Curators" : "City Curator" }}
      </h2>
      <ul class="curatorsList">
        <li v-for="artist of artists" :key="artist.id">
          <CityCurator :artist="artist" />
        </li>
      </ul>
    </Wrapper>
  </section>
</template>

<script>
import CityCurator from "@/components/CityCurator"
import Wrapper from "@/components/Wrapper"
export default {
  components: {
    CityCurator,
    Wrapper,
  },
  props: {
    artists: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
  display: grid;
  grid-auto-rows: 1fr;
  grid-row-gap: 3rem;
}

li {
  width: 100%;
  border: 1px solid $black;

  &:hover {
    border: 1px solid $accent;
  }
}

@media (min-width: $bp-tablet) {
  .curatorsList {
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 3%;
  }
}
</style>
