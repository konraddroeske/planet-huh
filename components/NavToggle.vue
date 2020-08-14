<template>
  <button id="toggle" class="toggle">
    <span class="toggleText">Cities</span>
    <div class="ballContainer">
      <div id="ball" class="ball"></div>
    </div>
    <span class="toggleText">Moods</span>
  </button>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.toggle {
  width: 162px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  border: none;
  padding: 0;
}

.toggleText {
  display: inline-block;
  text-transform: uppercase;
}

.ballContainer {
  width: 50px;
  border: 1px solid $black;
  border-radius: 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 25px;
  padding: 0 5px;
  //   margin: 0 10px;
}

.ball {
  background-color: $accent;
  border-radius: 50%;
  height: 15px;
  width: 15px;
}
</style>
