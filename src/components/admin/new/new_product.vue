<template lang="pug">
    main.edit
        edit_head(@save="postProduct()")
        h2 New product 
            u {{new_product.Title_EN}} | {{new_product.Title_IT}} 
        .edit
            .section.child-2
                .child.half
                    h4.lang#Title_EN Title (EN)
                    input(v-model="new_product.Title_EN" maxlength="30" :class="{error: error.Title_EN}")
                .child.half
                    h4.lang#Title_IT Title (IT)
                    input(v-model="new_product.Title_IT" maxlength="30" :class="{error: error.Title_IT}")
            .section.child-2
                .child.half
                    h4.lang#ShortDescription_EN Short description (EN)
                    textarea.short#descEn(v-model="new_product.ShortDescription_EN" v-bind:maxlength="maxlength" :class="{error: error.ShortDescription_EN}")
                    label.floating(for="descEn") {{new_product.ShortDescription_EN.length}}/{{maxlength}}
                .child.half
                    h4.lang#ShortDescription_IT Short description (IT)
                    textarea.short#descIt(v-model="new_product.ShortDescription_IT" v-bind:maxlength="maxlength" :class="{error: error.ShortDescription_IT}")
                    label.floating(for="descIt") {{new_product.ShortDescription_IT.length}}/{{maxlength}}
            .section
                .child
                    h4.lang#Description_EN Description (EN)
                    textarea.long#longdescEn(v-model="new_product.Description_EN" v-bind:maxlength="bigMaxLength" :class="{error: error.Description_EN}")
                    label.floating(for="longdescEn") {{new_product.Description_EN.length}}/{{bigMaxLength}}
                .child
                    h4.lang#Description_IT Description (IT)
                    textarea.long#longdescIt(v-model="new_product.Description_IT" v-bind:maxlength="bigMaxLength" :class="{error: error.Description_IT}")
                    label.floating(for="longdescIt") {{new_product.Description_IT.length}}/{{bigMaxLength}}
            .section.child-2
                .child.half
                    h4.title#Image Image
                    div(:class="{error: error.Image}")
                      img.prodImg(:src="new_product.Image.url")
                      form.upload-img-form
                          font-awesome-icon.upload-icon(:icon="['fas', 'file-upload']" @click="clickOnImgInput()")
                          font-awesome-icon.upload-icon(:icon="['fas', 'folder-open']" @click="browseImages()")
                          input.upload-img(type="file" name="files" accept="image/*" @change="updateImage($event)")
                .child.half
                    h4.title#categories Categories
                    .categories(:class="{error: error.categories}")
                        .cat(v-for="cat, i in getCategories" :class="{active: isCategoryActive(cat.id)}")
                          p {{cat.Title_IT}} | {{cat.Title_EN}}
                          .icons
                            font-awesome-icon.ok-icon(:icon="['fas', 'plus-square']" @click="updateCat(cat.id, i, true)")
                            font-awesome-icon.not-icon(:icon="['fas', 'times-circle']" @click="updateCat(cat.id, i, false)")
        .modal(v-if="showModal")
          .inner
            .close(@click="showModal = false") X
            .content
              .media(v-for="media in modal" v-if="isImage(media)" @click='makeActiveMedia($event)' :data-id="media.id")
                .product-img(v-bind:style="{ backgroundImage: `url(${media.url})` }")
                .title {{media.name}}
            .finish(@click="selectMedia()") OK
</template>
<script>
import axios from "axios";
import { mapGetters, mapMutations } from "vuex";
import edit_head from "../edit/edit_head.vue";

export default {
  name: "New_product",
  data() {
    return {
      new_product: {
        Description_EN: "",
        Description_IT: "",
        Image: {},
        ShortDescription_EN: "",
        ShortDescription_IT: "",
        Title_EN: "",
        Title_IT: "",
        categories: [],
      },
      post_product: {},
      uploadImg: false,
      modal: {},
      showModal: false,
      selectedMedia: -1,
      maxlength: 70,
      bigMaxLength: 200,
      error: {
        Description_EN: false,
        Description_IT: false,
        Image: false,
        ShortDescription_EN: false,
        ShortDescription_IT: false,
        Title_EN: false,
        Title_IT: false,
        categories: false,
      },
      firstError: null,
    };
  },
  components: { edit_head },
  mounted() {
    this.checkLogIn();
  },
  computed: {
    ...mapGetters([
      "getJwt",
      "isJwtSet",
      "getBaseUrl",
      "getLoading",
      "getLoaded",
      "getCategories",
    ]),
  },
  methods: {
    ...mapMutations(["setProducts", "setLoading", "setNotLoaded"]),
    updateImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.uploadImg = true;
        this.new_product.Image.url = e.target.result;
      };
    },
    postProduct() {
      if (this.validateData()) {
        this.getProductData();
        axios
          .post(`${this.getBaseUrl}/products/`, this.new_product, {
            headers: { Authorization: `Bearer ${this.getJwt}` },
          })
          .then(() => {
            this.$router.push({ name: "Admin" });
          });
      } else {
        this.unblank();
        this.scrollToFirstError();
      }
    },
    getProductData() {
      this.post_product = JSON.parse(JSON.stringify(this.new_product));
      if (this.uploadImg) {
        const formElement = document.querySelector("form");
        let formData = new FormData(formElement);

        formData.append("ref", "product");
        formData.append("refId", this.$route.params.product);
        formData.append("field", "Image");

        this.post_product.Image = formData;
      }
    },
    clickOnImgInput() {
      this.$el.querySelector(".upload-img").click();
    },
    checkLogIn() {
      if (!this.isJwtSet) this.$router.push({ name: "Login" });
    },
    browseImages() {
      axios.get(`${this.getBaseUrl}/upload/files`).then((resp) => {
        this.drawImages(resp.data);
      });
    },
    drawImages(data) {
      this.modal = data;
      this.showModal = true;
    },
    isImage(media) {
      return media.mime.split("/")[0] == "image";
    },
    makeActiveMedia(event) {
      const DOMmodal = this.$el.querySelector(".modal");
      const modalMediaArr = DOMmodal.querySelectorAll(".media");
      let target = event.target;
      let activeID = target.dataset.id;
      while (activeID == null) {
        target = target.parentNode;
        activeID = target.dataset.id;
      }
      for (let j = 0; j < modalMediaArr.length; j++) {
        const modalMedia = modalMediaArr[j];
        if (activeID == modalMedia.dataset.id) {
          modalMedia.classList.add("active");
          this.selectedMedia = modalMedia.dataset.id;
        } else {
          modalMedia.classList.remove("active");
        }
      }
    },
    selectMedia() {
      if (this.selectedMedia != -1) {
        for (let i = 0; i < this.modal.length; i++) {
          const media = this.modal[i];
          if (media.id == this.selectedMedia) {
            this.new_product.Image = media;
            i = this.modal.length;
            this.showModal = false;
            this.uploadImg = false;
            this.setNotLoaded("products");
          }
        }
      }
    },
    isCategoryActive(catID) {
      let isActive = false;
      for (let i = 0; i < this.new_product.categories.length; i++) {
        const productCategory = this.new_product.categories[i];
        if (productCategory == catID) {
          isActive = true;
        }
      }
      return isActive;
    },
    updateCat(catID, DOMid, status) {
      if (status) {
        this.new_product.categories.push(catID);
      } else {
        const indexOfCat = this.new_product.categories.indexOf(catID);
        this.new_product.categories.splice(indexOfCat, 1);
      }
    },
    validateData() {
      let valid = true;
      if (this.new_product.Title_EN.length == 0) {
        if (valid) this.firstError = this.$el.querySelector("#Title_EN");
        valid = false;
        this.error.Title_EN = true;
      } else {
        this.error.Title_EN = false;
      }
      if (this.new_product.Title_IT.length == 0) {
        if (valid) this.firstError = this.$el.querySelector("#Title_IT");
        valid = false;
        this.error.Title_IT = true;
      } else {
        this.error.Title_IT = false;
      }
      if (this.new_product.ShortDescription_EN.length == 0) {
        if (valid)
          this.firstError = this.$el.querySelector("#ShortDescription_EN");
        valid = false;
        this.error.ShortDescription_EN = true;
      } else {
        this.error.ShortDescription_EN = false;
      }
      if (this.new_product.ShortDescription_IT.length == 0) {
        if (valid)
          this.firstError = this.$el.querySelector("#ShortDescription_IT");
        valid = false;
        this.error.ShortDescription_IT = true;
      } else {
        this.error.ShortDescription_IT = false;
      }
      if (this.new_product.Description_EN.length == 0) {
        if (valid) this.firstError = this.$el.querySelector("#Description_EN");
        valid = false;
        this.error.Description_EN = true;
      } else {
        this.error.Description_EN = false;
      }
      if (this.new_product.Description_IT.length == 0) {
        if (valid) this.firstError = this.$el.querySelector("#Description_IT");
        valid = false;
        this.error.Description_IT = true;
      } else {
        this.error.Description_IT = false;
      }
      if (JSON.stringify(this.new_product.Image) == "{}") {
        if (valid) this.firstError = this.$el.querySelector("#Image");
        valid = false;
        this.error.Image = true;
      } else {
        this.error.Image = false;
      }
      if (this.new_product.categories.length == 0) {
        if (valid) this.firstError = this.$el.querySelector("#categories");
        valid = false;
        this.error.categories = true;
      } else {
        this.error.categories = false;
      }
      return valid;
    },
    unblank() {
      this.$el.style.opacity = 1;
      this.$el.style.pointerEvents = "initial";
    },
    scrollToFirstError() {
      this.$smoothScroll({
        scrollTo: this.firstError,
        hash: "#error",
        offset: -this.$children[0].$el.getBoundingClientRect().height,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./new.scss";
.cat {
  background-color: #cccccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.2em 0;
  padding: 0 0.5em;
  p {
    opacity: 0.8;
    margin: 0.2em 0;
  }
  .ok-icon {
    color: green;
    cursor: pointer;
  }
  .not-icon {
    color: red;
    display: none;
    cursor: pointer;
  }
  &.active {
    background-color: #ffffff;
    p {
      opacity: 1;
    }
    .ok-icon {
      display: none;
    }
    .not-icon {
      display: initial;
    }
  }
}
</style>
