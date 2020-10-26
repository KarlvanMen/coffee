<template lang="pug">
  main.edit
    edit_head(@save="update()")
    h2 Edit 
      u Custom Style
    p
      i Add #app at the beginning to override default styles
    .edit
      .section
        .label Styling
        textarea.style.long(v-model="getCSS.css")
        .error(:class="{active: error, open: hover}")
          .container(@mouseover="hover = true" @mouseleave="hover = false")
            .message(v-for="msg in errorMsg" v-html="msg")
          .icon
            font-awesome-icon.exclamation-icon(:icon="['fas', 'exclamation-triangle']" @mouseover="hover = true" @mouseleave="hover = false")
</template>

<script>
import axios from "axios";
import edit_head from "./edit_head.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "Custom_CSS",
  data() {
    return {
      error: false,
      errorMsg: [],
      hover: false,
    };
  },
  components: { edit_head },
  mounted() {},
  computed: {
    ...mapGetters(["getCSS", "getData", "getBaseUrl", "getJwt"]),
  },
  watch: {},
  methods: {
    ...mapMutations(["setCSS", "setNotLoaded"]),
    update() {
      this.validateStyle();
    },
    getStyle() {
      if (this.getCSS.css === false) {
        setTimeout(() => {
          this.getStyle();
        }, 1000);
      } else {
        this.validateStyle();
      }
    },
    validateStyle() {
      const css = this.getCSS.css.replace(/;/g, "");
      const self = this;
      axios
        .get(
          `https://jigsaw.w3.org/css-validator/validator?profile=css3&usermedium=screen&output=json&text=${css}`
        )
        .then((response) => {
          const data = response.data.cssvalidation;
          if (data.result.errorcount == 0) {
            self.updateCSS();
          } else {
            let realError = false;
            let errors = data.errors;
            for (let i = 0; i < errors.length; i++) {
              const error = errors[i];
              if (error.type == "generator.unrecognize") {
                errors.splice(i, 1);
              } else {
                realError = true;
              }
            }
            if (realError) {
              self.showError(errors);
            } else {
              self.updateCSS();
            }
          }
        });
    },
    showError(errors) {
      this.error = true;
      this.errorMsg = [];
      for (let i = 0; i < errors.length; i++) {
        const error = errors[i];
        let message = `
          <p>Context: ${error.context}</p>
          <p>${error.message}</p>
          <br>
          `;
        this.errorMsg.push(message);
      }
    },
    updateCSS() {
      this.error = false;
      const baseURL = this.getBaseUrl;
      const changes = {
        CustomCSS: {
          css: this.getCSS.css,
        },
      };
      axios
        .put(`${baseURL}/home`, changes, {
          headers: { Authorization: `Bearer ${this.getJwt}` },
        })
        .then(() => {
          this.setNotLoaded("general");
          this.$router.push({ name: "Admin" });
        });
    },
  },
};
</script>

<style lang="scss">
@import "./edit.scss";
.section {
  position: relative;
  .error {
    position: absolute;
    top: auto;
    left: auto;
    right: 10px;
    bottom: 10px;
    .icon {
      text-align: right;
      opacity: 0.6;
    }
    .container {
      display: none;
      padding: 1px 10px;
      border-radius: 3px;
      text-align: left;
      max-height: 250px;
      overflow: auto;
    }
    &.active {
      .icon {
        opacity: 1;
        color: red;
        .exclamation-icon {
          cursor: pointer;
        }
      }
      &.open {
        .container {
          display: block;
          background: #cccccc;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
