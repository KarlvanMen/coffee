<template lang="pug">
  main.main
    edit_head
    .content
      h2 Media
      .buttons
        .delete(@click="deleteMedia()" :class="{active: activeMedia.length > 0}")
          font-awesome-icon.save-icon(:icon="['fas', 'trash']")
          | ({{activeMedia.length}})
      .container
        .media(v-for="file, i in media" @click.stop="makeActive(i)" :key="file.id")
          .img(v-if="isImage(file)" v-bind:style="{ backgroundImage: `url(${file.url})` }")
          .video(v-else)
            video
              source(:src="file.url")
          .title {{file.name}}
</template>

<script>
import Axios from "axios";
import edit_head from "../edit/edit_head.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      media: [],
      activeMedia: [],
    };
  },
  components: { edit_head },
  computed: {
    ...mapGetters(["getBaseUrl", "getJwt"]),
  },
  mounted() {
    this.getMedia();
    this.hideUnrelevant();
  },
  methods: {
    hideUnrelevant() {
      this.$children[0].$el.querySelector(".cancel").style.display = "none";
      this.$children[0].$el.querySelector(".save").style.display = "none";
    },
    getMedia() {
      this.media = [];
      Axios.get(`${this.getBaseUrl}/upload/files`, {
        headers: {
          Authorization: `Bearer ${this.getJwt}`,
        },
      }).then((response) => {
        const data = response.data;
        this.media = data;
      });
    },
    isImage(media) {
      return media.mime.split("/")[0] == "image";
    },
    deleteMedia() {
      for (let i = 0; i < this.activeMedia.length; i++) {
        const media = this.activeMedia[i];
        const mediaID = media.id;
        Axios.delete(`${this.getBaseUrl}/upload/files/${mediaID}`, {
          headers: {
            Authorization: `Bearer ${this.getJwt}`,
          },
        }).then(() => {
          for (let j = 0; j < this.activeMedia.length; j++) {
            const active = this.activeMedia[j];
            if (active.id == mediaID) {
              this.activeMedia.splice(j, 1);
            }
          }
          this.getMedia();
        });
      }
    },
    makeActive(i) {
      const DOMmodal = this.$el.querySelector(".container");
      const modalMediaArr = DOMmodal.querySelectorAll(".media");
      const modalMedia = modalMediaArr[i];
      modalMedia.classList.toggle("active");
      if (modalMedia.classList.contains("active")) {
        this.activeMedia.push(this.media[i]);
      } else {
        const mediaID = this.media[i].id;
        for (let j = 0; j < this.activeMedia.length; j++) {
          const active = this.activeMedia[j];
          if (active.id == mediaID) {
            this.activeMedia.splice(j, 1);
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("./view.scss");
.container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .media {
    flex: 0 0 13%;
    margin-right: 1%;
    outline: 2px solid transparent;
    cursor: pointer;
    &.active {
      outline: 2px solid #1167b1;
    }
    .img {
      height: 0;
      padding-top: 200px;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
    }
    .video {
      height: 200px;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      video {
        max-width: 100%;
      }
    }
  }
}
.buttons {
  font-size: 1.5em;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1em;
  .delete {
    color: #aa4130;
    padding: 0.25em 1.5em;
    transition: all 0.3s, color 0s;
    border: 1px solid #aa4130;
    border-radius: 3px;
    margin: 0 0.25em;
    opacity: 0.5;
    pointer-events: none;
    cursor: pointer;
    &:hover {
      color: #fff;
      background: #aa4130;
    }
    &.active {
      opacity: 1;
      pointer-events: all;
    }
  }
}
</style>
