<template lang="pug">
    .video_background
        video(:autoplay="true" loop muted poster="poster")
            source(v-for="source in sources" :src="source.src" :media="source.media")
</template>

<script>
let data = 
{
    sources: [
        {
            src: require("../../assets/video/coffee_xsmall.mp4"),
            media: "screen and (max-device-width:640px)"
        },
        {
            src: require("../../assets/video/coffee_small.mp4"),
            media: "screen and (max-device-width:960px)"
        },
        {
            src: require("../../assets/video/coffee_medium.mp4"),
            media: "screen and (max-device-width:1280px)"
        },
        {
            src: require("../../assets/video/coffee_large.mp4"),
            media: "screen and (min-device-width:1281px)"
        }
    ],
    poster: "~@/assets/video/poster.jpg"
}
export default {
    name: 'VideoBg',
    data: () => {
        return data
    },
    mounted(){
        this.$nextTick(function() {
            this.setDimensions()
            window.addEventListener('resize', this.setDimensions)
		})
    },
    methods: {
        setDimensions () {
            this.$el.style.height = `${window.innerHeight}px`
            this.$el.style.marginTop = `-${this.$parent.$parent.$refs.header.$el.getBoundingClientRect().height}px`
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/scss/common.scss';

.video_background{
    min-width: 100%;
    max-width:100%;
    z-index: -1;
    overflow: hidden;
    transition: margin 0s;
    position: relative;
    background-color: $coffee-brown;
    video{
        margin-top: -2px;
        height: 100%;
        width: 177.77777778vh;
        min-width: 100%;
        min-height: 56.25vw;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        source{
            width: 100%;
            height: 100%;
        }
    }
    &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0,0,0,0.35);
    }
}
</style>