<template lang="pug">
    main.edit
        edit_head(@save="postProduct()")
        h2 Edit 
            u {{new_product.Title_EN}}
        .edit
            .section.child-2
                .child.half
                    h4.lang Title (EN)
                    input(v-model="new_product.Title_EN" maxlength="30")
                .child.half
                    h4.lang Title (IT)
                    input(v-model="new_product.Title_IT" maxlength="30")
            .section.child-2
                .child.half
                    h4.lang Short description (EN)
                    textarea.short#descEn(v-model="new_product.ShortDescription_EN" v-bind:maxlength="maxlength")
                    label.floating(for="descEn") {{new_product.ShortDescription_EN.length}}/{{maxlength}}
                .child.half
                    h4.lang Short description (IT)
                    textarea.short#descIt(v-model="new_product.ShortDescription_IT" v-bind:maxlength="maxlength")
                    label.floating(for="descIt") {{new_product.ShortDescription_IT.length}}/{{maxlength}}
            .section
                .child
                    h4.lang Description (EN)
                    textarea.long#longdescEn(v-model="new_product.Description_EN" v-bind:maxlength="bigMaxLength")
                    label.floating(for="longdescEn") {{new_product.Description_EN.length}}/{{bigMaxLength}}
                .child
                    h4.lang Description (IT)
                    textarea.long#longdescIt(v-model="new_product.Description_IT" v-bind:maxlength="bigMaxLength")
                    label.floating(for="longdescIt") {{new_product.Description_IT.length}}/{{bigMaxLength}}
                .child
                    h4.lang#LinkToProduct URL
                    input(v-model="new_product.LinkToProduct")
            .section.child-2
                .child.half
                    h4.title Image
                    img.prodImg(:src="new_product.Image.url" v-if="new_product.Image")
                    form.upload-img-form
                        font-awesome-icon.upload-icon(:icon="['fas', 'file-upload']" @click="clickOnImgInput()")
                        font-awesome-icon.upload-icon(:icon="['fas', 'folder-open']" @click="browseImages()")
                        input.upload-img(type="file" name="files" accept="image/*" @change="updateImage($event)")
                .child.half
                    h4.title Categories
                    .categories
                        .cat(v-for="cat, i in getCategories" :class="{active: isCategoryActive(cat.id)}")
                          p {{cat.Title_IT}} | {{cat.Title_EN}}
                          .icons
                            font-awesome-icon.ok-icon(:icon="['fas', 'plus-square']" @click="updateCat(cat.id, i, true)")
                            font-awesome-icon.not-icon(:icon="['fas', 'times-circle']" @click="updateCat(cat.id, i, false)")
        .modal(v-if="showModal")
          .inner
            .close(@click="showModal = false") X
            .content
              .media(v-for="media, i in modal" v-if="isImage(media)" @click.stop='makeActiveMedia($event)' :data-id="media.id")
                .product-img(v-bind:style="{ backgroundImage: `url(${media.url})` }")
                .title {{media.name}}
            .finish(@click="selectMedia()") OK
        edit_footer(@deleteContent="deleteThis()")
</template>
<script>
import axios from "axios";
import { mapGetters, mapMutations } from "vuex";
import edit_head from "./edit_head.vue";
import edit_footer from "./edit_footer.vue";

export default {
  name: "Edit_product",
  data() {
    return {
      product: {},
      new_product: {
        Description_EN: "",
        Description_IT: "",
        Image: {},
        ShortDescription_EN: "",
        ShortDescription_IT: "",
        Title_EN: "",
        Title_IT: "",
        LinkToProduct: "",
        categories: [],
      },
      uploadImg: false,
      modal: {},
      showModal: false,
      selectedMedia: -1,
      maxlength: 70,
      bigMaxLength: 200,
    };
  },
  components: { edit_head, edit_footer },
  mounted() {
    this.checkLogIn();
    this.drawProduct();
  },
  computed: {
    ...mapGetters([
      "getJwt",
      "isJwtSet",
      "getBaseUrl",
      "getProduct",
      "getLoading",
      "getLoaded",
      "getCategories",
    ]),
  },
  methods: {
    ...mapMutations(["setProducts", "setLoading", "setNotLoaded"]),
    drawProduct() {
      if (this.getLoaded("products")) {
        const prod = this.getProduct(this.$route.params.product);
        if (prod) {
          this.product = prod;
          this.new_product.Description_EN = this.product.Description_EN;
          this.new_product.Description_IT = this.product.Description_IT;
          this.new_product.Image = this.product.Image;
          this.new_product.ShortDescription_EN = this.product.ShortDescription_EN;
          this.new_product.ShortDescription_IT = this.product.ShortDescription_IT;
          this.new_product.Title_EN = this.product.Title_EN;
          this.new_product.Title_IT = this.product.Title_IT;
          this.new_product.LinkToProduct = this.product.LinkToProduct;
          for (let i = 0; i < this.product.categories.length; i++) {
            const category = this.product.categories[i];
            const catID = category.id;
            this.new_product.categories.push(catID);
          }
        }
      } else {
        if (!this.getLoading("products")) {
          this.loadProducts();
        }
        setTimeout(() => {
          this.drawProduct();
        }, 100);
      }
    },
    updateImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.uploadImg = true;
        this.new_product.Image = false;
        this.new_product.Image = { url: e.target.result };
      };
    },
    uploadImgToServer() {
      const formElement = document.querySelector("form");
      let formData = new FormData(formElement);

      axios
        .post(`${this.getBaseUrl}/upload/`, formData, {
          headers: {
            Authorization: `Bearer ${this.getJwt}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((resp) => {
          if (resp.status == 200) {
            let changes = this.checkForChanges();
            changes.Image = resp.data[0];
            this.updateProduct(changes);
          }
        });
    },
    updateProduct(changes) {
      axios
        .put(
          `${this.getBaseUrl}/products/${this.$route.params.product}`,
          changes,
          {
            headers: { Authorization: `Bearer ${this.getJwt}` },
          }
        )
        .then((response) => {
          if (response.status == 200) {
            this.$router.push({ name: "Admin" });
          }
        });
    },
    postProduct() {
      if (this.uploadImg) {
        this.uploadImgToServer();
      } else {
        this.updateProduct(this.checkForChanges());
      }
    },
    checkForChanges() {
      let changes = {};
      if (this.product.LongDescription_EN !== this.new_product.Description_EN)
        changes.Description_EN = this.new_product.Description_EN;
      if (this.product.LongDescription_IT !== this.new_product.Description_IT)
        changes.Description_IT = this.new_product.Description_IT;
      if (
        this.product.ShortDescription_EN !==
        this.new_product.ShortDescription_EN
      )
        changes.ShortDescription_EN = this.new_product.ShortDescription_EN;
      if (
        this.product.ShortDescription_IT !==
        this.new_product.ShortDescription_IT
      )
        changes.ShortDescription_IT = this.new_product.ShortDescription_IT;
      if (this.product.Title_EN !== this.new_product.Title_EN)
        changes.Title_EN = this.new_product.Title_EN;
      if (this.product.Title_IT !== this.new_product.Title_IT)
        changes.Title_IT = this.new_product.Title_IT;
      changes.categories = this.new_product.categories;
      if (this.product.Image !== this.new_product.Image)
        changes.Image = this.new_product.Image;
      if (this.product.LinkToProduct !== this.new_product.LinkToProduct)
        changes.LinkToProduct = this.new_product.LinkToProduct;
      return changes;
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
    loadProducts() {
      this.setLoading("products");
      axios.get(`${this.getBaseUrl}/products`).then((response) => {
        const resp = response.data;
        if (resp != null) {
          this.setProducts(resp);
        }
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
    deleteThis() {
      this.setNotLoaded("products");
      axios
        .delete(`${this.getBaseUrl}/products/${this.$route.params.product}`, {
          headers: { Authorization: `Bearer ${this.getJwt}` },
        })
        .then(() => {
          this.goBack();
        });
    },
    goBack() {
      this.$router.push({ name: "Admin" });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./edit.scss";
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
