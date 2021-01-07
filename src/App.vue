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
    ...mapGetters(["getBaseUrl", "getLang", "getCSS"]),
  },
  updated() {
    this.checkPath();
  },
  methods: {
    ...mapMutations(["setData","setTerms", "setCategories", "setLang"]),
    getData() {
      this.getHomeData();
      this.getTerms();
      this.getCategories();
    },
    getTerms(){
      axios.get(`${this.getBaseUrl}/terms`).then((response) => {
        const resp = response.data;
        if (resp != null) {
          this.setTerms(resp);
        }
      });
    },
    getHomeData() {
      axios.get(`${this.getBaseUrl}/home`).then((response) => {
        const resp = response.data;
        if (resp != null) {
          this.setData(resp);
          this.applyCSS();
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
      if (this.getLang == false) {
        const userLang = navigator.language.split("-")[0];
        if (userLang == "it") {
          this.setLang("it");
        } else {
          this.setLang("en");
        }
      }
    },
    applyCSS(){ 
      const head = document.head;
      let customCSS = document.createElement("style");

      customCSS.type = "text/css";
      customCSS.innerText = this.getCSS.css;

      head.appendChild(customCSS);
      this.triggerResize()
    },
    triggerResize(){
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    }
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
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.title {
  text-transform: uppercase;
}
</style>
