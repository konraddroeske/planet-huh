<template>
  <div>
    <div class="wrapper">
      <template v-for="(item, index) of organizedContent">
        <p v-if="item.type === 'paragraph'" :key="index">
          {{ item.text }}
        </p>
        <div
          v-if="item.type === 'image'"
          :key="index"
          class="fullImageContainer"
        >
          <img :src="item.src" alt="" />
          <div class="caption">{{ item.caption }}</div>
        </div>
        <blockquote v-if="item.type === 'block-quote'" :key="index">
          <q>{{ item.text }}</q>
          <div class="source">— {{ item.source }}</div>
        </blockquote>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Array,
      required: true,
    },
  },
  computed: {
    organizedContent() {
      return this.$props.content
        .filter((item) =>
          ['paragraph', 'image', 'block-quote'].includes(item.type)
        )
        .map((item) => {
          if (item.type === 'paragraph') {
            return {
              type: item.type,
              text: item.children[0].text,
            }
          }
          if (item.type === 'image') {
            return {
              type: item.type,
              src: item.src,
              caption: item.altText,
            }
          }
          if (item.type === 'block-quote') {
            const [text, source] = item.children[0].text.split('@')
            return {
              type: item.type,
              text: text.trim(),
              source: source.trim(),
            }
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 85%;
  margin: 5rem auto;

  @media (min-width: $bp-desktop) {
    width: 70%;
  }
}

p {
  font-family: $font-body;
  font-size: 1.1rem;

  @media (min-width: $bp-desktop) {
    font-size: 1.25rem;
  }
}

.fullImageContainer {
  img {
    width: 100%;
    display: block;
  }

  .caption {
    color: $accent;
    text-transform: uppercase;
    font-family: $font-sans;
    font-size: 0.8rem;
    font-weight: $semibold;
    letter-spacing: 1px;
    margin: 0.5rem 0;

    @media (min-width: $bp-desktop) {
      font-size: 1rem;
    }
  }
}

blockquote {
  margin: 2rem 0;
  text-align: center;
  font-family: $font-display;
  line-height: 1;

  q {
    display: block;
    margin-bottom: 1rem;
    text-transform: uppercase;
    font-weight: $extrabold;
    font-size: 2.25rem;
  }

  .source {
    font-size: 1.25rem;
    font-weight: $semibold;
  }

  @media (min-width: $bp-desktop) {
    margin-top: 3rem;
    margin-bottom: 2rem;

    q {
      font-size: 3.5rem;
      margin-bottom: 2rem;
    }
  }
}
</style>
