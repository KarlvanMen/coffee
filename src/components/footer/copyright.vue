<template lang="pug">
    .bottom
        .copyrights {{copyrights}}
        p.text {{text}}
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data: () => {
    return {
      copyrights: "",
      text: "",
    };
  },
  computed: {
    ...mapGetters(["getDataLoaded", "getCopyright", "getLang"]),
  },
  watch: {
    getLang(val) {
      const text = this.getCopyright;
      this.copyrights = val == "it" ? text.Copyright_IT : text.Copyright_EN;
      this.text = val == "it" ? text.Other_IT : text.Other_EN;
    },
  },
  methods: {
    getText() {
      if (this.getDataLoaded) {
        let text = this.getCopyright;
        if (text) {
          this.copyrights = text.Copyright_EN;
          this.text = text.Other_EN;
        }
      } else {
        setTimeout(() => {
          this.getText();
        }, 100);
      }
    },
  },
  mounted() {
    this.getText();
  },
};
</script>
<style lang="sass" scoped>
.bottom
    padding: 2em 0
</style>
