<template lang="pug">
  main.main
    router-link(:to="`/admin/edit/style/`")
      h2.accordion Custom styling
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "./section.scss";
.main {
  a {
    text-decoration: none;
  }
  .accordion {
    &::after {
      content: "\25B6";
      font-size: 0.8em;
      padding-top: 0.1em;
    }
  }
}
</style>
