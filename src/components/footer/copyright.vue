<template lang="pug">
    .bottom
        .copyrights {{copyrights}}
        p.text {{text}}
</template>
<script>
import axios from 'axios'

export default {
    data: () => {
        return {
            copyrights: 'COPYRIGHT 2020 © ALL RIGHTS RESERVED',
            text: 'Created by me'
        }
    },
    methods: {
        getText() {
            axios.get('http://localhost:1337/page-bottom')
                .then(response => {
                    const resp = response.data;
                    if (resp.Footer) {
                        const foot = resp.Footer[0]
                        this.copyrights = foot.Copyright
                        this.text = foot.Other
                    }
                })
        }
    },
    mounted(){
        this.getText()
    }
}
</script>
<style lang="sass" scoped>
.bottom
    padding: 2em 0
</style>