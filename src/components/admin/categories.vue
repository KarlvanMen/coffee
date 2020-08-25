<template lang="pug">
  main.main
    h2.accordion(v-on:click="toggleAccordion()") Categories
    .categories.panel
        .add-new.category
            .icon-container.plus
                font-awesome-icon.icon(:icon="['fas', 'plus-circle']")
        router-link.category(v-for="cat in categories" :to="`/admin/edit/category/${cat.id}`")
            .icon-container.edit
                font-awesome-icon.icon(:icon="['fas', 'edit']")
            h4 {{cat.Title_EN}}
</template>

<script>
import axios from 'axios'

export default {
    name: "Categories",
    data() {
        return {
            categories: []
        }
    },
    mounted(){
        this.getCategories()
    },
    methods:{
        getCategories(){
            axios.get('http://localhost:1337/categories')
                .then(response => {
                    const resp = response.data;
                    if (resp.length) {
                        this.categories = resp
                    }
                })
        },
        getUrl(url){
            return `http://localhost:1337${url}`
        },
        toggleAccordion(){
            this.$el.querySelector('.accordion').classList.toggle('active')
            
            const panel = this.$el.querySelector('.panel');
            if (panel) {
              if (panel.style.maxHeight) {
                  panel.style.maxHeight = null;
              } else {
                  panel.style.maxHeight = panel.scrollHeight + "px";
              } 
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../scss/common.scss';

.main{
    max-width: $max-content-width;
    margin: 0 auto;
    .categories {
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .category{
            width: 24%;
            padding: 1em 0.5em;
            position: relative;
            img{
                max-width: 50%;
                max-height: 100%;
                width: auto;
                height: auto
            }
            &:hover{
                box-shadow: 0 0 29px 0 rgba(0,0,0,.18);
                .icon-container{
                    opacity: 1;
                    &:not(.plus) {
                        background-color: rgba(0,0,0,.08);
                    }
                }
            }
            .icon-container {
                opacity: 0;
                color: $coffee-brown;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                .icon{
                    font-size: 3em;
                }
                &.plus{
                    color: $prim;
                    opacity: 1;
                }
            }
        }
    }
}
</style>