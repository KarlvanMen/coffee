<template lang="pug">
  main.main
    edit_head
    .content
      h2 Contact form messages
      .headers
        h3.date Date
        h3.subject Title
        h3.inner Content
      .messages
        .message(v-for="msg in messages")
          .date {{getDate(msg.createdAt)}}
          .subject {{msg.subject}}
          .inner(v-html="msg.html")
</template>

<script>
import Axios from "axios";
import edit_head from "../edit/edit_head.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      messages: [],
    };
  },
  components: { edit_head },
  computed: {
    ...mapGetters(["getBaseUrl", "getJwt"]),
  },
  mounted() {
    this.getMessages();
    this.hideUnrelevant();
  },
  methods: {
    hideUnrelevant() {
      this.$children[0].$el.querySelector(".cancel").style.display = "none";
      this.$children[0].$el.querySelector(".save").style.display = "none";
    },
    getMessages() {
      Axios.get(`${this.getBaseUrl}/contact-forms`, {
        headers: {
          Authorization: `Bearer ${this.getJwt}`,
        },
      }).then((response) => {
        const data = response.data;
        this.messages = data;
      });
    },
    getDate(dateString) {
      const jsDate = new Date(Date.parse(dateString)) + " ";
      const splitJsDate = jsDate.split(" ");
      let returnDate =
        splitJsDate[1] +
        " " +
        splitJsDate[2] +
        " " +
        splitJsDate[3] +
        " " +
        splitJsDate[4];
      return returnDate;
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("./view.scss");
.headers,
.message {
  display: flex;
  text-align: left;
  border-bottom: 1px solid #cccccc;
  .date,
  .subject {
    flex: 0 0 25%;
  }
}
.headers {
  border-bottom: 2px solid #444444;
}
.message {
  margin-top: 1em;
}
</style>
