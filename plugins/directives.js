import Vue from "vue"

Vue.directive("showButKeepInner", {
  bind(el, bindings) {
    bindings.def.wrap = function (el) {
      // Find all next siblings with data-moved and move back into el
      while (el.nextElementSibling && el.nextElementSibling.dataset.moved) {
        el.appendChild(el.nextElementSibling).removeAttribute("data-moved")
      }
      el.hidden = false
    }

    bindings.def.unwrap = function (el) {
      // Move all children of el outside and mark them with data-moved attr
      Array.from(el.children).forEach((child) => {
        el.insertAdjacentElement("afterend", child).setAttribute(
          "data-moved",
          true
        )
      })
      el.hidden = true
    }
  },

  inserted(el, bindings) {
    bindings.def[bindings.value ? "wrap" : "unwrap"](el)
  },

  update(el, bindings) {
    bindings.def[bindings.value ? "wrap" : "unwrap"](el)
  },
})
