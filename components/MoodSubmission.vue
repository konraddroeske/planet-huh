<template>
  <div class="moodSubmission">
    <div class="text">
      <h3 class="title">How are <span>you feeling?</span></h3>
      <li @click="getCookie">
        <nuxt-link to="/submit-mood" class="link"> Submit your mood </nuxt-link>
      </li>
    </div>

    <video id="moodVid" autoplay loop muted playsinline>
      <source src="@/assets/video/mood.mp4" type="video/mp4" />
    </video>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  computed: {
    ...mapState(["saved"]),
  },
  activated() {
    const video = document.getElementById("moodVid")
    video.play()
  },

  methods: {
    getVisit() {
      const now = new Date().getTime()
      localStorage.setItem("visitTime", now)
    },
    getCookie() {
      if (this.saved === null) {
        this.getVisit()

        // if localStorage.saved doesn't exist, add date.now()
        this.$store.commit("setSavedCookie", {
          cookie: localStorage.getItem("visitTime"),
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
li {
  list-style-type: none;
}
.overlay {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal {
  position: relative;
  width: 300px;
  z-index: 9999;
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #fff;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
}
.moodSubmission {
  position: relative;
  width: 100%;
  margin: 0 auto;
  // z-index: 100;

  video {
    width: 100%;
    display: block;
    max-height: 100vh;
  }
}
.overlay {
  z-index: 500;
  background: white;
  border: 1px solid black;
  width: 500px;
  height: 200px;
}

.text {
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: $z-above;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-transform: uppercase;

  .title {
    font-size: $font-lg;
    text-align: center;
    margin: 1rem 0;
  }

  span {
    display: block;
  }

  .link {
    color: black;
    font-weight: 600;
  }
}

@media (min-width: $bp-tablet) {
  .text {
    .title {
      font-size: 4rem;
      margin: 1.5rem 0;
    }

    .link {
      font-size: $font-sm-md;
    }
  }
}

@media (min-width: $bp-desktop) {
  .moodSubmission {
    width: 75%;
    max-width: 70rem;
  }
}
</style>
