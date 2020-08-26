<template lang="pug">
  .content
    .head
      h1.title {{ title }}
      .description {{shortDesc}}
    .products
      .product(v-for="product in products")
        .desc-img(v-bind:style="{ backgroundImage: `url(${product.img})` }")
        .description
          h3.title {{product.title}}
          .shortDesc {{product.shortDesc}}
        .additional
          h3.title {{product.title}}
          .description(v-html="product.description")
      .product.empty
      .product.empty
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Product",
  data() {
    return {
      title: "",
      shortDesc: "",
      products: [],
    };
  },
  computed: {
    ...mapGetters(["getCategoriesLoaded", "getCategories", "getBaseUrl"]),
  },
  methods: {
    getProducts() {
      if (this.getCategoriesLoaded) {
        const categories = this.getCategories;
        for (let i = 0; i < categories.length; i++) {
          const category = categories[i];
          if (category.URL == this.$route.params.product) {
            i = categories.length;
            this.title = category.Title_EN;
            this.shortDesc = category.ShortDescription_EN;
            this.products = [];
            for (let j = 0; j < category.products.length; j++) {
              const product = category.products[j];
              this.products.push({
                title: product.Title_EN,
                img: this.getBaseUrl + product.Image.url,
                shortDesc: product.ShortDescription_EN,
                description: product.LongDescription_EN.replace(
                  /\r?\n/g,
                  "<br />"
                ),
              });
            }
          }
        }
      } else {
        setTimeout(() => {
          this.getProducts();
        }, 100);
      }
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/common.scss";

.head {
  width: 80%;
  margin: 0 auto;
  padding: 2em 5px;
  border-top: 1px solid $coffee-brown;
  border-bottom: 1px solid $coffee-brown;
}
.products {
  max-width: $max-content-width;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 2em 1em;
  .product {
    flex: 0 1 49%;
    position: relative;
    overflow: hidden;
    margin-bottom: 1em;
    padding-bottom: 1em;
    @media all and (min-width: 800px) {
      flex: 0 1 30%;
    }
    &:hover {
      box-shadow: 0 0 29px 0 rgba(0, 0, 0, 0.18);
      .additional {
        top: auto;
        bottom: 0;
      }
    }
    &.empty {
      pointer-events: none;
    }
    .desc-img {
      height: 0;
      margin: 2em 1em;
      padding-bottom: 100%;
      background-position: center;
      background-repeat: none;
      background-size: contain;
    }
    .description {
      margin-top: 2em;
      .title {
        margin-bottom: 0.5em;
        color: $coffee-brown;
      }
    }
    .additional {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      bottom: -100%;
      background-color: $coffee-brown;
      color: white;
      padding: 0 1em 1em;
      font-size: 0.9em;
      .description {
        text-align: left;
        &::v-deep p {
          margin: 0.5em 0;
        }
      }
    }
  }
}
</style>
