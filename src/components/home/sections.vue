<template lang="pug">
    .content
        section.products
            router-link.product(v-for="product in products" :to="product.link" :key="product.link")
                .product-img(v-bind:style="{ backgroundImage: `url(${product.img})` }")
                h3.title {{getLang == "it" ? product.title_IT : product.title_EN}}
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "Sections",
  data() {
    return {
      products: [],
    };
  },
  computed: {
    ...mapGetters([
      "getSections",
      "getSectionsLoaded",
      "getCategories",
      "getCategoriesLoaded",
      "getLang",
    ]),
  },
  mounted() {
    this.drawSections();
  },
  methods: {
    drawSections() {
      if (!this.getSectionsLoaded) {
        setTimeout(() => {
          this.drawSections();
        }, 100);
      } else {
        let sections = this.getSections;
        if (sections) {
          this.products = [];
          const categories = sections.Categories;
          for (let i = 0; i < categories.categories.length; i++) {
            const category = categories.categories[i];
            this.getCategory(category);
          }
        } else {
          console.log(sections);
        }
      }
    },
    getCategory(id) {
      if (!this.getCategoriesLoaded) {
        setTimeout(() => {
          this.getCategory(id);
        }, 100);
      } else {
        const categories = this.getCategories;
        if (categories) {
          for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            if (category.id == id) {
              this.products.push({
                title_EN: category.Title_EN,
                title_IT: category.Title_IT,
                img: category.Image.url,
                link: `/products/${category.URL}`,
              });
              i = categories.length;
            }
          }
        } else {
          console.log(categories);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/scss/common.scss";
.content {
  position: relative;
  .products {
    position: absolute;
    top: auto;
    left: 5%;
    right: 5%;
    bottom: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: stretch;
    margin-bottom: 2em;
    .product {
      flex: 0 1 49%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      max-width: 49%;
      text-decoration: none;
      margin-top: 130px;
      @media all and (min-width: 800px) {
        flex: 0 1 24%;
        max-width: 24%;
      }
      .product-img {
        height: 0;
        padding-top: 100px;
        margin-top: -50px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        transition: all 0.3s;
        @media all and (min-width: 800px) {
          padding-top: 200px;
          margin-top: -100px;
        }
      }
      .title {
        // background-color: $coffee-brown-light;
        color: #ffffff;
        margin-bottom: 0;
        padding: 0.5em 1em;
        flex: 1 1 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        @media all and (min-width: 800px) {
          display: block;
          text-align: right;
          width: 60%;
        }
      }
      &:hover {
        .product-img {
          padding-top: 150px;
          margin-top: -100px;
          @media all and (min-width: 800px) {
            padding-top: 250px;
            margin-top: -150px;
          }
        }
      }
    }
    .border {
      border: 1px solid white;
    }
  }
}
</style>
