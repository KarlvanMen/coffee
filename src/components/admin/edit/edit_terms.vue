<template lang="pug">
  main.edit
    edit_head(@save="updateMainPage()")
    h2 Edit 
      u Terms
    .edit
      .header.section(v-if="page.Navigation")
        h2.title.full Languages:
        .languages.half
          .language(v-for="lang, i in page.Navigation.Languages.lang")
            label(for=`#lang-${i}`) {{lang.lang}}:  
            input(:id="`lang-${i}`" type="text" v-model="lang.title")
      .content.section(v-if="page.ContactUs != null")
        h2.title.full Labels
        .name.full.section
          .label.full Name
          p
          .half
            label(for="contact-name-it") IT: 
            input#contact-name-it(type="text" v-model="page.ContactUs.Name_IT" maxlength="30")
          .half
            label(for="contact-name-en") EN: 
            input#contact-name-en(type="text" v-model="page.ContactUs.Name_EN" maxlength="30")
        .email.full.section
          .label.full E-mail
          p
          .half
            label(for="contact-name-it") IT: 
            input#contact-email-it(type="text" v-model="page.ContactUs.Email_IT" @keyup="updateEmail($event, 'it')" maxlength="30")
          .half
            label(for="contact-name-en") EN: 
            input#contact-email-en(type="text" v-model="page.ContactUs.Email_EN" @keyup="updateEmail($event, 'en')" maxlength="30")
        .message.full.section
          .label.full Message
          p
          .half
            label(for="contact-message-it") IT: 
            input#contact-message-it(type="text" v-model="page.ContactUs.Message_IT" maxlength="30")
          .half
            label(for="contact-message-en") EN: 
            input#contact-message-en(type="text" v-model="page.ContactUs.Message_EN" maxlength="30")
        .send.full.section
          .label.full Send
          p
          .half
            label(for="contact-send-it") IT: 
            input#contact-send-it(type="text" v-model="page.ContactUs.Send_IT" maxlength="30")
          .half
            label(for="contact-send-en") EN: 
            input#contact-send-en(type="text" v-model="page.ContactUs.Send_EN" maxlength="30")
        .phone.full.section
          .label.full Phone
          p
          .half
            label(for="about-phone-it") IT: 
            input#about-phone-it(type="text" v-model="page.AboutUs.Phone_IT" maxlength="30")
          .half
            label(for="about-phone-en") EN: 
            input#about-phone-en(type="text" v-model="page.AboutUs.Phone_EN" maxlength="30")
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import edit_head from "./edit_head.vue";
import axios from "axios";
export default {
  name: "Terms",
  data() {
    return {
      origin: {},
      page: {},
    };
  },
  components: { edit_head },
  mounted() {
    this.setData();
  },
  computed: {},
  methods: {
    ...mapGetters(["getData", "getDataLoaded", "getBaseUrl", "getJwt"]),
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
        if (this.page == {}) {
          setTimeout(() => {
            this.setData();
          }, 100);
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
    updateEmail(ev, lang) {
      const value = ev.target.value;
      switch (lang) {
        case "en":
          this.page.AboutUs.Email_EN = value;
          break;

        default:
          this.page.AboutUs.Email_IT = value;
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./edit.scss";
.section {
  text-align: left;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 1em 0;
  padding: 1em 10px;
  &:not(:first-child):not(.full) {
    border-top: 1px solid #ccc;
  }
  .full {
    flex: 0 1 100%;
    position: relative;
  }
  .half {
    flex: 0 1 49%;
    position: relative;
    margin-bottom: 1em;
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
        .not-icon {
          display: none;
        }
        .ok-icon {
          display: initial;
        }
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
  }
  .color {
    input {
      width: 50px;
      border: none;
    }
  }
}
.content {
  .section {
    padding: 0;
  }
}
</style>
