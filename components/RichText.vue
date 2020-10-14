<template>
  <section>
    <div class="wrapper">
      <template v-for="(item, index) of organizedContent">
        <p v-if="item.type === 'paragraph'" :key="index" class="bodyText">
          <template v-for="(child, idx) of item.children">
            <a v-if="child.type === 'link'" :key="idx" :href="child.href">{{
              child.text
            }}</a>
            <template v-else>
              <strong :key="idx" v-show-but-keep-inner="!!child.bold">
                <em :key="idx" v-show-but-keep-inner="!!child.italic">
                  <u :key="idx" v-show-but-keep-inner="!!child.underline">
                    <span>{{ child.text }}</span>
                  </u>
                </em>
              </strong>
            </template>
          </template>
        </p>

        <h1 v-if="item.type === 'heading-one'" :key="index">
          {{ item.text }}
        </h1>

        <h2 v-if="item.type === 'heading-two'" :key="index">
          {{ item.text }}
        </h2>

        <h3 v-if="item.type === 'heading-three'" :key="index">
          {{ item.text }}
        </h3>

        <h4 v-if="item.type === 'heading-four'" :key="index">
          {{ item.text }}
        </h4>

        <h5 v-if="item.type === 'heading-five'" :key="index">
          {{ item.text }}
        </h5>

        <h6 v-if="item.type === 'heading-six'" :key="index">
          {{ item.text }}
        </h6>

        <ul v-if="item.type === 'bulleted-list'" :key="index">
          <li v-for="(listItem, idx) of item.listItems" :key="idx">
            {{ listItem }}
          </li>
        </ul>

        <ol v-if="item.type === 'numbered-list'" :key="index">
          <li v-for="(listItem, idx) of item.listItems" :key="idx">
            {{ listItem }}
          </li>
        </ol>

        <blockquote v-if="item.type === 'block-quote'" :key="index">
          <q>{{ item.text }}</q>
          <div class="source">— {{ item.source }}</div>
        </blockquote>

        <div
          v-if="item.type === 'full-image'"
          :key="index"
          class="fullImageContainer"
        >
          <LazyImage :src="item.src" alt="" :max-width="2000" />
          <div class="accentText caption">{{ item.caption }}</div>
        </div>

        <div v-if="item.type === 'flex-images'" :key="index" class="flexImages">
          <div
            v-for="(image, idx) of item.images"
            :key="idx"
            class="flexImageContainer"
          >
            <LazyImage :src="image.src" alt="" :max-width="1000" />
            <div class="accentText caption">{{ image.caption }}</div>
          </div>
        </div>

        <div v-if="item.type === 'iframe'" :key="index" class="embed">
          <RichTextEmbed
            v-if="!item.instagram"
            :url="item.url"
            :width="`${item.width}px`"
            :height="`${item.height}px`"
            :name="`iframe${index}`"
            :instagram="item.instagram"
          />
          <InstagramEmbed
            v-else
            :url="item.url.slice(0, -5)"
            :max-width="item.width"
          />
        </div>
      </template>
    </div>
  </section>
</template>

<script>
import InstagramEmbed from "vue-instagram-embed"
import RichTextEmbed from "@/components/RichTextEmbed"

export default {
  components: {
    RichTextEmbed,
    InstagramEmbed,
  },
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
        (item) => item.type !== "paragraph" || item.children[0].text.trim()
      )

      const cleanContent = []
      rawContent.forEach((item, index) => {
        if (item.type === "paragraph") {
          cleanContent.push({
            type: item.type,
            children: this.parseChildrenWithLinks(item.children),
          })
        } else if (
          [
            "heading-one",
            "heading-two",
            "heading-three",
            "heading-four",
            "heading-five",
            "heading-six",
          ].includes(item.type)
        ) {
          cleanContent.push({
            type: item.type,
            text: this.childrenToText(item.children),
          })
        } else if (
          item.type === "bulleted-list" ||
          item.type === "numbered-list"
        ) {
          const lastItem = cleanContent[cleanContent.length - 1]

          const listItems = item.children.map((listItem) =>
            this.childrenToText(listItem.children[0].children)
          )

          if (lastItem.type === item.type) {
            lastItem.listItems = lastItem.listItems.concat(listItems)
          } else {
            cleanContent.push({
              type: item.type,
              listItems,
            })
          }
        } else if (item.type === "block-quote") {
          const [text, source] = this.childrenToText(item.children).split("@")
          cleanContent.push({
            type: item.type,
            text: text.trim(),
            source: source.trim(),
          })
        } else if (item.type === "image") {
          const lastItem = cleanContent[cleanContent.length - 1]

          if (
            !lastItem ||
            (lastItem && !["full-image", "flex-images"].includes(lastItem.type))
          ) {
            cleanContent.push({
              type: "full-image",
              src: item.src,
              caption: item.altText.trim(),
            })
          } else if (lastItem.type === "full-image") {
            const lastImage = cleanContent.pop()
            cleanContent.push({
              type: "flex-images",
              images: [
                { src: lastImage.src, caption: lastImage.caption },
                { src: item.src, caption: item.altText.trim() },
              ],
            })
          } else if (lastItem.type === "flex-images") {
            lastItem.images.push({
              src: item.src,
              caption: item.altText.trim(),
            })
          }
        } else if (item.type === "iframe") {
          cleanContent.push({
            type: item.type,
            url: item.url,
            width: item.width,
            height: item.height,
            instagram: item.url.includes("instagram"),
          })
        }
      })

      return cleanContent
    },
  },
  methods: {
    childrenToText(children) {
      return children
        .map((child) =>
          child.type === "link"
            ? this.childrenToText(child.children)
            : child.text
        )
        .join("")
        .trim()
    },
    parseChildrenWithLinks(children) {
      return children.map((child) =>
        child.type === "link"
          ? {
              type: child.type,
              href: child.href,
              text: this.childrenToText(child.children),
            }
          : child
      )
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
  a,
  a:visited {
    color: $black;
    text-decoration: none;
    border-bottom: 0.05rem solid $accent;
    padding-bottom: 0.05rem;

    &:hover,
    &:focus {
      color: $accent;
      border-bottom-color: $black;
    }
  }
}

h1 {
  font-weight: $extrabold;
  font-size: 3.4rem;
  text-transform: uppercase;
  line-height: 55px;
}

h2 {
  font-weight: $extrabold;
  font-size: 2.5rem;
  text-transform: uppercase;
  line-height: 45px;
}

h3 {
  color: $accent;
  font-weight: $semibold;
  font-size: 2.25rem;
  line-height: 40px;
}

h4 {
  font-weight: $semibold;
  font-size: 1.5rem;
  line-height: 30px;
}

h5 {
  font-weight: $semibold;
  font-size: 1.25rem;
  line-height: 24px;
}

h6 {
  color: $mediumGray;
  font-weight: $semibold;
  font-size: 1rem;
  line-height: 20px;
}

ul {
  margin: 1.5rem 0;
  padding: 0;
  list-style: none;

  li {
    color: $mediumGray;
    font-family: $font-body;
    font-size: 1rem;
    line-height: 24px;
    padding-left: 2.5rem;
    position: relative;

    &:not(:last-child) {
      margin-bottom: 0.1rem;
    }

    &::before {
      content: "";
      position: absolute;
      width: 0.75rem;
      height: 0.05rem;
      top: 40%;
      left: 0;
      background: $accent;
    }
  }
}

ol {
  margin: 1.5rem 0;
  padding: 0;
  list-style: none;
  counter-reset: counter;

  li {
    color: $mediumGray;
    font-family: $font-body;
    font-size: 1rem;
    line-height: 24px;
    padding-left: 2.5rem;
    counter-increment: counter;
    position: relative;

    &:not(:last-child) {
      margin-bottom: 0.1rem;
    }

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      content: counter(counter) ".";
      color: $accent;
      font-family: $font-display;
      font-weight: $medium;
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
  font-size: 0.65rem;
}

// .video {
//   position: relative;
//   width: 100%;
//   height: 0;
//   margin: 2rem 0;
//   padding-bottom: 56.25%;

//   iframe {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//   }

//   @media (min-width: $bp-desktop) {
//     margin: 3rem 0;
//   }
// }

.embed {
  position: relative;
  width: 100%;
  //   height: 0;
  margin: 2rem 0;
  //   padding-bottom: 56.25%;

  //   iframe {
  //     position: absolute;
  //     top: 0;
  //     left: 0;
  //     width: 100%;
  //     height: 100%;
  //   }

  @media (min-width: $bp-desktop) {
    margin: 3rem 0;
  }
}
</style>
