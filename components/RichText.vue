<template>
  <section>
    <div class="wrapper">
      <template v-for="(item, index) of organizedContent">
        <p v-if="item.type === 'paragraph'" :key="index">
          {{ item.text }}
        </p>

        <blockquote v-if="item.type === 'block-quote'" :key="index">
          <q>{{ item.text }}</q>
          <div class="source">— {{ item.source }}</div>
        </blockquote>

        <div
          v-if="item.type === 'full-image'"
          :key="index"
          class="fullImageContainer"
        >
          <img :src="item.src" alt="" />
          <div class="accentText caption">{{ item.caption }}</div>
        </div>

        <div v-if="item.type === 'flex-images'" :key="index" class="flexImages">
          <div
            v-for="image in item.images"
            :key="image.src"
            class="flexImageContainer"
          >
            <img :src="image.src" alt="" />
            <div class="accentText caption">{{ image.caption }}</div>
          </div>
        </div>

        <div v-if="item.type === 'iframe'" :key="index" class="video">
          <iframe
            :src="item.url"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </template>
    </div>
  </section>
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
      // Note: This filters out empty paragraphs (blank spaces in content)
      const rawContent = this.$props.content.filter(
        (item) => item.type !== 'paragraph' || item.children[0].text.trim()
      )

      const cleanContent = []
      rawContent.forEach((item, index) => {
        if (item.type === 'paragraph') {
          cleanContent.push({
            type: item.type,
            text: item.children[0].text.trim(),
          })
        } else if (item.type === 'block-quote') {
          const [text, source] = item.children[0].text.split('@')
          cleanContent.push({
            type: item.type,
            text: text.trim(),
            source: source.trim(),
          })
        } else if (item.type === 'image') {
          const lastItem = cleanContent[cleanContent.length - 1]

          if (
            !lastItem ||
            (lastItem && !['full-image', 'flex-images'].includes(lastItem.type))
          ) {
            cleanContent.push({
              type: 'full-image',
              src: item.src,
              caption: item.altText.trim(),
            })
          } else if (lastItem.type === 'full-image') {
            const lastImage = cleanContent.pop()
            cleanContent.push({
              type: 'flex-images',
              images: [
                { src: lastImage.src, caption: lastImage.caption },
                { src: item.src, caption: item.altText.trim() },
              ],
            })
          } else if (lastItem.type === 'flex-images') {
            lastItem.images.push({
              src: item.src,
              caption: item.altText.trim(),
            })
          }
        } else if (item.type === 'iframe') {
          cleanContent.push({
            type: item.type,
            url: item.url,
          })
        }
      })

      return cleanContent
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 85%;
  margin: 2.5rem auto;

  @media (min-width: $bp-desktop) {
    width: 70%;
    margin: 5rem auto;
  }
}

p {
  font-family: $font-body;
  font-size: 1.1rem;

  @media (min-width: $bp-desktop) {
    font-size: 1.25rem;
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

.flexImages {
  margin: 2rem 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  @media (min-width: $bp-desktop) {
    margin: 2.5rem 0 2rem;
    grid-gap: 2rem;
    grid-template-columns: 1fr 1fr;
  }
}

.fullImageContainer,
.flexImageContainer {
  img {
    width: 100%;
    display: block;
  }
}

.caption {
  margin: 0.5rem 0;
}

.video {
  position: relative;
  width: 100%;
  height: 0;
  margin: 2rem 0;
  padding-bottom: 56.25%;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  @media (min-width: $bp-desktop) {
    margin: 3rem 0;
  }
}
</style>
