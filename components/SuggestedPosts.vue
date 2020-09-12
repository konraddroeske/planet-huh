<template>
  <Wrapper v-if="posts.length">
    <section class="suggestedPosts">
      <h2 class="title">You Might Like</h2>

      <ButtonArrow
        v-if="curPos < 0"
        class="leftArrow"
        @clicked="handleSlide('left')"
      >
        <span class="visuallyHidden">View more posts to the left</span>
        <LeftArrow />
      </ButtonArrow>
      <ButtonArrow
        v-if="curPos > (slideWidth * numSlides - increment) * -1"
        class="rightArrow"
        @clicked="handleSlide('right')"
      >
        <span class="visuallyHidden">View more posts to the right</span>
        <RightArrow />
      </ButtonArrow>

      <div id="suggestedSlider" ref="suggestedSlider">
        <ul id="postList" :ref="'postList'" class="postList">
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
      curPos: 0,
      isDesktop: false,
      rightButton: true,
      slideWidth: 0,
      increment: 0,
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
  async mounted() {
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

    this.$nextTick(() => {
      gsap.registerPlugin(Draggable, InertiaPlugin)

      this.setSnapPoints()
      window.addEventListener("resize", this.setSnapPoints)
    })
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setSnapPoints)
  },
  activated() {
    window.addEventListener("resize", this.setSnapPoints)
  },
  deactivated() {
    window.removeEventListener("resize", this.setSnapPoints)
  },
  methods: {
    resetSlider() {
      gsap.to(this.$refs.postList, { x: 0 })
    },
    setSnapPoints() {
      this.resetSlider()
      this.isDesktop = window.innerWidth >= 1024

      const suggestedSlider = this.$refs.suggestedSlider

      const slideWidth = this.isDesktop
        ? Math.round(suggestedSlider.offsetWidth / 3)
        : Math.round(suggestedSlider.offsetWidth)

      this.slideWidth = slideWidth
      this.increment = this.isDesktop ? 3 * this.slideWidth : this.slideWidth

      for (let i = 0; i < this.numSlides; i++) {
        const slide = this.$refs[`post${i}`][0]

        // set width
        gsap.set(slide, { width: slideWidth })
      }

      this.setDraggable()
    },
    snapX(x) {
      return Math.round(x / this.slideWidth) * this.slideWidth
    },
    setDraggable() {
      const that = this
      Draggable.create(".postList", {
        type: "x",
        bounds: "#suggestedSlider",
        inertia: true,
        snap: {
          x: that.snapX,
        },
        onDragEnd() {
          that.curPos = this.endX
        },
      })
    },
    handleSlide(direction) {
      if (direction === "left") {
        // if current position is less than a full increment, slide over the difference
        this.curPos =
          this.curPos * -1 <= this.increment ? 0 : this.curPos + this.increment
      } else if (direction === "right") {
        // if current position + 2 * increment greater than full slide, slide over the difference
        this.curPos =
          this.curPos * -1 + this.increment * 2 >=
          this.slideWidth * this.numSlides
            ? (this.slideWidth * this.numSlides - this.increment) * -1
            : this.curPos - this.increment
      }

      gsap.to(this.$refs.postList, 0.5, {
        x: this.curPos,
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
    left: -5rem;
  }
}

.rightArrow {
  right: -1rem;
  @media (min-width: $bp-desktop) {
    right: -4.5rem;
  }
  @media (min-width: $bp-lg-desktop) {
    right: -5rem;
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
  text-align: center;
  margin-bottom: 4rem;
  padding: 0.1rem;

  @media (min-width: $bp-desktop) {
    text-align: left;
    margin-bottom: 6rem;
    padding: 0.1rem 1rem;
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
