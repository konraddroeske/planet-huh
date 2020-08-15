<template>
  <div class="container">
    <Wrapper>
      <img class="bannerImage" :src="imageSrc" alt="" />
      <h1 class="title">{{ title }}</h1>
      <p class="excerpt">{{ excerpt }}</p>

      <div class="dateContainer">
        <span class="dateTitle">Posted:</span>
        <span class="date"><Date :input="date" /></span>
      </div>

      <div class="categoriesContainer">
        <span class="categoriesTitle">Filed Under:</span>
        <ul class="categories">
          <li class="category">
            <span class="visuallyHidden">City: </span>{{ city }}
          </li>
          <li class="category">
            <span class="visuallyHidden">Sense: </span>{{ sense }}
          </li>
          <li class="category">
            <span class="visuallyHidden">Mood: </span>{{ mood }}
          </li>
        </ul>
      </div>
    </Wrapper>
  </div>
</template>

<script>
import Wrapper from '@/components/Wrapper'
import Date from '@/components/Date'
export default {
  components: { Wrapper, Date },
  props: {
    imageSrc: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    sense: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 5rem;
  text-align: center;
}

.bannerImage {
  display: block;
  width: 100%;
}

.title {
  text-transform: uppercase;
}

.excerpt,
.date,
.category {
  font-weight: $semibold;
}

.dateTitle,
.categoriesTitle {
  display: block;
  color: $accent;
  text-transform: uppercase;
  font-family: $font-sans;
  font-size: 0.75rem;
}

.categories {
  list-style: none;
  padding-left: 0;
  margin: 0;
  display: flex;

  li {
    text-transform: capitalize;
    margin-right: 1rem;
  }

  li:last-child {
    margin-right: 0;
  }
}
</style>
