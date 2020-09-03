<template>
  <div class="contactContainer">
    <Wrapper>
      <div class="content">
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
      <div class="formContainer">
        <form
          method="post"
          name="contact"
          action
          data-netlify="true"
          netlify-honeypot="bot-field"
          @submit.prevent="handleSubmit"
        >
          <input type="hidden" name="form-name" value="contact" />
          <p class="visuallyHidden">
            <label>Don’t fill this out: <input name="bot-field" /></label>
          </p>
          <div class="upperForm">
            <FormulateInput
              v-model="name"
              type="text"
              name="name"
              label="Name"
              validation="required|alpha"
              input-class="inputSmall"
            />
            <FormulateInput
              v-model="email"
              type="email"
              name="email"
              label="Email"
              validation="required|email"
              input-class="inputSmall"
            />
          </div>
          <FormulateInput
            v-model="message"
            type="textarea"
            name="message"
            label="Your Message"
            validation="required|max:300,length"
            input-class="inputLarge"
          />
          <FormulateInput type="submit" label="Submit" class="submitButton" />
        </form>
      </div>
    </Wrapper>
  </div>
</template>

<script>
import axios from "axios"
import { fetchContent } from "@/utils/api"
import Wrapper from "@/components/Wrapper"

export default {
  layout: "default",
  components: {
    Wrapper,
  },
  async asyncData() {
    const { data } = await fetchContent(`{
      contacts {
        id
        title
        description
      }
    }`)

    const { title, description } = data.data.contacts[0]

    return {
      title,
      description,
    }
  },
  data() {
    return {
      title: null,
      description: null,
      name: "",
      email: "",
      message: "",
    }
  },
  transition: {
    enter(el, done) {
      this.$store.dispatch("transitions/setEnter", { el, done })
    },
    leave(el, done) {
      this.$store.dispatch("transitions/setLeave", { el, done })
    },
  },
  activated() {
    this.onMount()
  },
  deactivated() {
    this.onDestroy()
  },
  methods: {
    encode(data) {
      return Object.keys(data)
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        )
        .join("&")
    },
    handleSubmit() {
      const formValues = {
        name: this.name,
        email: this.email,
        message: this.message,
      }

      const axiosConfig = {
        header: { "Content-Type": "application/x-www-form-urlencoded" },
      }
      axios.post(
        "/",
        this.encode({
          "form-name": "contact",
          ...formValues,
        }),
        axiosConfig
      )
    },
    onMount() {
      const nav = document.querySelector("#navContainer")
      nav.addEventListener("click", this.route, false)
      nav.addEventListener("touchstart", this.route, false)
    },
    onDestroy() {
      const nav = document.querySelector("#navContainer")
      nav.removeEventListener("click", this.route, false)
      nav.removeEventListener("touchstart", this.route, false)
    },
    route() {
      this.$router.push({
        path: `/`,
      })
    },
  },
}
</script>

<style lang="scss">
.contactContainer {
  padding-top: 4rem;
  padding-bottom: 2rem;

  @media (min-width: $bp-desktop) {
    padding-bottom: 2rem;
  }

  .content {
    margin-bottom: 2rem;

    h1 {
      text-align: center;
      text-transform: uppercase;
      font-weight: $extrabold;
      font-size: 2.25rem;
      margin-top: 2rem;

      @media (min-width: $bp-desktop) {
        font-size: 3.5rem;
        margin-top: 6rem;
      }
    }

    p {
      // font-size: $font-sm;
      margin: 0;
    }
  }

  .formContainer {
    .formulate-input {
      margin-bottom: 1.5rem;
    }

    .formulate-input-wrapper {
      display: flex;
      flex-direction: column;
    }

    .formulate-input-label {
      font-family: $font-sans;
      text-transform: uppercase;
      font-weight: $bold;
      font-size: $font-x-sm;
      padding-bottom: 0.3rem;
    }

    .inputSmall,
    .inputLarge {
      border: 2px solid $accent;
      border-radius: 8px;
      width: 100%;
      padding: 0.6rem;
      font-family: $font-display;
      font-size: $font-sm;
    }

    .inputLarge {
      min-height: 8rem;
    }

    .formulate-input-errors {
      font-size: $font-x-sm;
    }

    .formulate-input-element--submit {
      display: flex;
      justify-content: center;
    }

    .submitButton {
      margin: 0;
      padding: 3rem 0;
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
}

@media (min-width: $bp-tablet) {
  .contactContainer {
    .wrapper {
      max-width: 1000px;
    }

    .content {
      margin-bottom: 3rem;
    }

    .upperForm {
      display: flex;
      justify-content: space-between;

      .formulate-input {
        width: calc(50% - 1rem);
      }
    }
  }
}
</style>
