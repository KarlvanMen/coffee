<template lang="pug">
  main.container
    h1 Admin panel
    mainpage
    categories
    products
    terms
    customCSS
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import categories from "../components/admin/categories";
import products from "../components/admin/products";
import mainpage from "../components/admin/mainPage";
import terms from "../components/admin/terms";
import customCSS from "../components/admin/customCSS";
import axios from "axios";

export default {
  mounted() {
    this.checkLogIn();
    this.getGeneral();
    this.getProducts();
    this.getCategories();
  },
  components: {
    categories,
    products,
    mainpage,
    terms,
    customCSS,
  },
  computed: {
    ...mapGetters(["isJwtSet", "getBaseUrl", "getLoaded"]),
  },
  methods: {
    ...mapMutations(["setProducts", "setLoading", "setCategories", "setData"]),
    checkLogIn() {
      if (!this.isJwtSet) this.$router.push({ name: "Login" });
    },
    getGeneral() {
      this.setLoading("general");
      axios.get(`${this.getBaseUrl}/home`).then((response) => {
        const resp = response.data;
        if (resp != null) {
          this.setData(resp);
        }
      });
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
      this.setLoading("categories");
      axios.get(`${this.getBaseUrl}/categories`).then((response) => {
        const resp = response.data;
        if (resp != null) {
          this.setCategories(resp);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
