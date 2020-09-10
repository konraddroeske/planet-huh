import Vue from "vue"
import LazyImage from "@/components/LazyImage"

const components = { LazyImage }

// Registers components to be used globally
// without requiring explicit imports into files
Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
