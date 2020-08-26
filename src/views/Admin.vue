<template lang="pug">
  main.container
    h1 Admin panel
    categories
    products
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import categories from "../components/admin/categories";
import products from "../components/admin/products";
import pages from "../components/admin/pages";
import axios from "axios";

export default {
  mounted() {
    this.checkLogIn();
    this.getProducts();
    this.getCategories();
  },
  components: {
    categories,
    products,
    pages,
  },
  computed: {
    ...mapGetters(["isJwtSet", "getBaseUrl", "getLoaded"]),
  },
  methods: {
    ...mapMutations(["setProducts", "setLoading", "setCategories"]),
    checkLogIn() {
      if (!this.isJwtSet) this.$router.push({ name: "Login" });
    },
    getProducts() {
      this.setLoading("products");
      axios.get(`${this.getBaseUrl}/products`).then((response) => {
        const resp = response.data;
        if (resp != null) {
          this.setProducts(resp);
        }
      });
    },
    getCategories() {
      if (!this.getLoaded("categories")) {
        this.setLoading("categories");
        axios.get(`${this.getBaseUrl}/categories`).then((response) => {
          const resp = response.data;
          if (resp != null) {
            this.setCategories(resp);
          }
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
