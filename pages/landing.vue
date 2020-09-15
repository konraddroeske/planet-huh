<template>
  <Wrapper>
    <div class="landing">
      <header>
        <Logo />
      </header>
      <main>
        <div v-if="!isSubmitted" class="formContainer">
          <form
            method="post"
            name="landing"
            action
            data-netlify="true"
            netlify-honeypot="bot-field"
            @submit.prevent="handleSubmit"
          >
            <input type="hidden" name="form-name" value="landing" />
            <p class="visuallyHidden">
              <label>Don’t fill this out: <input name="bot-field" /></label>
            </p>
            <div class="upperForm">
              <span class="formText">I feel </span>
              <FormulateInput
                v-model="mood"
                type="text"
                name="mood"
                label="Mood"
                input-class="inputSmall"
                :error="moodEmpty ? 'Please enter a mood.' : null"
              />
              <span class="formText">in</span>
              <FormulateInput
                v-model="city"
                type="text"
                name="city"
                label="City"
                input-class="inputSmall"
                :error="cityEmpty ? 'Please enter a city.' : null"
              />
              <span class="formText period">.</span>
            </div>
            <FormulateInput type="submit" label="Submit" class="submitButton" />
          </form>
        </div>
        <div v-else class="response">
          <div v-if="isSuccess" class="success">
            <h2>
              <span class="line"
                >Thanks for telling us about how you feel.</span
              >
              <span class="line">Come back soon for the full experience.</span>
            </h2>
          </div>
          <div v-else class="fail">
            <h2 class="line">
              Sorry, something went wrong. Please try again soon.
            </h2>
          </div>
        </div>
      </main>
      <footer>
        <div class="disclaimer">
          <div class="line1">
            The information collected will only be used by HUH/<span
              class="italic"
              >Somewherelse</span
            >.
          </div>
          <div class="line2">
            By submitting, you consent to the use of your data for creative and
            marketing purposes.
          </div>
        </div>
        <Credit />
      </footer>
    </div>
  </Wrapper>
</template>

<script>
import axios from "axios"
import Wrapper from "@/components/Wrapper"
import Logo from "@/components/Logo"
import Credit from "@/components/Credit"
export default {
  layout: "landing",
  components: {
    Logo,
    Credit,
    Wrapper,
  },
  data() {
    return {
      mood: "",
      moodEmpty: false,
      city: "",
      cityEmpty: false,
      isSubmitted: false,
      isSuccess: true,
    }
  },
  methods: {
    encode(data) {
      return Object.keys(data)
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        )
        .join("&")
    },
    resetForm() {
      this.isSubmitted = false
      this.isSuccess = true
      this.mood = ""
      this.city = ""
    },
    handleSubmit() {
      // if field is not filled is not filled out
      if (this.mood.length === 0) this.moodEmpty = true
      if (this.city.length === 0) this.cityEmpty = true

      if (this.mood.length > 0 && this.city.length > 0) {
        const formValues = {
          mood: this.mood,
          city: this.city,
        }

        this.isSubmitted = true

        const axiosConfig = {
          header: { "Content-Type": "application/x-www-form-urlencoded" },
        }

        axios
          .post(
            "/",
            this.encode({
              "form-name": "contact",
              ...formValues,
            }),
            axiosConfig
          )
          .then(() => {
            this.isSuccess = true
          })
          .catch(() => {
            this.isSuccess = false
          })
      }
    },
  },
}
</script>

<style lang="scss">
.landing {
  min-height: 100vh;
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  justify-content: space-between;
  padding: 5rem 0;

  header {
    display: flex;
    justify-content: center;

    .logo {
      transform: scale(1.4);
    }
  }

  .disclaimer,
  .credit {
    font-weight: 100;
  }

  .disclaimer {
    font-size: $font-disclaimer;

    text-align: center;
    color: $mediumGray;
    font-family: $font-display;
  }

  .credit {
    text-transform: uppercase;
    transform: scale(0.5);
    margin-top: 1.5rem;
  }

  .formContainer {
    padding: 3rem 0;

    .upperForm {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .formulate-input {
      // margin-bottom: 4rem;
      margin-bottom: 5rem;
      margin-top: 1rem;
      display: block;
      flex-grow: 1;
      width: 100%;
      position: relative;
    }

    .formulate-input-wrapper {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .formulate-input-label {
      font-family: $font-sans;
      text-transform: uppercase;
      font-weight: $bold;
      font-size: 0.4rem;
      color: $gray;
      position: absolute;
      top: calc(100% + 0.3rem);
      left: 50%;
      transform: translateX(-50%);
    }

    .formText {
      white-space: nowrap;
    }

    .formText,
    .inputSmall {
      border: 1px solid transparent;
      padding: 0.6rem;
      font-family: $font-display;
      font-size: 1.2rem;
      text-align: center;
    }

    .inputSmall {
      border-bottom: 1px solid $black;
      width: 100%;
      font-weight: 100;
      color: $gray;
      background-color: transparent;
    }

    .formulate-input-errors {
      position: absolute;
      padding: 0;
      top: calc(100% + 1rem);
      font-size: $font-x-sm;
    }

    .formulate-input-element--submit {
      display: flex;
      justify-content: center;
    }

    .submitButton {
      margin: 0;
      padding: 0;
      padding-top: 2rem;
    }

    .period {
      display: none;
    }

    button {
      border: 2px solid $accent;
      border-radius: 180px;
      padding: 1rem 3rem;
      background: transparent;
      cursor: pointer;
      text-transform: uppercase;
      font-weight: $bold;
      font-size: 1.25rem;

      &:hover,
      &:focus {
        color: $white;
        background: $accent;
      }
    }
  }

  .response {
    padding: 0;
  }

  .line {
    display: inline;
    line-height: 1.2;
  }

  .success,
  .fail {
    h2 {
      margin-top: 0;
      font-family: $font-display;
      font-size: 1.2rem;
      text-align: center;
      font-weight: 100;
    }
  }
}

@media (min-width: $bp-tablet) {
  .landing {
    max-width: 1000px;

    .formContainer {
      .upperForm {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;

        .formulate-input {
          width: auto;
          margin: 0;
        }
      }

      .submitButton {
        padding-top: 6rem;
      }

      .period {
        display: inline;
      }
    }

    .line {
      display: block;
    }
  }
}
</style>
