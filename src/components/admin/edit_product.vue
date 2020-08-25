<template lang="pug">
    main.product
        h1 Admin
        h2 Edit 
            u {{new_product.Title_EN}}
        .edit
            .section.child-2
                .child.half
                    h4.lang Title (EN)
                    input(v-model="new_product.Title_EN")
                .child.half
                    h4.lang Title (IT)
                    input(v-model="new_product.Title_IT")
            .section.child-2
                .child.half
                    h4.lang Short description (EN)
                    textarea.short(v-model="new_product.ShortDescription_EN")
                .child.half
                    h4.lang Short description (IT)
                    textarea.short(v-model="new_product.ShortDescription_IT")
            .section
                .child
                    h4.lang Description (EN)
                    textarea.long(v-model="new_product.Description_EN")
                .child
                    h4.lang Description (IT)
                    textarea.long(v-model="new_product.Description_IT")
            .section.child-2
                .child.half
                    h4.title Image
                    img.prodImg(:src="getUrl(new_product.Image.url)")
                    form.upload-img-form
                        font-awesome-icon.upload-icon(:icon="['fas', 'file-upload']" @click="clickOnImgInput()")
                        font-awesome-icon.upload-icon(:icon="['fas', 'folder-open']" @click="browseImages()")
                        input.upload-img(type="file" name="files" accept="image/jpeg" @change="updateImage()")
                .child.half
                    h4.title Categories
                    .categories
                        .category(v-for="cat in new_product.categories")
                            p {{cat.Title_EN}}
        button.submit(v-on:click="postProduct()") Save
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
    data(){
        return {
            product: {},
            new_product: {
                Description_EN: "",
                Description_IT: "",
                Image: {},
                ShortDescription_EN: "",
                ShortDescription_IT: "",
                Title_EN: '',
                Title_IT: '',
                categories: []
            },
            uploadImg: false
        }
    },
    mounted(){
        this.checkLogIn()
        this.getProduct()
    },
    computed:{
        ...mapGetters([
            'getJwt',
            'isJwtSet',
        ])
    },
    methods:{
        getProduct(){
            axios.get(`http://localhost:1337/products/${this.$route.params.product}`)
                .then(response => {
                    if (response.statusText == 'OK') {
                        this.product = response.data;
                        this.new_product.Description_EN = this.product.Description_EN
                        this.new_product.Description_IT = this.product.Description_IT
                        this.new_product.Image = this.product.Image
                        this.new_product.ShortDescription_EN = this.product.ShortDescription_EN
                        this.new_product.ShortDescription_IT = this.product.ShortDescription_IT
                        this.new_product.Title_EN = this.product.Title_EN
                        this.new_product.Title_IT = this.product.Title_IT
                        this.new_product.categories = this.product.categories
                    }
                })
        },
        getUrl(url){
            return this.uploadImg ? url : `http://localhost:1337${url}`
        },
        updateImage(e){
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e =>{
                this.uploadImg = true
                this.new_product.Image.url = e.target.result;
            };
        },
        postProduct(){
            axios.put(`http://localhost:1337/products/${this.$route.params.product}`,
                this.checkForChanges(),
                {
                    headers: { Authorization: `Bearer ${this.getJwt}` }
                }
            ).then(response => {
                if (response.status == 200) {
                    const formElement = document.querySelector('form');
                    let formData = new FormData(formElement);

                    formData.append("ref", 'product')
                    formData.append("refId", this.$route.params.product)
                    formData.append("field", 'Image')

                    axios.post(
                        `http://localhost:1337/upload/`,
                        formData,
                        {
                            headers: { 
                                Authorization: `Bearer ${this.getJwt}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    ).then(resp => {
                        if (resp.status == 200) {
                            this.$router.push({name: 'Admin'});
                        }
                    })
                }
            })
        },
        checkForChanges(){
            let changes = {};
            if (this.product.Description_EN !== this.new_product.Description_EN) changes.Description_EN = this.new_product.Description_EN;
            if (this.product.Description_IT !== this.new_product.Description_IT) changes.Description_IT = this.new_product.Description_IT;
            if (this.product.ShortDescription_EN !== this.new_product.ShortDescription_EN) changes.ShortDescription_EN = this.new_product.ShortDescription_EN;
            if (this.product.ShortDescription_IT !== this.new_product.ShortDescription_IT) changes.ShortDescription_IT = this.new_product.ShortDescription_IT;
            if (this.product.Title_EN !== this.new_product.Title_EN) changes.Title_EN = this.new_product.Title_EN;
            if (this.product.Title_IT !== this.new_product.Title_IT) changes.Title_IT = this.new_product.Title_IT;
            if (this.product.categories !== this.new_product.categories) changes.categories = this.new_product.categories;
            return changes
        },
        clickOnImgInput(){
            this.$el.querySelector('.upload-img').click()
        },
        checkLogIn(){
            if(!this.isJwtSet) this.$router.push({name: 'Login'})
        },
        browseImages() {
            axios.get(`http://localhost:1337/upload/files`).then(resp => {
                console.log(resp)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../scss/common.scss';
.product{
    padding: 1em;
    .edit{
        padding: 1em;
        .section {
            input,
            textarea {
                width: 100%;
                border: 1px solid #000;
                outline: none;
                font-family: inherit;
                font-size: 1em;
                line-height: inherit;
                padding: 2px;
                &.short {
                    height: 150px;
                }
                &.long {
                    height: 350px;
                }
            }
            .child {
                &.half {
                    flex: 1 1 49%;
                    &:not(:first-child) {
                        margin-left: 10px;
                    }
                }
            }
            &.child-2 {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
            }
            .lang,.title{
                text-align: left;
                text-transform: none;
            }
            .categories {
                text-align: left;
            }
            .upload-img-form {
                .upload-icon {
                    font-size: 2.5em;
                    color: $prim;
                    cursor: pointer;
                }
                .upload-img {
                    display: none;
                }
            }
        }
    }
}
img {
    max-width: 80%;
}
</style>