<template lang="pug">
    main.container
        h1 Admin panel
        categories
        products
</template>
<script>
import { mapGetters } from 'vuex'
import categories from "../components/admin/categories";
import products from "../components/admin/products";

export default {
    mounted(){
        this.checkLogIn()
    },
    components: {
        categories,
        products
    },
    computed:{
        ...mapGetters([
            'isJwtSet',
        ])
    },
    methods: {
        checkLogIn(){
            if(!this.isJwtSet) this.$router.push({name: 'Login'})
        }
    }
}
</script>
<style lang="scss" scoped>
</style>