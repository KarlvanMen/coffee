<template lang="pug">
  main.main
    h2.accordion(v-on:click="toggleAccordion()") Products
    .products.panel
        .add-new.content
            .icon-container.plus
                font-awesome-icon.icon(:icon="['fas', 'plus-circle']")
        router-link.content(v-for="product in products" :to="`/admin/edit/product/${product.id}`")
            .icon-container.edit
                font-awesome-icon.icon(:icon="['fas', 'edit']")
            h4 {{product.Title_EN}}
            img(:src="product.Image.url")
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Products",
  data() {
    return {
      products: [],
    };
  },
  computed: {
    ...mapGetters(["getProducts", "getLoaded"]),
  },
  mounted() {
    this.drawProducts();
  },
  methods: {
    drawProducts() {
      if (this.getLoaded("products")) {
        this.products = this.getProducts;
      } else {
        setTimeout(() => {
          this.drawProducts();
        }, 100);
      }
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
