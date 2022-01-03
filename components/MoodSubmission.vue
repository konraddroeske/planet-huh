<template>
  <div class="moodSubmission">
    <div class="text">
      <h3 class="title">How are <span>you feeling?</span></h3>
      <nuxt-link to="/submit-mood" class="link">Submit your mood</nuxt-link>
    </div>
    <video id="moodVid" autoplay loop muted playsinline>
      <source src="@/assets/video/mood.mp4" type="video/mp4" />
    </video>
  </div>
</template>

<script>
export default {
  activated() {
    const video = document.getElementById("moodVid")
    video.play()
  },
}
</script>

<style lang="scss" scoped>
.moodSubmission {
  position: relative;
  width: 100%;
  margin: 0 auto;

  video {
    width: 100%;
    display: block;
  }
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
