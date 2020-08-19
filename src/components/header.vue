<template lang="pug">
    .container
        router-link.logo(to="/")
        .lang
            a(v-for="language in lang" href="#") {{language.title}}
</template>

<script>
let data = 
{
    lang: [
        {
            title: "IT",
            url: "/it"
        },
        { 
            title: "EN",
            url: "/en"
        }]
}
export default {
    name: 'Header',
    data: () => {
        return data
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
        background-image: url('~@/assets/logo.png');
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