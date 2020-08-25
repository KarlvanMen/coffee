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
import axios from 'axios'

export default {
  name: "Product",
  data(){
    return {
      title: '',
      shortDesc: "",
      products: [
      ]
    }
  },
  methods: {
    getImgUrl(img) {
      return require('@/assets/'+img)
    },
    getProducts() {
      axios.get('http://localhost:1337/categories')
        .then(response => {
            const resp = response.data;
            if (resp.length) {
              for (let i = 0; i < resp.length; i++) {
                const category = resp[i];
                if (category.url == this.$route.params.product) {
                  i = resp.length
                  this.title = category.Title_EN
                  this.shortDesc = category.Description_EN
                  this.products = []
                  for (let j = 0; j < category.products.length; j++) {
                    const product = category.products[j];
                    this.products.push({
                      title: product.Title_EN,
                      img: `http://localhost:1337${product.Image.url}`,
                      shortDesc: product.ShortDescription_EN,
                      description:  product.Description_EN.replace(/\r?\n/g, "<br />")
                    })
                  }
                }
              }
            }
        })
    }
  },
  mounted(){
    this.getProducts()
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/common.scss';

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
      box-shadow: 0 0 29px 0 rgba(0,0,0,.18);
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
      .description{
        text-align: left;
        &::v-deep p {
          margin: 0.5em 0;
        }
      }
    }
  }
}
</style>