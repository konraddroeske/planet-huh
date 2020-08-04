<template>
  <section class="featuredCollabs">
    <h2 class="title">Featured Collabs</h2>
    <div class="leftArrow"><LeftArrow /></div>
    <div class="rightArrow"><RightArrow /></div>
    <ul class="collabsList">
      <li
        v-for="(post, index) of posts"
        :key="post.id"
        :ref="'post' + index"
        class="collab"
      >
        <div class="collabContent">
          <div class="leftImage">
            <img
              class="postImage"
              :src="post.images[0].url"
              :alt="post.title"
            />
          </div>
          <div class="rightImage">
            <img
              class="postImage"
              :src="post.images[1].url"
              :alt="post.title"
            />
          </div>
          <Wrapper>
            <div class="content">
              <div class="headline">
                <p>
                  {{ post.headline }}
                </p>
              </div>
              <div class="title">
                <h3>
                  {{ post.artist[0].name }} + {{ post.artist[1].name }}
                  {{ post.title }}
                </h3>
              </div>
              <div class="buttonContainer">
                <Button>Explore</Button>
              </div>
            </div>
          </Wrapper>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import gsap from 'gsap'
import { Draggable, InertiaPlugin } from 'gsap/all'
import Button from '@/components/Button'
import Wrapper from '@/components/Wrapper'
import LeftArrow from '~/assets/icons/leftArrow.svg?inline'
import RightArrow from '~/assets/icons/rightArrow.svg?inline'

export default {
  components: {
    Button,
    Wrapper,
    LeftArrow,
    RightArrow,
  },
  data() {
    return {
      slideDuration: 1,
      dragInstance: null,
      proxyRef: null,
      transform: null,
      slideWidth: null,
      wrapWidth: null,
      slideAnimation: gsap.to({}, 0.1, {}),
      switchPosition: null,
    }
  },
  computed: {
    ...mapState({
      posts: (state) => state.homepage.featuredCollabPosts,
    }),
    wrap() {
      return this.wrapPartial(-100, (this.posts.length - 1) * 100)
    },
    numSlides() {
      return this.posts.length
    },
  },
  mounted() {
    gsap.registerPlugin(Draggable, InertiaPlugin)

    this.proxyRef = document.createElement('div')
    gsap.set(this.proxyRef, {
      x: '+=0',
    })
    this.transform = this.proxyRef._gsap

    // SET POSITION

    this.switchPosition = window.matchMedia('(max-width: 650px)')
    this.handleSwitchPosition(this.switchPosition)
    this.switchPosition.addListener(this.handleSwitchPosition)

    const that = this

    this.dragInstance = Draggable.create(this.proxyRef, {
      trigger: '.collabsList',
      type: 'x',
      // edgeResistance: 0.65,
      inertia: true,
      onPress() {
        that.slideAnimation.kill()
        this.update()
      },
      onDrag: this.updateProgress,
      onThrowUpdate: this.updateProgress,
      snap: {
        x: this.snapX,
      },
    })

    this.animation = gsap.to('.collab', 0.8, {
      xPercent: '+=' + this.numSlides * 100,
      ease: 'none',
      paused: true,
      repeat: -1,
      modifiers: {
        xPercent: this.wrap,
      },
    })

    this.resize()

    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
    this.switchPosition.removeListener(this.handleSwitchPosition)
  },
  methods: {
    wrapPartial(min, max) {
      const r = max - min

      return function (value) {
        const v = value - min

        return ((r + (v % r)) % r) + min
      }
    },
    setPosition(below) {
      for (let i = 0; i < this.numSlides; i++) {
        gsap.set(this.$refs[`post${i}`][0], {
          xPercent: i * 100,
          modifiers: {
            xPercent: this.wrap,
          },
        })
      }
    },
    handleSwitchPosition(mediaQuery) {
      if (mediaQuery.matches) {
        this.setPosition(true)
        this.updateAnimation()
      } else {
        this.setPosition(false)
        this.updateAnimation()
      }
    },
    animateSlides(direction) {
      this.slideAnimation.kill()

      const xVal = parseFloat(
        this.transform.x.substring(0, this.transform.x.length - 2)
      )

      const x = this.snapX(xVal + direction * this.slideWidth)

      this.slideAnimation = gsap.to(this.proxyRef, this.slideDuration, {
        x,
        onUpdate: this.updateProgress,
      })
    },
    snapX(x) {
      return Math.round(x / this.slideWidth) * this.slideWidth
    },
    updateProgress() {
      const xVal = parseFloat(
        this.transform.x.substring(0, this.transform.x.length - 2)
      )

      const xPercentage = xVal / this.wrapWidth

      const trans =
        xPercentage < 0
          ? Math.ceil(xPercentage * -1) + xPercentage
          : xPercentage

      this.animation.progress(trans)
    },
    resize() {
      const xVal = parseFloat(
        this.transform.x.substring(0, this.transform.x.length - 2)
      )

      const norm = xVal / this.wrapWidth || 0

      this.slideWidth = this.$refs.post0[0].getBoundingClientRect().width
      this.wrapWidth = this.slideWidth * this.numSlides

      gsap.set(this.proxyRef, {
        x: norm * this.wrapWidth,
      })

      this.animateSlides(0)
      this.slideAnimation.progress(1)
    },
    handleSlide(direction) {
      this.animateSlides(-direction)
    },
    updateAnimation() {
      this.animation = gsap.to('.collab', 0.8, {
        xPercent: '+=' + this.numSlides * 100,
        ease: 'none',
        paused: true,
        repeat: -1,
        modifiers: {
          xPercent: this.wrap,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.featuredCollabs {
  position: relative;
}

.leftArrow,
.rightArrow {
  position: absolute;
  width: 2rem;
  top: 10rem;
  z-index: 10;
}

.leftArrow {
  left: 1rem;
}

.rightArrow {
  right: 1rem;
}

h2,
h3,
p {
  text-align: center;
}

h2,
h3 {
  text-transform: uppercase;
}

h3,
p {
  margin: 0;
}

p {
  font-size: 1.15rem;
}

h2,
h3 {
  font-size: 2rem;
  line-height: 1;
}

ul {
  margin: 0;
  padding: 0;
  position: relative;
  min-height: 60vh;
  overflow: hidden;
}

.collab {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.collabContent {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .leftImage,
  .rightImage {
    width: 50%;
    overflow: hidden;
    position: relative;
    height: 14rem;
  }

  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: auto;
    min-width: 100%;
    min-height: 100%;
  }

  .content {
    width: 100%;
    margin: 2rem 0 4rem 0;
  }

  .title {
    margin: 0.5rem 0 1.5rem 0;
  }

  .buttonContainer {
    display: flex;
    justify-content: center;
  }
}
</style>
