<template lang="pug">
  #app
    Header(ref="header" v-if="showHeadAndFoot")
    router-view
    Footer(v-if="showHeadAndFoot")
</template>

<script>
import Header from '@/components/header'
import Footer from "@/components/footer"

export default {
  name: 'App',
  data: ()=>{
    return {
      showHeadAndFoot: true
    }
  },
  components: {
    Header,
    Footer
  },
  mounted(){
    this.checkPath()
  },
  updated(){
    this.checkPath()
  },
  methods: {
    checkPath(){
      const routeName = this.$route.name
      if (routeName == 'Login' || routeName == 'Admin' || routeName == 'Edit Product') {
        this.showHeadAndFoot = false
      } else {
        this.showHeadAndFoot = true
      }
    }
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
