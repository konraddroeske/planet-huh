<template>
  <div class="container">
    <div class="wrapper">
      <div class="heroRow">
        <img class="bannerImage" :src="imageSrc" alt="" />
        <div class="bannerText">
          <h1 class="title">{{ title }}</h1>
          <p class="excerpt">{{ excerpt }}</p>
        </div>
      </div>

      <div class="metaRow">
        <div class="dateContainer">
          <span class="accentText dateTitle">Posted:</span>
          <span class="date"><Date :input="date" /></span>
        </div>

        <div class="categoriesContainer">
          <span class="accentText categoriesTitle">Filed Under:</span>
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
      </div>
    </div>
  </div>
</template>

<script>
import Date from '@/components/Date'
export default {
  components: { Date },
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

  @media (min-width: $bp-desktop) {
    margin-top: 0;
    margin-bottom: 0;
    text-align: left;
  }
}

.wrapper {
  width: 85%;
  margin: 0 auto;

  @media (min-width: $bp-desktop) {
    width: 100%;
    margin: 0;
  }
}

.heroRow {
  @media (min-width: $bp-desktop) {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    position: relative;
  }
}

.bannerImage {
  display: block;
  width: 100%;
  @media (min-width: $bp-desktop) {
    width: 50%;
  }
}

.bannerText {
  @media (min-width: $bp-desktop) {
    width: 50%;
    padding-left: 2rem;
    padding-right: 5%;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
}

.title {
  text-transform: uppercase;
  font-weight: $extrabold;
  font-size: 2.25rem;
  @media (min-width: $bp-desktop) {
    font-size: 3.5rem;
    width: 75%;
    margin-bottom: 1rem;
  }
}

.excerpt {
  font-weight: $semibold;
  font-size: 1.1rem;
  margin-bottom: 0;
  @media (min-width: $bp-desktop) {
    font-size: 1.5rem;
  }
}

.metaRow {
  @media (min-width: $bp-desktop) {
    display: flex;
    width: calc(100% - 4rem);
    margin: 2rem 2rem 0 2rem;
  }
}

.dateContainer {
  @media (min-width: $bp-desktop) {
    width: 50%;
  }
}

.categoriesContainer {
  @media (min-width: $bp-desktop) {
    width: 50%;
    display: flex;
  }
}

.dateTitle,
.categoriesTitle {
  display: block;
  margin-top: 2rem;

  @media (min-width: $bp-desktop) {
    display: inline-block;
    margin-top: 0;
  }
}

.categoriesTitle {
  @media (min-width: $bp-desktop) {
    margin-right: 0.25rem;
  }
}

.date,
.category {
  font-weight: $semibold;
  font-size: 1.1rem;
  @media (min-width: $bp-desktop) {
    font-size: 1.25rem;
  }
}

.categories {
  list-style: none;
  padding-left: 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

.category {
  text-transform: capitalize;
  margin-right: 1rem;
  position: relative;

  &::before {
    content: '•';
    position: absolute;
    right: -0.75rem;
    top: 0;
  }

  @media (min-width: $bp-desktop) {
    margin-right: 1.5rem;

    &::before {
      content: '•';
      position: absolute;
      right: -1rem;
      top: 0;
    }
  }
}

.category:last-child {
  margin-right: 0;
  &::before {
    content: '';
  }
}
</style>
