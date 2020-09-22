<template lang="pug">
  main.main
    h2.accordion(v-on:click="toggleAccordion()") Categories
    .categories.panel
        router-link.add-new.content(:to="'/admin/new/category/'")
            .icon-container.plus
                font-awesome-icon.icon(:icon="['fas', 'plus-circle']")
        router-link.content(v-for="cat in categories" :to="`/admin/edit/category/${cat.id}`" :key="cat.id")
            .icon-container.edit
                font-awesome-icon.icon(:icon="['fas', 'edit']")
            h4 {{cat.Title_EN}}
            img(:src="cat.Image.url" v-if="cat.Image")
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Categories",
  data() {
    return {
      categories: [],
      counter: 0,
    };
  },
  computed: {
    ...mapGetters(["getCategories", "getLoaded"]),
  },
  mounted() {
    this.drawCategories();
  },
  methods: {
    drawCategories() {
      if (this.getLoaded("categories")) {
        this.counter++;
        if (this.getCategories) {
          this.categories = [];
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
      this.$el.classList.toggle("active");

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
