<template>
  <div class="curator">
    <div class="upper">
      <LazyImage
        class="artistImage"
        :src="artist.picture.url"
        :alt="artist.name"
        :max-width="1000"
      />
    </div>
    <div class="lower">
      <div class="name">{{ artist.name }}</div>
      <div class="city">{{ artist.location }}</div>
      <div class="links">
        <div class="website">
          <h4 class="accentText">Website</h4>
          <a :href="artist.website">{{ websiteFormatted }}</a>
        </div>
        <div class="social">
          <h4 class="accentText">Social</h4>
          <a :href="artist.socialUrl">@{{ artist.social }}</a>
        </div>
      </div>
      <div class="about">
        <h4 class="accentText">About</h4>
        <p>
          {{ artist.about }}
        </p>
      </div>
      <Button>Show {{ artist.name }} list</Button>
    </div>
  </div>
</template>

<script>
import LazyImage from "@/components/LazyImage"
import Button from "@/components/Button"

export default {
  components: {
    LazyImage,
    Button,
  },
  props: {
    artist: {
      type: Object,
      default: () => {
        return {
          name: {
            type: String,
            required: true,
          },
          location: {
            type: String,
            required: true,
          },
          website: {
            type: String,
            required: false,
            default: null,
          },
          social: {
            type: String,
            required: false,
            default: null,
          },
          socialUrl: {
            type: String,
            required: false,
            default: null,
          },
          about: {
            type: String,
            required: true,
          },
        }
      },
    },
  },
  computed: {
    websiteFormatted() {
      return this.artist.website.replace(/^https?:\/\//i, "")
    },
  },
}
</script>

<style lang="scss" scoped>
.curator {
  width: 100%;
  display: flex;
  flex-direction: column;

  .upper {
    width: 100%;
    height: 20rem;
    position: relative;
  }

  img {
    display: block;
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .lower {
    padding: 2rem;
  }

  .links {
    display: flex;
  }

  .website,
  .social {
    width: 50%;
  }

  h4 {
    margin-bottom: 0;
  }

  button {
    margin: 0 auto;
    display: block;
    align-self: center;
  }

  .about p {
    margin-top: 0;
  }

  a,
  span {
    font-family: $font-display;
    font-size: 1.25rem;
    font-weight: $semibold;
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
