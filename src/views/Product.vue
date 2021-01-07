<template lang="pug">
  .content
    .head
      h1.title {{ getLang == 'it' ? title_IT : title_EN }}
      .description {{getLang == 'it' ? shortDesc_IT : shortDesc_EN}}
    .products
      .product(v-for="product in products")
        .container
          .desc-img(v-bind:style="{ backgroundImage: `url(${product.img})` }")
          .description
            h3.title {{getLang == 'it' ? product.title_IT : product.title_EN}}
            .shortDesc {{getLang == 'it' ? product.shortDesc_IT : product.shortDesc_EN}}
          .additional
            h3.title {{getLang == 'it' ? product.title_IT : product.title_EN}}
            .description(v-html="getLang == 'it' ? product.description_IT : product.description_EN")
        .call-to-action(v-if="product.LinkToProduct")
          a(v-bind:href="product.LinkToProduct" target="_blank") 
            p {{getLang == 'it' ? getTerms.Terms.ShopLabel_IT : getTerms.Terms.ShopLabel_EN}}
      .product.empty
      .product.empty
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Product",
  data() {
    return {
      category: {},
      title_EN: "",
      title_IT: "",
      shortDesc_EN: "",
      shortDesc_IT: "",
      products: [],
    };
  },
  computed: {
    ...mapGetters(["getCategoriesLoaded", "getCategories", "getLang", "getTerms"]),
  },
  watch: {
    getLang(val) {
      const text = this.getCategories;
      this.title = val == "it" ? text.Title_IT : text.Title_EN;
      this.shortDesc =
        val == "it" ? text.ShortDescription_IT : text.ShortDescription_EN;
    },
  },
  methods: {
    getProducts() {
      if (this.getCategoriesLoaded) {
        const categories = this.getCategories;
        for (let i = 0; i < categories.length; i++) {
          const category = categories[i];
          if (category.URL == this.$route.params.product) {
            i = categories.length;
            this.category = category;
            this.title_EN = category.Title_EN;
            this.title_IT = category.Title_IT;
            this.shortDesc_EN = category.ShortDescription_EN;
            this.shortDesc_IT = category.ShortDescription_IT;
            this.products = [];
            for (let j = 0; j < category.products.length; j++) {
              const product = category.products[j];
              this.products.push({
                title_EN: product.Title_EN,
                title_IT: product.Title_EN,
                img: product.Image.url,
                shortDesc_EN: product.ShortDescription_EN,
                shortDesc_IT: product.ShortDescription_EN,
                LinkToProduct: product.LinkToProduct,
                description_EN: product.Description_EN.replace(
                  /\r?\n/g,
                  "<br />"
                ),
                description_IT: product.Description_EN.replace(
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
    margin-bottom: 1em;
    @media all and (min-width: 800px) {
      flex: 0 1 30%;
    }
    .container {
      position: relative;
      overflow: hidden;
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
        .shortDesc {
          overflow-wrap: break-word;
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
    .call-to-action {
      padding: 0 1em;
      a {
        text-decoration: none;
        font-weight: bold;
        p {
          font-size: 1.2em;
          padding: 0.5em 0;
        }
      }
    }
    &:hover {
      box-shadow: 0 0 29px 0 rgba(0, 0, 0, 0.18);
      .additional {
        top: auto;
        bottom: 0;
        max-height: 100%;
      }
    }
    &.empty {
      pointer-events: none;
    }
  }
}
</style>
