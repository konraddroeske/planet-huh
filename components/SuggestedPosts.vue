<template>
  <Wrapper v-if="posts.length">
    <section class="suggestedPosts">
      <h2 class="title">You Might Like</h2>

      <ButtonArrow
        v-if="activeSlide > 0"
        class="leftArrow"
        @clicked="handleSlide('left')"
      >
        <span class="visuallyHidden">View more posts to the left</span>
        <LeftArrow />
      </ButtonArrow>
      <ButtonArrow
        v-if="
          isDesktop ? activeSlide < numSlides - 3 : activeSlide < numSlides - 1
        "
        class="rightArrow"
        @clicked="handleSlide('right')"
      >
        <span class="visuallyHidden">View more posts to the right</span>
        <RightArrow />
      </ButtonArrow>

      <div id="suggestedSlider">
        <ul :ref="'postList'" class="postList">
          <li
            v-for="(post, index) of formattedPosts"
            :key="post.slug"
            :ref="'post' + index"
            class="post"
          >
            <nuxt-link :to="`/post/${post.slug}`" class="imageLink">
              <LazyImage
                class="postImage"
                :src="post.coverImage.url"
                :alt="post.title"
                :max-width="667"
              />
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
                  <nuxt-link :to="`/categories?filters=${tag.toLowerCase()}`">{{
                    tag
                  }}</nuxt-link>
                </span>
              </template>
            </p>
          </li>
        </ul>
      </div>
    </section>
  </Wrapper>
</template>

<script>
import gsap from "gsap"
import { Draggable, InertiaPlugin } from "gsap/all"
import { fetchContent } from "@/utils/api"
import ButtonArrow from "@/components/ButtonArrow"
import LeftArrow from "~/assets/icons/leftArrow.svg?inline"
import RightArrow from "~/assets/icons/rightArrow.svg?inline"
import Wrapper from "@/components/Wrapper"

export default {
  components: {
    ButtonArrow,
    LeftArrow,
    RightArrow,
    Wrapper,
  },
  props: {
    city: {
      type: Object,
      required: true,
      validator(obj) {
        return (
          typeof obj.name === "string" &&
          ["include", "exclude"].includes(obj.filterType)
        )
      },
    },
    sense: {
      type: Object,
      required: true,
      validator(obj) {
        return (
          typeof obj.name === "string" &&
          ["include", "exclude"].includes(obj.filterType)
        )
      },
    },
    mood: {
      type: Object,
      required: true,
      validator(obj) {
        return (
          typeof obj.name === "string" &&
          ["include", "exclude"].includes(obj.filterType)
        )
      },
    },
  },
  data() {
    return {
      posts: [],
      activeSlide: 0,
      offsets: [],
      isDesktop: false,
    }
  },
  computed: {
    numSlides() {
      return this.posts.length
    },
    computedWhere() {
      const { city, sense, mood } = this.$props

      const cityFilter =
        city.filterType === "include" ? "city_some" : "city_none"
      const senseFilter =
        sense.filterType === "include" ? "sense_some" : "sense_none"
      const moodFilter = mood.filterType === "include" ? "mood" : "mood_not"

      const cityWhere = `${cityFilter}: {name: "${city.name}"}`
      const senseWhere = `${senseFilter}: {name: "${sense.name}"}`
      const moodWhere = `mood: {${moodFilter}: "${mood.name}"}`

      return `where: {${cityWhere}, ${senseWhere}, ${moodWhere}}`
    },
    formattedPosts() {
      return this.posts.map((post) => ({
        ...post,
        tags: this.computeTags(post.city, post.sense, post.mood),
      }))
    },
  },
  async created() {
    const { data } = await fetchContent(`{
      posts(orderBy: date_DESC, first: 12, ${this.computedWhere}) {
        title
        slug
        coverImage {
          url
        }
        date
        excerpt
        city {
          name
        }
        sense {
          name
        }
        mood {
          mood
        }
      }
    }`)

    const { posts } = data.data

    const randomizedPosts = posts.sort((a, b) => 0.5 - Math.random())

    // Remove current post if the user is on a post page
    const currentSlug = this.$route.params.slug
    if (currentSlug) {
      const postIndex = randomizedPosts.findIndex(
        (post) => post.slug === currentSlug
      )
      if (postIndex >= 0) {
        randomizedPosts.splice(postIndex, 1)
      }
    }

    this.posts = randomizedPosts

    // This runs the callback AFTER this.posts re-renders the DOM
    this.$nextTick(function () {
      this.setSnapPoints()
    })
  },
  mounted() {
    gsap.registerPlugin(Draggable, InertiaPlugin)
    window.addEventListener("resize", this.setSnapPoints)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setSnapPoints)
  },
  activated() {
    // window.addEventListener("resize", this.setSnapPoints)
  },
  deactivated() {
    window.removeEventListener("resize", this.setSnapPoints)
  },
  methods: {
    resetSlider() {
      this.activeSlide = 0
      gsap.to(this.$refs.postList, { x: 0 })
    },
    setSnapPoints() {
      this.resetSlider()
      this.isDesktop = window.innerWidth >= 1024

      const newOffsets = []
      for (let i = 0; i < this.numSlides; i++) {
        const slide = this.$refs[`post${i}`][0]
        newOffsets.push(-slide.offsetLeft)
      }
      this.offsets = newOffsets

      this.setDraggable()
    },
    setDraggable() {
      const that = this
      Draggable.create(".postList", {
        type: "x",
        bounds: "#suggestedSlider",
        inertia: true,
        snap: that.offsets,
        onDragEnd() {
          that.activeSlide = that.offsets.indexOf(this.endX)
        },
      })
    },
    handleSlide(direction) {
      const increment = this.isDesktop ? 3 : 1
      if (direction === "left") {
        const isBeforeFirstPost = this.activeSlide - increment < 0
        this.activeSlide = isBeforeFirstPost ? 0 : this.activeSlide - increment
      } else if (direction === "right") {
        const isAfterLastPost = this.activeSlide + increment >= this.numSlides
        this.activeSlide = isAfterLastPost
          ? this.numSlides - 1
          : this.activeSlide + increment
      }

      gsap.to(this.$refs.postList, 0.5, {
        x: this.offsets[this.activeSlide],
      })
    },
    computeCities(cities) {
      return cities.map((city) => city.name)
    },
    computeSenses(senses) {
      return senses.map((sense) => sense.name)
    },
    computeMood(mood) {
      return mood.mood ? [mood.mood] : []
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
.suggestedPosts {
  position: relative;
}

.title {
  text-align: center;
  text-transform: uppercase;
  font-size: 2rem;
  margin: 4rem 0 2rem;

  @media (min-width: $bp-desktop) {
    font-size: 3.35rem;
    margin-top: 6rem;
  }
}

.leftArrow,
.rightArrow {
  position: absolute;
  top: calc(13.5rem - 1rem);
  z-index: 1;

  @media (min-width: $bp-desktop) {
    top: calc(50% - 2rem);
  }
}

.leftArrow {
  left: -1rem;
  @media (min-width: $bp-desktop) {
    left: -4.5rem;
  }
  @media (min-width: $bp-lg-desktop) {
    left: -6rem;
  }
}

.rightArrow {
  right: -1rem;
  @media (min-width: $bp-desktop) {
    right: -4.5rem;
  }
  @media (min-width: $bp-lg-desktop) {
    right: -6rem;
  }
}

#suggestedSlider {
  overflow: hidden;
}

.postList {
  list-style: none;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  display: inline-block;
}

.post {
  display: inline-block;
  vertical-align: top;
  white-space: normal;
  width: 85vw;
  text-align: center;
  margin-bottom: 4rem;
  padding: 0.1rem;

  &:not(:last-child) {
    margin-right: 1rem;
  }

  @media (min-width: $bp-desktop) {
    width: calc(28.3vw - 1.6rem);
    text-align: left;
    margin-bottom: 6rem;

    &:not(:last-child) {
      margin-right: 2rem;
    }
  }
}

.postImage {
  width: 100%;
  margin-bottom: 1rem;
  height: 20rem;
  object-fit: cover;

  @media (min-width: $bp-desktop) {
    height: auto;
    object-fit: fill;
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
  }
}

.postTitle {
  font-weight: $bold;
  font-size: 1.75rem;
  margin: 1rem 0;

  @media (min-width: $bp-desktop) {
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
