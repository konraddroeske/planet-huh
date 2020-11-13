<template>
  <section :class="{ noMargin: isIndex }">
    <Wrapper>
      <h2 class="visuallyHidden">Posts Feed</h2>
      <ul class="postList">
        <li
          v-for="(post, index) of formattedPosts"
          :key="post.id"
          class="postContainer"
          :class="`postContainer${index}`"
        >
          <nuxt-link :to="`/post/${post.slug}`" class="imageLink">
            <div class="postImageContainer">
              <LazyImage
                class="postImage"
                :src="post.coverImage ? post.coverImage.url : null"
                :alt="post.title"
                :max-width="1000"
                @loaded="onLoaded"
              />
            </div>
          </nuxt-link>
          <p class="postDate"><Date :input="post.date" /></p>
          <h3 class="postTitle">
            <nuxt-link :to="`/post/${post.slug}`" class="postLink">
              {{ post.title }}
            </nuxt-link>
          </h3>
          <p class="postTags">
            <template v-for="(tag, idx) of post.tags">
              <span :key="idx">
                <span v-if="idx > 0">, </span>
                <nuxt-link
                  :to="`/categories?filters=${tag.toLowerCase()}`"
                  @click.native="routeFilter(tag.toLowerCase())"
                  >{{ tag }}</nuxt-link
                >
              </span>
            </template>
          </p>
        </li>
      </ul>
      <Button v-if="!postLimit" ref="load" @clicked="getSomePostsAndUnfocus">
        Load More
      </Button>
    </Wrapper>
  </section>
</template>

<script>
import gsap from "gsap"
import categoryRouteReset from "~/mixins/categoryRouteReset"
import Wrapper from "@/components/Wrapper"
import Button from "@/components/Button"
import Date from "@/components/Date"

export default {
  components: { Wrapper, Button, Date },
  mixins: [categoryRouteReset],
  props: {
    posts: {
      type: Array,
      required: true,
    },
    postLimit: {
      type: Boolean,
      required: true,
    },
    getSomePostsPath: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      allPostsFetched: false,
      width: null,
      isIndex: false,
    }
  },
  computed: {
    formattedPosts() {
      return this.posts.map((post) => ({
        ...post,
        tags: this.computeTags(post.city, post.sense, post.mood),
      }))
    },
  },
  mounted() {
    this.onMount()
  },
  onDestroy() {
    this.onDestroy()
  },
  activated() {
    this.onMount()
  },
  deactivated() {
    this.onDestroy()
  },
  methods: {
    onMount() {
      if (this.$route.path === "/") this.isIndex = true
      this.width = window.matchMedia("(min-width: 1024px)")
      this.setPadding(this.width)
      this.width.addListener(this.setPadding)
    },
    onDestroy() {
      this.width.removeListener(this.setPadding)
    },
    onLoaded() {
      if (this.width.matches) {
        this.onResize()
      }
    },
    onResize() {
      const images = document.querySelectorAll(".postImageContainer")

      for (let i = 1; i < images.length; i++) {
        if (i % 2 === 1) {
          gsap.set(`.postContainer${i}`, {
            paddingTop: images[i - 1].offsetHeight / 2,
          })
        }
      }
    },
    setPadding(width) {
      if (width.matches) {
        this.onResize()
        // add resize event listener
        window.addEventListener("resize", this.onResize)
      } else {
        // remove resize event listener
        window.removeEventListener("resize", this.onResize)

        const images = document.querySelectorAll(".postImageContainer")

        for (let i = 1; i < images.length; i++) {
          if (i % 2 === 1) {
            gsap.set(`.postContainer${i}`, {
              paddingTop: 0,
            })
          }
        }
      }
    },
    getSomePosts() {
      this.$store.dispatch(this.getSomePostsPath, 8)
    },
    getSomePostsAndUnfocus() {
      this.$refs.load.$el.blur()
      this.getSomePosts()
    },
    computeCities(cities) {
      return cities.map((city) => city.name)
    },
    computeSenses(senses) {
      return senses.map((sense) => sense.name)
    },
    computeMood(mood) {
      return mood ? [mood.mood] : []
    },
    computeTags(cities, senses, mood) {
      const { computeCities, computeSenses, computeMood } = this
      return computeCities(cities).concat(
        computeSenses(senses),
        computeMood(mood)
      )
    },
  },
}
</script>

<style lang="scss" scoped>
section {
  margin: 7rem 0;
  text-align: center;
}

.noMargin {
  margin-bottom: 0rem;
}

.postList {
  padding-left: 0;
  margin-bottom: 3rem;

  @media (min-width: $bp-desktop) {
    display: flex;
    flex-wrap: wrap;
  }
}

.postContainer {
  margin-bottom: 5rem;
}

.postContainer:last-child {
  margin-bottom: 0;
}

@media (min-width: $bp-desktop) {
  .postContainer {
    margin-bottom: 3rem;
  }

  .postContainer:nth-child(8n + 1) {
    width: calc(27.5% / 0.85);
  }

  .postContainer:nth-child(8n + 2) {
    width: calc(57.5% / 0.85);
    padding-left: 3%;
  }

  .postContainer:nth-child(8n + 3) {
    width: 50%;
    padding-right: 1.5%;
  }

  .postContainer:nth-child(8n + 4) {
    width: 50%;
    padding-left: 3%;
  }

  .postContainer:nth-child(8n + 5) {
    width: calc(57.5% / 0.85);
    padding-right: 3%;
  }

  .postContainer:nth-child(8n + 6) {
    width: calc(27.5% / 0.85);
  }

  .postContainer:nth-child(8n + 7) {
    width: 50%;
    padding-right: 1.5%;
  }

  .postContainer:nth-child(8n + 8) {
    width: 50%;
    padding-left: 1.5%;
  }
}

.postImageContainer {
  margin-bottom: 1rem;
}

.postImage {
  width: 100%;

  @media (min-width: $bp-desktop) {
    object-fit: cover;
  }
}

.imageLink {
  &:hover,
  &:focus {
    .postImage {
      box-shadow: 0 0 0 0.1rem $accent;
    }
  }
}

.postDate {
  color: $accent;
  font-size: 1.1rem;
  text-transform: uppercase;
  margin: 0;

  @media (min-width: $bp-desktop) {
    color: $gray;
    text-align: left;
  }
}

.postTitle {
  font-weight: $bold;
  font-size: 1.75rem;
  margin: 1rem 0;

  @media (min-width: $bp-desktop) {
    text-align: left;
    font-size: 2rem;
  }
}

.postLink,
.postLink:visited {
  text-decoration: none;
  color: $black;

  &:hover,
  &:focus {
    color: $accent;
  }
}

.postTags {
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: $bold;
  margin: 0;

  @media (min-width: $bp-desktop) {
    text-align: left;
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
}
</style>
