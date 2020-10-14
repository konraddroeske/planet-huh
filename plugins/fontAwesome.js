import Vue from "vue"
import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faFacebookF,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

library.add(faFacebookF, faTwitter, faInstagram, faEnvelope)

Vue.component("FontAwesomeIcon", FontAwesomeIcon)
