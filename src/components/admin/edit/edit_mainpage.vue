<template lang="pug">
  main.edit
    edit_head(@save="updateMainPage()")
    h2 Edit 
      u Main page
    .edit
      .header.section(v-if="page.Navigation")
        h2.title.full Header
        .logo.full
          .image
            .label Logo:
            img(:src="page.Navigation.Logo.url")
            form.upload-img-form
              //- font-awesome-icon.upload-icon(:icon="['fas', 'file-upload']" @click="clickOnImgInput('logo')")
              font-awesome-icon.upload-icon(:icon="['fas', 'folder-open']" @click="browseImages('logo')")
              input.upload-img#logo-upload-img(type="file" name="files" accept="image/*" @change="updateImage($event, 'logo')")
      .background.section(v-if="page.Background")
        h2.title.full Background
        .media.half
          .label Media:
          .image(v-if="page.Background.BackgroundMedia.mime.split('/')[0] == 'image'")
            img(:src="page.Background.BackgroundMedia.url")
          .video(v-else-if="page.Background.BackgroundMedia.mime.split('/')[0] == 'video'")
            video(controls :key="page.Background.BackgroundMedia.url")
              source(:src="page.Background.BackgroundMedia.url")
          form.upload-img-form
            //- font-awesome-icon.upload-icon(:icon="['fas', 'file-upload']" @click="clickOnImgInput('background')")
            font-awesome-icon.upload-icon(:icon="['fas', 'folder-open']" @click="browseImages('background')")
            input.upload-img#background-upload-img(type="file" name="files" accept="video/*,image/*" @change="updateImage($event, 'background')")
        .color.half
          label(for="#color") Background color: 
          input#color(type="color" v-model="page.Background.Color")
        .display.half 
          label(for="#display") Display: 
          select#display(v-model="page.Background.Display")
            option(value="Media") Media
            option(value="Color") Color
        //- .top.half
        //-   label(for="#top") Stick to the top?
        //-   input#top(type="checkbox" v-model="page.Background.Top")
      .categories.section(v-if="page.Categories")
        h2.title.full Product categories
        .categ.half
          ul.list(v-draggable="{value: page.Categories.Categories.categories}")
            li.cat(v-for="cat, i in page.Categories.Categories.categories" :key="cat" :class="{inactive: i > page.Categories.Count-1}")
              | {{drawCategory(cat)}}
        .count.half
          label(for="catcount") Count of displayed categories: 
          select#display(v-model="page.Categories.Count")
            option(value="2") 2
            option(value="3") 3
            option(value="4") 4
      .contact-us.section(v-if="page.ContactUs != null")
        h2.title.full Contact form
        .quarter
        .title-en.quarter
          label(for="contact-title-it") Title (EN): 
          input#contact-title-en(type="text" v-model="page.ContactUs.Title_EN" maxlength="30")
          p
        .title-it.quarter
          label(for="contact-title-it") Title (IT): 
          input#contact-title-it(type="text" v-model="page.ContactUs.Title_IT" maxlength="30")
          p
        .quarter
        .quarter
        .send-to.half
          label(for="contact-send-to") E-mail address: 
          input#contact-send-to(type="text" v-model="page.ContactUs.SendTo" maxlength="30")
        .quarter
      .about-us.section(v-if="page.AboutUs != null")
        h2.title.full About us
        .column.quarter
          .company 
            label(for="about-company") Company: 
            input#about-company(type="text" v-model="page.AboutUs.Company" maxlength="50")
          .company-status
            label(for="about-company-status") Company status: 
            input#about-company-status(type="text" v-model="page.AboutUs.CompanyStatus" maxlength="50")
        .column.quarter
          .email
            label(for="about-email") E-mail: 
            input#about-email(type="text" v-model="page.AboutUs.Email" maxlength="50")
          .phone
            label(for="about-phone") Phone: 
            input#about-phone(type="text" v-model="page.AboutUs.Phone" maxlength="30")
        .column.quarter
          .street
            label(for="about-street") Street: 
            input#about-street(type="text" v-model="page.AboutUs.Street" maxlength="50")
          .city
            label(for="about-city") City: 
            input#about-city(type="text" v-model="page.AboutUs.City" maxlength="50")
        .column.quarter
          .fb-url
            label(for="about-fb") Facebook URL: 
            input#about-fb(type="text" v-model="page.AboutUs.FBurl" maxlength="50")
          .tw-url
            label(for="about-tw") Twitter URL: 
            input#about-tw(type="text" v-model="page.AboutUs.TWurl" maxlength="50")
          .ig-url
            label(for="about-ig") Instagram URL: 
            input#about-ig(type="text" v-model="page.AboutUs.IGurl" maxlength="50")
      .disclaimer.section(v-if="page.Disclaimer != null")
        h2.title.full Disclaimer
        .copyright-en.half
            .label Copyright (EN):
            textarea.short#disclaimer-cprght-en(v-model="page.Disclaimer.Copyright_EN" maxlength="250")
            label.floating(for="disclaimer-cprght-en") {{page.Disclaimer.Copyright_EN.length}}/250
        .copyright-it.half
            .label Copyright (IT):
            textarea.short#disclaimer-cprght-it(v-model="page.Disclaimer.Copyright_IT" maxlength="250")
            label.floating(for="disclaimer-cprght-it") {{page.Disclaimer.Copyright_IT.length}}/250
        .other-en.half
            .label Other information (EN):
            textarea.short#disclaimer-other-en(v-model="page.Disclaimer.Other_EN" maxlength="250")
            label.floating(for="disclaimer-other-en") {{page.Disclaimer.Other_EN.length}}/250
        .other-it.half
            .label Other information (IT):
            textarea.short#disclaimer-other-it(v-model="page.Disclaimer.Other_IT" maxlength="250")
            label.floating(for="disclaimer-other-it") {{page.Disclaimer.Other_IT.length}}/250
    .modal(v-if="showModal")
      .inner
        .close(@click="showModal = false") X
        .content
          .media(v-for="media, i in modal" v-if="currentlyOpenedModal == 'logo' ? isImage(media) : true" @click='makeActiveMedia(i)' :data-id="media.id")
            .product-img(v-if="isImage(media)" v-bind:style="{ backgroundImage: `url(${media.url})` }")
            .product-img.video(v-else)
              video
                source(:src="media.url")
            .title {{media.name}}
        .finish(@click="selectMedia()") OK
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import edit_head from "./edit_head.vue";
import axios from "axios";
export default {
  name: "Main_page",
  data() {
    return {
      origin: {},
      page: {},
      showModal: false,
      modal: {},
      currentlyOpenedModal: "",
      uploadImg: {
        logo: false,
        background: false,
      },
      selectedMedia: -1,
      categories: [],
    };
  },
  components: { edit_head },
  mounted() {
    this.setData();
  },
  computed: {},
  methods: {
    ...mapGetters([
      "getData",
      "getDataLoaded",
      "getBaseUrl",
      "getCategories",
      "getJwt",
    ]),
    ...mapMutations(["setNotLoaded"]),
    setData() {
      if (!this.getDataLoaded) {
        setTimeout(() => {
          this.setData();
        }, 100);
      } else {
        const data = this.getData();
        this.origin = data;
        this.page = JSON.parse(JSON.stringify(data));
        this.categories = this.getCategories();
        if (this.page == {}) {
          setTimeout(() => {
            this.setData();
          }, 100);
        }
      }
    },
    limitToInt(event) {
      let value = event.target.value;
      value = value.split(".")[0];
      event.target.value = value;
    },
    clickOnImgInput(target) {
      this.$el.querySelector(`#${target}-upload-img`).click();
    },
    browseImages(target) {
      axios.get(`${this.getBaseUrl()}/upload/files`).then((resp) => {
        this.currentlyOpenedModal = target;
        this.drawImages(resp.data);
      });
    },
    drawImages(data) {
      this.modal = data;
      this.showModal = true;
    },
    updateImage(e, target) {
      const image = e.target.files[0];
      const type = image.type;
      switch (target) {
        case "logo":
          this.uploadImg.logo = true;
          this.page.Navigation.Logo.url = URL.createObjectURL(
            event.target.files[0]
          );
          break;
        case "background":
          this.uploadImg.background = true;
          this.page.Background.BackgroundMedia.mime = type;
          this.page.Background.BackgroundMedia.url = URL.createObjectURL(
            event.target.files[0]
          );
          break;
        default:
          break;
      }
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
            switch (this.currentlyOpenedModal) {
              case "logo":
                this.page.Navigation.Logo = media;
                this.uploadImg.logo = false;
                break;
              case "background":
                this.page.Background.BackgroundMedia = media;
                this.uploadImg.background = false;
                break;

              default:
                break;
            }
            i = this.modal.length;
            this.showModal = false;
            this.setNotLoaded("general");
          }
        }
      }
    },
    drawCategory(categoryID) {
      for (let i = 0; i < this.categories.length; i++) {
        const category = this.categories[i];
        if (category.id == categoryID) {
          this.categories[i].display = true;
          return `${category.Title_EN} | ${category.Title_IT}`;
        }
      }
    },
    updateCat(categoryID, id, state) {
      for (let i = 0; i < this.categories.length; i++) {
        const category = this.categories[i];
        if (category.id == categoryID) {
          this.categories[i].display = state;
          const catDOMObj = this.$el
            .querySelector(".categories")
            .querySelectorAll(".cat")[id];
          this.updateCatClass(catDOMObj, state);
        }
      }
    },

    updateMainPage() {
      const changes = this.checkForChanges();
      const baseURL = this.getBaseUrl();
      if (changes !== {}) {
        axios
          .put(`${baseURL}/home`, changes, {
            headers: { Authorization: `Bearer ${this.getJwt()}` },
          })
          .then(() => {
            this.setNotLoaded("general");
            this.$router.push({ name: "Admin" });
          });
      }
    },
    checkForChanges() {
      let changes = {};
      if (!this.deepEqual(this.origin, this.page)) {
        changes = this.page;
      }
      return changes;
    },
    deepEqual(object1, object2) {
      const keys1 = Object.keys(object1);
      const keys2 = Object.keys(object2);

      if (keys1.length !== keys2.length) {
        return false;
      }

      for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = this.isObject(val1) && this.isObject(val2);
        if (
          (areObjects && !this.deepEqual(val1, val2)) ||
          (!areObjects && val1 !== val2)
        ) {
          return false;
        }
      }

      return true;
    },
    isObject(object) {
      return object != null && typeof object === "object";
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./edit.scss";
.section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 1em 0;
  padding: 1em 10px;
  &:not(:first-child) {
    border-top: 1px solid #ccc;
  }
  .full {
    flex: 0 1 100%;
    position: relative;
  }
  .half {
    flex: 0 1 49%;
    position: relative;
  }
  .quarter {
    flex: 0 1 24%;
    margin-bottom: 0.5em;
    position: relative;
  }
  label:not(.floating),
  .label {
    font-weight: bold;
  }
  select {
    &#display {
      font-size: 1em;
      padding-right: 0.5em;
    }
  }
  input {
    &#top {
      font-size: 1em;
      height: 1em;
      width: 1em;
      vertical-align: middle;
    }
  }
  &.categories {
    display: flex;
    justify-content: space-between;
    .icons {
      margin: 1px 0 0 0.75em;
      padding: 0 0.5em 0 0;
      float: right;
      vertical-align: middle;
      .ok-icon,
      .not-icon {
        cursor: pointer;
      }
      .ok-icon {
        color: green;
        display: none;
        margin-right: 1px;
      }
      .not-icon {
        color: red;
      }
    }
    .cat {
      background-color: transparent;
      padding-top: 1px;
      margin: 0.2em 0;
      &.inactive {
        background-color: #ccc;
        // pointer-events: none;
      }
    }
  }
}
.edit .edit {
  .section {
    input {
      width: auto;
      &#catcount {
        width: 3em;
      }
    }
    .categ {
      .list {
        list-style: none;
        li {
          border: 1px solid #cccccc;
          padding: 0.2em 0 0.1em 0;
          cursor: move;
        }
      }
    }
  }
  .color {
    input {
      width: 50px;
      border: none;
    }
  }
}
</style>
