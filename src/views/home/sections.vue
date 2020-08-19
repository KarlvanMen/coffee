<template lang="pug">
    .content
        section.products
            router-link.product.border(v-for="product in products" :to="product.link")
                .product-img(v-bind:style="{ backgroundImage: `url(${getImgUrl(product.img)})` }")
                h3.title {{product.title}}
</template>
<script>
export default {
    name: "Sections",
    data(){
        return{
            products: [
                {
                    title: "Coffee beans",
                    img: "img/categories/coffe.jpeg",
                    link: "/products/beans"
                },
                {
                    title: "Ground Coffe",
                    img: "img/categories/coffe_2.jpeg",
                    link: "/products/coffe"
                },
                {
                    title: "Marketing",
                    img: "img/categories/coffe.jpeg",
                    link: "/products/marketing"
                },
                {
                    title: "Related products",
                    img: "img/categories/coffe_2.jpeg",
                    link: "/products/related"
                }
            ]
        }
    },
    mounted(){
    },
    methods: {
        getImgUrl(img) {
            return require('../../assets/'+img)
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/scss/common.scss';
.content {
    position: relative;
    .products{
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
        .product{
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
            .product-img{
                height: 0;
                padding-top: 100px;
                margin-top: -50px;
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                transition: all .3s;
                @media all and (min-width: 800px) {
                    padding-top: 200px;
                    margin-top: -100px;
                }
            }
            .title{
                background-color: $coffee-brown-light;
                color: black;
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
            &:hover{
                .product-img{
                    padding-top: 150px;
                    margin-top: -100px;
                    @media all and (min-width: 800px) {
                        padding-top: 250px; 
                        margin-top: -150px;
                    }
                }
            }
        }       
        .border{
            border: 1px solid white;
        }
    }
}
</style>