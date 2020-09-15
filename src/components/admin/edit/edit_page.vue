<template lang="pug">
    main.category
        h1 Admin
        h2 Edit 
          u {{page.Title}}
        .edit
            .section.child-1
                .child.half
                    h4.lang Title
                    input(v-model="page.Title")
        .modal(v-if="showModal")
          .inner
            .close(@click="showModal = false") X
            .content
              .media(v-for="media, i in modal" v-if="isImage(media)" @click='makeActiveMedia(i)' :data-id="media.id")
                .product-img(v-bind:style="{ backgroundImage: `url(${getBaseUrl + media.url})` }")
                .title {{media.name}}
            .finish(@click="selectMedia()") OK
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  data: () => {
    return {
      page: {
        Title: "",
      },
      uploadImg: false,
      modal: {},
      showModal: false,
      selectedMedia: -1,
    };
  },
  computed: {
    ...mapGetters(["getLoaded", "getBaseUrl"]),
  },
  mounted() {
    this.getPageData();
  },
  methods: {
    getPageData() {
      axios
        .get(`${this.getBaseUrl}/${this.$route.params.page}`)
        .then((response) => {
          const resp = response.data;
          if (resp != null) {
            this.page = resp;
          }
        });
    },
    clickOnImgInput() {
      this.$el.querySelector(".upload-img").click();
    },
    browseImages() {
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
      this.showModal = true;
    },
    isImage(media) {
      return media.mime.split("/")[0] == "image";
    },
    makeActiveMedia(i) {
      const DOMmodal = this.$el.querySelector(".modal");
      const modalMediaArr = DOMmodal.querySelectorAll(".media");
      for (let j = 0; j < modalMediaArr.length; j++) {
        const modalMedia = modalMediaArr[j];
        if (i == j) {
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
  },
};
</script>

<style lang="scss" scoped>
@import "./edit.scss";
</style>
