<template>
  <div class="container">
    <Wrapper>
      <h1>Huh?</h1>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe maiores
        non ut provident, exercitationem sit vitae optio excepturi nihil aliquid
        magni, sint ea totam. Earum, officiis. Exercitationem alias, amet, sed
        quos eligendi eum dolorem dolore itaque quas inventore vero architecto
        corporis natus, ut accusantium fuga molestias quod? Earum, magnam
        pariatur!
      </p>
      <Button :to="{ name: 'cities' }">Learn More</Button>
    </Wrapper>
  </div>
</template>

<script>
import Wrapper from './Wrapper'
import Button from './Button'
export default { components: { Wrapper, Button } }
</script>

<style lang="scss" scoped>
.container {
  text-align: center;
  margin: 5rem 0;

  @media (min-width: $bp-desktop) {
    width: 50%;
    margin: 5rem auto;
  }
}

h1 {
  text-transform: uppercase;
  font-weight: $extrabold;
  font-size: 3rem;
}

p {
  margin-bottom: 2rem;
}
</style>
