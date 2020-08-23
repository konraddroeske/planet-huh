<template>
  <Wrapper>
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
        v-if="activeSlide < offsets.length - 1"
        class="rightArrow"
        @clicked="handleSlide('right')"
      >
        <span class="visuallyHidden">View more posts to the right</span>
        <RightArrow />
      </ButtonArrow>

      <div id="suggestedSlider">
        <ul :ref="'postList'" class="postList">
          <li
            v-for="(post, index) of posts"
            :key="post.slug"
            :ref="'post' + index"
            class="post"
          >
            <nuxt-link :to="`/post/${post.slug}`">
              <img
                class="postImage"
                :src="post.coverImage.url"
                :alt="post.title"
              />
            </nuxt-link>
            <p class="postDate"><Date :input="post.date" /></p>
            <h3 class="postTitle">
              <nuxt-link :to="`/post/${post.slug}`" class="postLink">
                {{ post.title }}
              </nuxt-link>
            </h3>
            <p class="postTags">
              <!-- {{ post.cityName }}, {{ post.senseName }}, {{ post.moodName }} -->
              Toronto, Touch, Happy
            </p>
          </li>
        </ul>
      </div>
    </section>
  </Wrapper>
</template>

<script>
import gsap from 'gsap'
import { fetchContent } from '@/utils/api'
import ButtonArrow from '@/components/ButtonArrow'
import LeftArrow from '~/assets/icons/leftArrow.svg?inline'
import RightArrow from '~/assets/icons/rightArrow.svg?inline'
import Wrapper from '@/components/Wrapper'

export default {
  components: {
    ButtonArrow,
    LeftArrow,
    RightArrow,
    Wrapper,
  },
  data() {
    return {
      posts: [],
      duration: 0.5,
      activeSlide: 0,
      offsets: [],
      dragInstance: null,
    }
  },
  computed: {
    numSlides() {
      return this.posts.length
    },
  },
  async created() {
    const { data } = await fetchContent(`{
      posts(orderBy: date_DESC, first: 6) {
        title
        slug
        coverImage {
          url
        }
        date
        excerpt
      }
      collabPosts(orderBy: date_DESC, first: 6) {
        title
        slug
        coverImage {
          url
        }
        date
        excerpt
      }
    }`)

    const { posts, collabPosts } = data.data

    // Sorted in random order
    this.posts = posts.concat(collabPosts).sort((a, b) => 0.5 - Math.random())

    // This runs the callback AFTER this.posts re-renders the DOM
    this.$nextTick(function () {
      this.setSnapPoints()
    })
  },
  mounted() {
    window.addEventListener('resize', this.setSnapPoints)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setSnapPoints)
  },
  methods: {
    resetSlider() {
      this.activeSlide = 0
      gsap.to(this.$refs.postList, { x: 0 })
    },
    setSnapPoints() {
      this.resetSlider()

      const newOffsets = []

      if (window.innerWidth >= 1024) {
        for (let i = 0; i < this.numSlides; i += 3) {
          const lastSlide = this.$refs[`post${this.numSlides - 1}`][0]

          const slide = this.$refs[`post${i}`]
            ? this.$refs[`post${i}`][0]
            : lastSlide

          newOffsets.push(-slide.offsetLeft)
        }
      } else {
        for (let i = 0; i < this.numSlides; i++) {
          const slide = this.$refs[`post${i}`][0]
          newOffsets.push(-slide.offsetLeft)
        }
      }

      this.offsets = newOffsets
    },
    handleSlide(direction) {
      if (direction === 'left') this.activeSlide -= 1
      else if (direction === 'right') this.activeSlide += 1

      gsap.to(this.$refs.postList, this.duration, {
        x: this.offsets[this.activeSlide],
      })
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
  overflow-x: hidden;
}

.postList {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
}

.post {
  flex: 0 0 100%;
  text-align: center;
  margin-bottom: 2rem;

  &:not(:last-child) {
    margin-right: 1rem;
  }

  @media (min-width: $bp-desktop) {
    flex: 0 0 calc(33.3% - 1.3rem);
    text-align: left;
    margin-bottom: 4rem;

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

  :hover,
  :focus {
    color: $accent;
  }
}

.postTags {
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: $bold;
  margin: 0;
}
</style>
