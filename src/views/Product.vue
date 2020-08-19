<template lang="pug">
  .content
    .head
      h1.title {{ $route.params.product }}
      .description {{shortDesc}}
    .products
      .product(v-for="product in products")
        .desc-img(v-bind:style="{ backgroundImage: `url(${getImgUrl(product.img)})` }")
        .description
          h3.title {{product.title}}
          .shortDesc {{product.shortDesc}}
        .additional
          h3.title {{product.title}}
          .description(v-html="product.description")
</template>

<script>
export default {
  name: "Product",
  data(){
    return {
      title: '',
      shortDesc: "Short description of the site",
      products: [
        {
          title: "Product 1",
          img: 'img/categories/coffe.jpeg',
          shortDesc: "Short description",
          description: `<p>Roasting:	Medium</p>
            <p>Aroma:	Sweet and fruity</p>
            <p>Body:	Delicate body with elastic cream</p>
            <p>Taste:	Hints of vanilla, almonds and hazelnuts</p>`
        },
        {
          title: "Product 2",
          img: 'img/categories/coffe_2.jpeg',
          shortDesc: "Short description",
          description: `<p>Roasting:	Medium</p>
            <p>Aroma:	Sweet and fruity</p>
            <p>Body:	Delicate body with elastic cream</p>
            <p>Taste:	Hints of vanilla, almonds and hazelnuts</p>`
        },
        {
          title: "Product 3",
          img: 'img/categories/coffe.jpeg',
          shortDesc: "Short description",
          description: `<p>Roasting:	Medium</p>
            <p>Aroma:	Sweet and fruity</p>
            <p>Body:	Delicate body with elastic cream</p>
            <p>Taste:	Hints of vanilla, almonds and hazelnuts</p>`
        },
        {
          title: "Product 4",
          img: 'img/categories/coffe_2.jpeg',
          shortDesc: "Short description",
          description: `<p>Roasting:	Medium</p>
            <p>Aroma:	Sweet and fruity</p>
            <p>Body:	Delicate body with elastic cream</p>
            <p>Taste:	Hints of vanilla, almonds and hazelnuts</p>`
        },
      ]
    }
  },
  methods: {
      getImgUrl(img) {
          return require('@/assets/'+img)
      }
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