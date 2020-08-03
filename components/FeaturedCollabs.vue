<template>
  <section class="featuredCollabs">
    <h2 class="title">Featured Collabs</h2>
    <div class="leftArrow"><LeftArrow /></div>
    <div class="rightArrow"><RightArrow /></div>
    <ul class="collabsList">
      <li v-for="post of posts" :key="post.id" class="collab">
        <div class="leftImage">
          <img class="postImage" :src="post.images[0].url" :alt="post.title" />
        </div>
        <div class="rightImage">
          <img class="postImage" :src="post.images[1].url" :alt="post.title" />
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
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex'
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
  computed: {
    ...mapState({
      posts: (state) => state.homepage.featuredCollabPosts,
    }),
  },
  mounted() {
    console.log(this.posts)
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
}

li {
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
    height: 100%;
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
