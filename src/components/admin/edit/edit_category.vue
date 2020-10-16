<template lang="pug">
    main.edit
        edit_head(@save="postCategory()")
        h2 Edit 
            u {{new_category.Title_EN}}
        .edit
            .section.child-2
                .child.half
                    h4.lang Title (EN)
                    input(v-model="new_category.Title_EN" maxlength="30")
                .child.half
                    h4.lang Title (IT)
                    input(v-model="new_category.Title_IT" maxlength="30")
            .section.child-2
                .child.half
                    h4.lang Short description (EN)
                    textarea.short#descEn(v-model="new_category.ShortDescription_EN" v-bind:maxlength="maxlength")
                    label.floating(for="descEn") {{new_category.ShortDescription_EN.length}}/{{maxlength}}
                .child.half
                    h4.lang Short description (IT)
                    textarea.short#descIt(v-model="new_category.ShortDescription_IT" v-bind:maxlength="maxlength")
                    label.floating(for="descIt") {{new_category.ShortDescription_IT.length}}/{{maxlength}}
            .section.child-2
                .child.half
                    h4.title Image
                    img.prodImg(v-if="new_category.Image" :src="new_category.Image.url")
                    form.upload-img-form
                        font-awesome-icon.upload-icon(:icon="['fas', 'file-upload']" @click="clickOnImgInput()")
                        font-awesome-icon.upload-icon(:icon="['fas', 'folder-open']" @click="browseImages()")
                        input.upload-img(type="file" name="files" accept="image/*" @change="updateImage($event)")
                .child.half
                    h4.title URL
                    input(v-model="new_category.URL" @change="validateURL()" maxlength="20")
        .modal(v-if="showModal")
          .inner
            .close(@click="showModal = false") X
            .content
              .loading(v-if="modal == {}") Loading...
              .media(v-for="media in modal" v-if="isImage(media)" @click='makeActiveMedia($event)' :data-id="media.id")
                .product-img(v-bind:style="{ backgroundImage: `url(${media.url})` }")
                .title {{media.name}}
            .finish(@click="selectMedia()") OK
        edit_footer(@deleteContent="deleteThis()")
</template>

<script>
import edit_head from "./edit_head.vue";
import edit_footer from "./edit_footer.vue";
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";
export default {
  data: () => {
    return {
      category: {},
      new_category: {
        Title_EN: "",
        Title_IT: "",
        ShortDescription_EN: "",
        ShortDescription_IT: "",
        Image: {},
        URL: "",
      },
      uploadImg: false,
      modal: {},
      showModal: false,
      selectedMedia: -1,
      maxlength: 280,
    };
  },
  components: { edit_head, edit_footer },
  computed: {
    ...mapGetters([
      "getCategory",
      "getLoaded",
      "getLoading",
      "getBaseUrl",
      "isJwtSet",
      "getJwt",
    ]),
  },
  mounted() {
    this.checkLogIn();
    this.drawCategory();
  },
  methods: {
    ...mapMutations(["setCategories", "setNotLoaded"]),
    drawCategory() {
      if (this.getLoaded("categories")) {
        const temp = this.getCategory(this.$route.params.category);
        this.category = temp;
        this.new_category.Title_EN = temp.Title_EN;
        this.new_category.Title_IT = temp.Title_IT;
        this.new_category.ShortDescription_EN = temp.ShortDescription_EN;
        this.new_category.ShortDescription_IT = temp.ShortDescription_IT;
        this.new_category.Image = temp.Image;
        this.new_category.URL = temp.URL;
      } else {
        if (!this.getLoading("categories")) {
          this.loadCategories();
        }
        setTimeout(() => {
          this.drawCategory();
        }, 100);
      }
    },
    loadCategories() {
      axios.get(`${this.getBaseUrl}/categories`).then((response) => {
        const resp = response.data;
        if (resp != null) {
          this.setCategories(resp);
        }
      });
    },
    updateImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.uploadImg = true;
        this.new_category.Image = false;
        this.new_category.Image = { url: e.target.result };
      };
    },
    postCategory() {
      if (this.uploadImg) {
        this.uploadImgToServer();
      } else {
        this.updateCategory(this.checkForChanges());
      }
    },
    uploadImgToServer() {
      const formElement = document.querySelector(".upload-img-form");
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
            this.updateCategory(changes);
          }
        });
    },
    updateCategory(changes) {
      this.setNotLoaded("categories");
      axios
        .put(
          `${this.getBaseUrl}/categories/${this.$route.params.category}`,
          changes,
          {
            headers: { Authorization: `Bearer ${this.getJwt}` },
          }
        )
        .then(() => {
          this.goBack();
        });
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
    deleteThis() {
      this.setNotLoaded("categories");
      axios
        .delete(
          `${this.getBaseUrl}/categories/${this.$route.params.category}`,
          {
            headers: { Authorization: `Bearer ${this.getJwt}` },
          }
        )
        .then(() => {
          this.goBack();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./edit.scss";
</style>
