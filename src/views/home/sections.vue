<template lang="pug">
    .content
        section.products
            router-link.product.border(v-for="product in products" :to="product.link")
                .product-img(v-bind:style="{ backgroundImage: `url(${product.img})` }")
                h3.title {{product.title}}
</template>
<script>
import axios from 'axios'

export default {
    name: "Sections",
    data(){
        return{
            products: [
            ]
        }
    },
    mounted(){
        this.getSections()
    },
    methods: {
        getSections() {
            axios.get('http://localhost:1337/homepage')
                .then(response => {
                    const resp = response.data;
                    if (resp.Categories){
                        const categories = resp.Categories.categories
                        this.products = []
                        for (let i = 0; i < categories.length; i++) {
                            const cat = categories[i];
                            this.products.push({
                                title: cat.Title_EN,
                                img: `http://localhost:1337${cat.Image.url}`,
                                link: `/products/${cat.url}`
                            })
                        }
                    }
                })
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