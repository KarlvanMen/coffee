<template lang="pug">
    .container
      .empty
      router-link.logo(to="/" v-bind:style="{ backgroundImage: `url(${logo})` }")
      .lang
        .language(v-for="language in lang" :class="{white: $route.path == '/', active: getLang == language.lang}" @click="changeLang(language.lang)") {{language.title}}
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "Header",
  data: () => {
    return {
      lang: [],
      logo: "",
    };
  },
  computed: {
    ...mapGetters(["getNavigation", "getDataLoaded", "getCSS", "getLang"]),
  },
  methods: {
    ...mapMutations(["setLang"]),
    getHeader() {
      if (!this.getDataLoaded) {
        setTimeout(() => {
          this.getHeader();
        }, 100);
      } else {
        let data = this.getNavigation;
        if (data) {
          this.lang = data.Languages.lang;
          this.logo = data.Logo.url;
        } else {
          console.log(data);
        }
      }
    },
    changeLang(lang) {
      this.setLang(lang);
    },
    loadStyle() {
      if (!this.getDataLoaded) {
        setTimeout(() => {
          this.getHeader();
        }, 100);
      } else {
        let element = document.createElement("style");
        element.innerHTML = this.getCSS.css;
        document.getElementsByTagName("head")[0].appendChild(element);
      }
    },
  },
  mounted() {
    this.loadStyle();
    this.getHeader();
  },
  updated: function() {
    this.$nextTick(function() {
      this.loadStyle();
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/common.scss";
.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 5px 0;
  max-width: $max-content-width-larger;
  margin: 0 auto;
  .logo {
    background-size: contain;
    background-repeat: no-repeat;
    width: 150px;
    height: 150px;
    max-width: 75%;
  }
  .empty,
  .lang {
    width: 5em;
  }
  .lang {
    margin: 0 20px;
    z-index: 100;
    text-align: right;
    .language {
      margin: 0 0 0 0.5em;
      display: inline-block;
      cursor: pointer;
      &.white {
        color: #fff;
      }
      &:hover {
        color: $coffee-brown-light;
      }
      &.active {
        font-weight: bold;
        border-bottom: 2px solid;
      }
    }
  }
}
</style>
