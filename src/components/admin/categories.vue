<template lang="pug">
  main.main
    h2.accordion(v-on:click="toggleAccordion()") Categories
    .categories.panel
        .add-new.content
            .icon-container.plus
                font-awesome-icon.icon(:icon="['fas', 'plus-circle']")
        router-link.content(v-for="cat in categories" :to="`/admin/edit/category/${cat.id}`")
            .icon-container.edit
                font-awesome-icon.icon(:icon="['fas', 'edit']")
            h4 {{cat.Title_EN}}
            img(:src="getBaseUrl + cat.Image.url")
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Categories",
  data() {
    return {
      categories: [],
    };
  },
  computed: {
    ...mapGetters(["getBaseUrl", "getCategories", "getLoaded"]),
  },
  mounted() {
    this.drawCategories();
  },
  methods: {
    drawCategories() {
      if (this.getLoaded("categories")) {
        if (this.getCategories) {
          this.categories = this.getCategories;
        }
      } else {
        setTimeout(() => {
          this.drawCategories();
        }, 100);
      }
    },
    getUrl(url) {
      return this.getBaseUrl + url;
    },
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
