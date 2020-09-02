<template>
  <section>
    <Wrapper>
      <h2 class="visuallyHidden">Posts Feed</h2>
      <ul class="postList">
        <li
          v-for="(post, index) of formattedPosts"
          :key="post.id"
          class="postContainer"
          :class="`postContainer${index}`"
        >
          <nuxt-link :to="`/post/${post.slug}`">
            <div class="postImageContainer">
              <img
                class="postImage"
                :src="post.coverImage.url"
                :alt="post.title"
                @load="onLoad"
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
            {{ post.city[0].name
            }}{{ post.sense[0] ? formattedSense(post.sense) : null
            }}{{ post.mood ? formattedMood(post.mood) : null }}
          </p>
        </li>
      </ul>
      <Button
        v-if="!allPostsFetched"
        ref="load"
        @clicked="getSomePostsAndUnfocus"
      >
        Load More
      </Button>
    </Wrapper>
  </section>
</template>

<script>
import gsap from "gsap"
import Wrapper from "@/components/Wrapper"
import Button from "@/components/Button"
import Date from "@/components/Date"

export default {
  components: { Wrapper, Button, Date },
  props: {
    posts: {
      type: Array,
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
    }
  },
  computed: {
    formattedPosts() {
      return this.posts.map((post) => ({
        ...post,
      }))
    },
  },
  watch: {
    posts(newPosts, oldPosts) {
      newPosts.length === oldPosts.length
        ? (this.allPostsFetched = true)
        : (this.allPostsFetched = false)
    },
  },
  // mounted() {
  //   this.onMount()
  // },
  // beforeDestroy() {
  //   this.onDestroy()
  // },
  activated() {
    this.onMount()
  },
  deactivated() {
    this.onDestroy()
  },
  methods: {
    onMount() {
      this.width = window.matchMedia("(min-width: 1024px)")
      this.setPadding(this.width)
      this.width.addListener(this.setPadding)
    },
    onDestroy() {
      this.width.removeListener(this.setPadding)
    },
    onLoad() {
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
      this.$store.dispatch(this.getSomePostsPath, 4)
    },
    getSomePostsAndUnfocus() {
      this.$refs.load.$el.blur()
      this.getSomePosts()
    },
    formattedSense(sense) {
      return `, ${sense[0].name}`
    },
    formattedMood(mood) {
      return `, ${mood.mood}`
    },
  },
}
</script>

<style lang="scss" scoped>
section {
  margin: 5rem 0;
  text-align: center;
}

.postList {
  padding-left: 0;

  @media (min-width: $bp-desktop) {
    margin-bottom: 5rem;
    display: flex;
    flex-wrap: wrap;
  }
}

.postContainer {
  margin-bottom: 5rem;
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

  @media (min-width: $bp-desktop) {
    max-height: 450px;
    display: flex;
  }

  @media (min-width: $bp-lg-desktop) {
    max-height: 550px;
    display: flex;
  }
}

.postImage {
  width: 100%;

  @media (min-width: $bp-desktop) {
    object-fit: cover;
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
}
</style>
