<template lang="pug">
    .background(v-bind:style="{backgroundColor: `${getBackground.Color}`}")
        video(v-if="media=='video' && src.length" :autoplay="true" loop muted)
            source(:src="src")
        .static(v-else-if="media=='pic'" v-bind:style="{backgroundImage: `url(${src})`}")
        .overlay(v-if="media=='video' || media=='pic'")
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "VideoBg",
  data: () => {
    return {
      media: "video",
      src: "",
    };
  },
  computed: {
    ...mapGetters(["getBackground", "getDataLoaded"]),
  },
  mounted() {
    this.$nextTick(function() {
      this.setDimensions();
      window.addEventListener("resize", this.setDimensions);
      this.getVideo();
    });
  },
  methods: {
    setDimensions() {
      this.$el.style.height = `${window.innerHeight}px`;
      this.$el.style.marginTop = `-${
        this.$parent.$parent.$refs.header.$el.getBoundingClientRect().height
      }px`;
    },
    getVideo() {
      if (!this.getDataLoaded) {
        setTimeout(() => {
          this.getVideo();
        }, 100);
      } else {
        let background = this.getBackground;
        if (background) {
          switch (background.Display) {
            case "Media":
              switch (background.BackgroundMedia.mime.split("/")[0]) {
                case "video":
                  this.media = "video";
                  break;
                default:
                  //image
                  this.media = "pic";
                  break;
              }
              this.src = background.BackgroundMedia.url;
              break;
            default:
              //Color
              this.media = "color";
              this.src = background.Color;
              break;
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/common.scss";

.background {
  min-width: 100%;
  max-width: 100%;
  z-index: -1;
  overflow: hidden;
  transition: margin 0s;
  position: relative;
  background-color: $coffee-brown;
  video {
    margin-top: -2px;
    height: 100%;
    width: 177.77777778vh;
    min-width: 100%;
    min-height: 56.25vw;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: none;
    source {
      width: 100%;
      height: 100%;
    }
  }
  .overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #ffffff;
    opacity: 0.2;
  }
  .static {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
