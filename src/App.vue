<template lang="pug">
  #app
    Header(ref="header" v-if="showHeadAndFoot")
    router-view
    Footer(v-if="showHeadAndFoot")
</template>

<script>
import axios from "axios";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "App",
  data: () => {
    return {
      showHeadAndFoot: true,
    };
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    this.checkPath();
    this.getData();
    this.checkLang();
  },
  computed: {
    ...mapGetters(["getBaseUrl"]),
  },
  updated() {
    this.checkPath();
  },
  methods: {
    ...mapMutations(["setData", "setCategories", "setLang"]),
    getData() {
      this.getHomeData();
      this.getCategories();
    },
    getHomeData() {
      axios.get(`${this.getBaseUrl}/home`).then((response) => {
        const resp = response.data;
        if (resp != null) {
          this.setData(resp);
        }
      });
    },
    getCategories() {
      axios.get(`${this.getBaseUrl}/categories`).then((response) => {
        const resp = response.data;
        if (resp != null) {
          this.setCategories(resp);
        }
      });
    },
    checkPath() {
      const routeName = this.$route.name;
      if (routeName == "Product" || routeName == "Home") {
        this.showHeadAndFoot = true;
      } else {
        this.showHeadAndFoot = false;
      }
    },
    checkLang() {
      const userLang = navigator.language.split("-")[0];
      if (userLang == "it") {
        this.setLang("it");
      } else {
        this.setLang("en");
      }
    },
  },
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  font-size: 16px;
}
* {
  box-sizing: border-box;
  transition: all 0.3s;
}
a {
  color: inherit;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.title {
  text-transform: uppercase;
}
</style>
