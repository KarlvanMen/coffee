<template lang="pug">
    .container
        router-link.logo(to="/" v-bind:style="{ backgroundImage: `url(${getBaseUrl + logo})` }")
        .lang
            .language(v-for="language in lang" ) {{language.title}}
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Header",
  data: () => {
    return {
      lang: [],
      logo: "",
    };
  },
  computed: {
    ...mapGetters(["getNavigation", "getDataLoaded", "getBaseUrl"]),
  },
  methods: {
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
  },
  mounted() {
    this.getHeader();
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/common.scss";
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  margin-left: 50%;
  color: #fff;
  .logo {
    background-size: contain;
    background-repeat: no-repeat;
    width: 150px;
    height: 150px;
    transform: translateX(-50%);
  }
  .lang {
    margin: 0 20px;
    z-index: 100;
    .language {
      margin: 0 0 0 0.5em;
      display: inline-block;
      transition: all 0.3s;
      &:hover {
        color: $coffee-brown-light;
      }
    }
  }
}
</style>
