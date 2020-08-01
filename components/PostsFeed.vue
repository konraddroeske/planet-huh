<template>
  <section>
    <Wrapper>
      <h2 class="visuallyHidden">Posts Feed</h2>
      <ul>
        <li v-for="post in formattedPosts" :key="post.id" class="postContainer">
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
          <p class="postTags">{{ post.tags.join(', ') }}</p>
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

ul {
  list-style: none;
  padding-left: 0;
}

.postContainer {
  margin-bottom: 4rem;
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
}

.postTitle {
  font-weight: $medium;
  font-size: 1.75rem;
  margin: 1rem 0;
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
}
</style>
