<template lang="pug">
    .coordinates
        .company
            p(v-for="text in company") {{text}}
        .contact
            p(v-for="text in contact" v-html="text")
        .address
            p(v-for="text in address") {{text}}
        .social
            p
                a(v-for="soc in social" :href="soc.url")
                    font-awesome-icon(:icon="soc.icon")
</template>

<script>
import axios from 'axios'

export default {
    name: "Coordinates",
    data(){ 
        return {
            company: [
                "Sample Company", "Sample LTD"
            ],
            contact: [
                `E-mail: <a href="#">sample@email.com</a>`, "Phone: +39 012345 012345"
            ],
            address: [
                "Sample street", "Sample city"
            ],
            social: [
                {icon: ['fab', 'facebook-f'], url: '#'},
                {icon: ['fab', 'twitter'], url: '#'},
                {icon: ['fab', 'instagram'], url: '#'},
            ]
        }
    },
    methods:{
        getText() {
            axios.get('http://localhost:1337/page-bottom')
                .then(response => {
                    const resp = response.data;
                    if (resp.About) {
                        const about = resp.About[0]
                        this.company = [about.TitleEN, about.CompanyStatus]
                        this.contact = [`${about.EmailEN}: <a href="#">${about.Email}</a>`, `${about.PhoneEN}: ${about.Phone}`]
                        this.address = [about.Street, about.City]
                        this.social = [
                            {icon: ['fab', 'facebook-f'], url: about.Facebook},
                            {icon: ['fab', 'twitter'], url: about.Twitter},
                            {icon: ['fab', 'instagram'], url: about.Instagram}
                        ]
                    }
                })
        }
    },
    mounted(){
        this.getText()
    }
}
</script>

<style lang="scss" scoped>
@import '../../scss/common.scss';
.coordinates{
    width: 80%;
    margin: 0 auto;
    padding: 2em 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    @media all and (min-width: 800px) {
        align-items: center;
    }
    border-top: 1px solid $coffee-brown;
    border-bottom: 1px solid $coffee-brown;
    text-align: left;
    &>div{
        flex: 1 1 50%;
        @media all and (min-width: 800px) {
            flex: 1 1 25%;
        }
    }
    a,
    &::v-deep a{
        color: $coffee-brown;
        &:hover{
            color: $coffee-brown-light;
        }
    }
    .social{
        a{
            margin: 0 .5em;
        }
    }
}
</style>