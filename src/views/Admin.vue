<template lang="pug">
  main.container
    h1 Admin panel
    mainpage
    categories
    products
    messages
    media
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
import messages from "../components/admin/messages";
import media from "../components/admin/media";
import axios from "axios";

export default {
  mounted() {
    this.checkLogIn();
    this.getGeneral();
    this.getTerms();
    this.getProducts();
    this.getCategories();
  },
  components: {
    categories,
    products,
    mainpage,
    terms,
    customCSS,
    messages,
    media,
  },
  computed: {
    ...mapGetters(["isJwtSet", "getBaseUrl", "getLoaded"]),
  },
  methods: {
    ...mapMutations(["setProducts", "setLoading", "setCategories", "setData", "setTerms"]),
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
    getTerms() {
      this.setLoading("terms");
      axios.get(`${this.getBaseUrl}/terms`).then((response) => {
        const resp = response.data;
        if (resp != null) {
          this.setTerms(resp);
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
