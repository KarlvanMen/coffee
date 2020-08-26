<template lang="pug">
  main.main
    h2.accordion(v-on:click="toggleAccordion()") Pages
    .pages.panel
        .add-new.content
            .icon-container.plus
                font-awesome-icon.icon(:icon="['fas', 'plus-circle']")
        router-link.content(v-for="page in pages" :to="`/admin/edit/page/${page.id}`")
            .icon-container.edit
                font-awesome-icon.icon(:icon="['fas', 'edit']")
            h4 {{page.title}}
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "Pages",
  data() {
    return {
      pages: [
        {
          title: "Home",
          id: "home",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["getBaseUrl"]),
  },
  mounted() {},
  methods: {
    toggleAccordion() {
      this.$el.querySelector(".accordion").classList.toggle("active");

      const panel = this.$el.querySelector(".panel");
      if (panel) {
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./section.scss";
</style>
