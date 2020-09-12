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
import { mapGetters } from "vuex";

export default {
  name: "Coordinates",
  data() {
    return {
      company: ["", ""],
      contact: ["", ""],
      address: ["", ""],
      social: [],
    };
  },
  watch: {
    getLang(val) {
      const text = this.getCoordinates;
      this.contact = [
        `${val == "it" ? text.Email_IT : text.Email_EN}: <a href="#">${
          text.Email
        }</a>`,
        `${val == "it" ? text.Phone_IT : text.Phone_EN}: ${text.Phone}`,
      ];
    },
  },
  computed: {
    ...mapGetters(["getDataLoaded", "getCoordinates", "getLang"]),
  },
  methods: {
    getText() {
      if (this.getDataLoaded) {
        let text = this.getCoordinates;
        if (text) {
          this.company = [text.Company, text.CompanyStatus];
          this.contact = [
            `${text.Email_EN}: <a href="#">${text.Email}</a>`,
            `${text.Phone_EN}: ${text.Phone}`,
          ];
          this.address = [text.Street, text.City];
          this.social = [
            { icon: ["fab", "facebook-f"], url: text.FBurl },
            { icon: ["fab", "twitter"], url: text.TWurl },
            { icon: ["fab", "instagram"], url: text.IGurl },
          ];
        }
      } else {
        setTimeout(() => {
          this.getText();
        }, 100);
      }
    },
  },
  mounted() {
    this.getText();
  },
};
</script>

<style lang="scss" scoped>
@import "../../scss/common.scss";
.coordinates {
  width: 80%;
  margin: 0 auto;
  padding: 2em 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  border-top: 1px solid $coffee-brown;
  border-bottom: 1px solid $coffee-brown;
  text-align: left;
  & > div {
    flex: 1 1 50%;
    @media all and (min-width: 800px) {
      flex: 0 1 24%;
    }
  }
  a,
  &::v-deep a {
    color: $coffee-brown;
    &:hover {
      color: $coffee-brown-light;
    }
  }
  .social {
    a {
      margin: 0 0.5em;
    }
  }
}
</style>
