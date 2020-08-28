<template>
  <span>{{ date }}</span>
</template>

<script>
import moment from "moment"
export default {
  props: {
    input: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    date() {
      return moment(this.$props.input).format("MMMM D, YYYY")
    },
  },
}
</script>

<style lang="scss" scoped></style>
