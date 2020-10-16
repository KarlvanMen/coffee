<template lang="pug">
    main.edit
        edit_head(@save="postCategory()")
        h2 New category 
            u {{new_category.Title_EN}} | {{new_category.Title_IT}} 
        .edit
            .section.child-2
                .child.half
                    h4.lang#Title_EN Title (EN)
                    input(v-model="new_category.Title_EN" maxlength="30" :class="{error: error.Title_EN}")
                .child.half
                    h4.lang#Title_IT Title (IT)
                    input(v-model="new_category.Title_IT" maxlength="30" :class="{error: error.Title_IT}")
            .section.child-2
                .child.half
                    h4.lang#ShortDescription_EN Short description (EN)
                    textarea.short#descEn(v-model="new_category.ShortDescription_EN" v-bind:maxlength="maxlength" :class="{error: error.ShortDescription_EN}")
                    label.floating(for="descEn") {{new_category.ShortDescription_EN.length}}/{{maxlength}}
                .child.half
                    h4.lang#ShortDescription_IT Short description (IT)
                    textarea.short#descIt(v-model="new_category.ShortDescription_IT" v-bind:maxlength="maxlength" :class="{error: error.ShortDescription_IT}")
                    label.floating(for="descIt") {{new_category.ShortDescription_IT.length}}/{{maxlength}}
            .section.child-2
                .child.half
                    h4.title#Image Image
                    div(:class="{error: error.Image}")
                      img.prodImg(v-if="new_category.Image" :src="new_category.Image.url")
                      form.upload-img-form
                          font-awesome-icon.upload-icon(:icon="['fas', 'file-upload']" @click="clickOnImgInput()")
                          font-awesome-icon.upload-icon(:icon="['fas', 'folder-open']" @click="browseImages()")
                          input.upload-img(type="file" name="files" accept="image/*" @change="updateImage($event)")
                .child.half
                    h4.title#URL URL
                    input(v-model="new_category.URL" @change="validateURL()" maxlength="20" :class="{error: error.URL}")
        .modal(v-if="showModal")
          .inner
            .close(@click="showModal = false") X
            .content
              .loading(v-if="modal == {}") Loading...
              .media(v-for="media in modal" v-if="isImage(media)" @click='makeActiveMedia($event)' :data-id="media.id")
                .product-img(v-bind:style="{ backgroundImage: `url(${media.url})` }")
                .title {{media.name}}
            .finish(@click="selectMedia()") OK
</template>

<script>
import edit_head from "../edit/edit_head.vue";
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";
export default {
  data: () => {
    return {
      new_category: {
        Title_EN: "",
        Title_IT: "",
        ShortDescription_EN: "",
        ShortDescription_IT: "",
        Image: {},
        URL: "",
      },
      post_category: {},
      uploadImg: false,
      modal: {},
      showModal: false,
      selectedMedia: -1,
      maxlength: 280,
      error: {
        Title_EN: false,
        Title_IT: false,
        ShortDescription_EN: false,
        ShortDescription_IT: false,
        Image: false,
        URL: false,
      },
      firstError: null,
    };
  },
  components: { edit_head },
  computed: {
    ...mapGetters(["getBaseUrl", "isJwtSet", "getJwt", "getData"]),
  },
  mounted() {
    this.checkLogIn();
  },
  methods: {
    ...mapMutations(["setCategories", "setNotLoaded"]),
    updateImage(e) {
      console.log(e);
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.uploadImg = true;
        this.new_category.Image.url = e.target.result;
      };
    },
    postCategory() {
      if (this.validateData()) {
        this.getCategoryData();
        this.setNotLoaded("categories");
        axios
          .post(`${this.getBaseUrl}/categories/`, this.post_category, {
            headers: { Authorization: `Bearer ${this.getJwt}` },
          })
          .then((resp) => {
            this.updateCategories(resp.data);
          });
      } else {
        this.unblank();
        this.scrollToFirstError();
      }
    },
    checkForChanges() {
      let changes = {};
      if (this.category.Title_EN !== this.new_category.Title_EN)
        changes.Title_EN = this.new_category.Title_EN;
      if (this.category.Title_IT !== this.new_category.Title_IT)
        changes.Title_IT = this.new_category.Title_IT;
      if (
        this.category.ShortDescription_EN !==
        this.new_category.ShortDescription_EN
      )
        changes.ShortDescription_EN = this.new_category.ShortDescription_EN;
      if (
        this.category.ShortDescription_IT !==
        this.new_category.ShortDescription_IT
      )
        changes.ShortDescription_IT = this.new_category.ShortDescription_IT;
      if (this.category.Image !== this.new_category.Image)
        changes.Image = this.new_category.Image;
      if (this.category.URL !== this.new_category.URL)
        changes.URL = this.new_category.URL;
      return changes;
    },
    clickOnImgInput() {
      this.$el.querySelector(".upload-img").click();
    },
    checkLogIn() {
      if (!this.isJwtSet) this.$router.push({ name: "Login" });
    },
    browseImages() {
      this.showModal = true;
      axios
        .get(`${this.getBaseUrl}/upload/files`, {
          headers: {
            Authorization: `Bearer ${this.getJwt}`,
          },
        })
        .then((resp) => {
          this.drawImages(resp.data);
        });
    },
    drawImages(data) {
      this.modal = data;
    },
    isImage(media) {
      return media.mime.split("/")[0] == "image";
    },
    makeActiveMedia(event) {
      const DOMmodal = this.$el.querySelector(".modal");
      const modalMediaArr = DOMmodal.querySelectorAll(".media");
      let target = event.target;
      let activeID = target.dataset.id;
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
            this.new_category.Image = media;
            i = this.modal.length;
            this.showModal = false;
            this.uploadImg = false;
            this.setNotLoaded("categories");
          }
        }
      }
    },
    validateURL() {
      this.new_category.URL = this.new_category.URL.trim()
        .replace(/\\/g, "")
        .replace(/\s/g, "")
        .replace(/\//g, "");
    },
    goBack() {
      this.$router.push({ name: "Admin" });
    },
    validateData() {
      let valid = true;
      if (this.new_category.Title_EN.length == 0) {
        if (valid) this.firstError = this.$el.querySelector("#Title_EN");
        valid = false;
        this.error.Title_EN = true;
      } else {
        this.error.Title_EN = false;
      }
      if (this.new_category.Title_IT.length == 0) {
        if (valid) this.firstError = this.$el.querySelector("#Title_IT");
        valid = false;
        this.error.Title_IT = true;
      } else {
        this.error.Title_IT = false;
      }
      if (this.new_category.ShortDescription_EN.length == 0) {
        if (valid)
          this.firstError = this.$el.querySelector("#ShortDescription_EN");
        valid = false;
        this.error.ShortDescription_EN = true;
      } else {
        this.error.ShortDescription_EN = false;
      }
      if (this.new_category.ShortDescription_IT.length == 0) {
        if (valid)
          this.firstError = this.$el.querySelector("#ShortDescription_IT");
        valid = false;
        this.error.ShortDescription_IT = true;
      } else {
        this.error.ShortDescription_IT = false;
      }
      if (JSON.stringify(this.new_category.Image) == "{}") {
        if (valid) this.firstError = this.$el.querySelector("#Image");
        valid = false;
        this.error.Image = true;
      } else {
        this.error.Image = false;
      }
      if (this.new_category.URL.length == 0) {
        if (valid) this.firstError = this.$el.querySelector("#URL");
        valid = false;
        this.error.categories = true;
      } else {
        this.error.categories = false;
      }
      return valid;
    },
    getCategoryData() {
      this.post_category = JSON.parse(JSON.stringify(this.new_category));
      if (this.uploadImg) {
        const formElement = document.querySelector("form");
        let formData = new FormData(formElement);

        formData.append("ref", "product");
        formData.append("refId", this.$route.params.product);
        formData.append("field", "Image");

        this.post_category.Image = formData;
      }
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
    updateCategories(data) {
      let categories = JSON.parse(JSON.stringify(this.getData.Categories));
      categories.Categories.categories.push(data.id);
      axios
        .put(
          `${this.getBaseUrl}/home`,
          {
            Categories: categories,
          },
          {
            headers: { Authorization: `Bearer ${this.getJwt}` },
          }
        )
        .then(() => {
          this.$router.push({ name: "Admin" });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./new.scss";
</style>
