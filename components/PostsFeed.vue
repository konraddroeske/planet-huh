<template>
  <section>
    <Wrapper>
      <h2 class="visuallyHidden">Posts Feed</h2>
      <ul class="postList">
        <li
          v-for="(post, index) of formattedPosts"
          :key="post.id"
          class="postContainer"
          :class="{
            portraitMode: post.coverImage.height >= post.coverImage.width,
            isOddLastPost:
              index % 2 === 0 && index === formattedPosts.length - 1,
          }"
        >
          <nuxt-link :to="`/post/${post.slug}`">
            <img
              class="postImage"
              :src="post.coverImage.url"
              :alt="post.title"
            />
          </nuxt-link>
          <p class="postDate">{{ post.date }}</p>
          <h3 class="postTitle">
            <nuxt-link :to="`/post/${post.slug}`" class="postLink">
              {{ post.title }}
            </nuxt-link>
          </h3>
          <p class="postTags">
            {{ post.city }}, {{ post.sense }}, {{ post.mood }}
          </p>
        </li>
      </ul>
      <Button
        v-if="!allPostsFetched"
        ref="load"
        :on-click="getSomePostsAndUnfocus"
      >
        Load More
      </Button>
    </Wrapper>
  </section>
</template>

<script>
import moment from 'moment'
import Wrapper from '@/components/Wrapper'
import Button from '@/components/Button'
export default {
  components: { Wrapper, Button },
  props: {
    posts: {
      type: Array,
      required: true,
    },
    getSomePosts: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      allPostsFetched: false,
    }
  },
  computed: {
    formattedPosts() {
      return this.$props.posts.map((post) => ({
        ...post,
        date: moment(post.date).format('MMMM D, YYYY'),
        city: 'Toronto',
      }))
    },
  },
  watch: {
    posts(oldPosts, newPosts) {
      if (oldPosts.length === newPosts.length) {
        this.allPostsFetched = true
      }
    },
  },
  created() {
    this.$props.getSomePosts()
  },
  methods: {
    getSomePostsAndUnfocus() {
      this.$refs.load.$el.blur()
      this.$props.getSomePosts()
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
  list-style: none;
  padding-left: 0;

  @media (min-width: $bp-desktop) {
    margin-bottom: 10rem;
    display: flex;
    flex-wrap: wrap;
  }
}

.postContainer {
  margin-bottom: 4rem;

  @media (min-width: $bp-desktop) {
    margin-bottom: 15rem;
  }

  @media (min-width: $bp-lg-desktop) {
    margin-bottom: 17.5rem;
  }
}

.postContainer:nth-child(odd) {
  @media (min-width: $bp-desktop) {
    flex: 1 0 calc(50% - 1.25rem);
    margin-right: 2.5rem;
  }
}

.postContainer:nth-child(even) {
  @media (min-width: $bp-desktop) {
    flex: 1 0 calc(50% - 1.25rem);
    position: relative;
    top: 12.5rem;
  }

  @media (min-width: $bp-lg-desktop) {
    top: 20rem;
  }
}

.portraitMode:nth-child(odd),
.portraitMode:nth-child(even) {
  @media (min-width: $bp-desktop) {
    flex: 1 0 10%;
  }
}

.isOddLastPost {
  @media (min-width: $bp-desktop) {
    max-width: 50%;
  }
}

.postImage {
  width: 100%;
  margin-bottom: 1rem;
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
  font-weight: $medium;
  font-size: 1.75rem;
  margin: 1rem 0;

  @media (min-width: $bp-desktop) {
    text-align: left;
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
  margin: 0;

  @media (min-width: $bp-desktop) {
    text-align: left;
  }
}
</style>
