<template lang="pug">
    .container
        router-link.logo(to="/" v-bind:style="{ backgroundImage: `url(${logo})` }")
        .lang
            a(v-for="language in lang" href="#") {{language.title}}
</template>

<script>
import axios from 'axios'

export default {
    name: 'Header',
    data: () => {
        return {
            lang: [
                {
                    title: "IT",
                    lang: "it"
                },
                { 
                    title: "EN",
                    lang: "en"
                }
            ],
            logo: 'logo.png'
        }
    },
    methods: {
        getHeader() {
            axios.get('http://localhost:1337/page-top')
                .then(response => {
                    const resp = response.data;
                    if (resp.Head) {
                        this.lang = resp.Head[0].Language
                        this.logo = `http://localhost:1337${resp.Head[0].Logo.url}`
                    }
                })
        },
        getImgUrl(img) {
            return require(img)
        }
    },
    mounted(){
        this.logo = '../../assets/'+this.logo
        this.getHeader()

    }
}
</script>

<style lang="scss" scoped>
@import '../scss/common.scss';
.container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    margin-left: 50%;
    color: #fff;
    .logo{
        background-size: contain;
        background-repeat: no-repeat;
        width: 150px;
        height: 150px;
        transform: translateX(-50%);
    }
    .lang{
        margin: 0 20px;
        z-index: 100;
        a{
            margin: 0 0 0 0.5em;
            text-decoration: none;
            transition: all .3s;
            &:hover{
                color: $coffee-brown-light;
            }
        }
    }
}
</style>