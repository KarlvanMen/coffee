<template lang="pug">
  #app
    Header(ref="header")
    router-view
    Footer
</template>

<script>
import Header from '@/components/header'
import Footer from "@/components/footer"

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }

}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  font-size: 16px;
}
*{
  box-sizing: border-box;
  transition: all .3s;
}
a{
  color: inherit;
}
#app{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.title{
  text-transform: uppercase
}
</style>
