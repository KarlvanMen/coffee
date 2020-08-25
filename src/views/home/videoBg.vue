<template lang="pug">
    .background
        video(v-if="media=='video' && src.length" :autoplay="true" loop muted poster="poster")
            source(:src="src")
        .static(v-else-if="media=='pic'")
        .static(v-else-if="media=='color'")
        .overlay(v-if="media=='video'")
</template>

<script>
import axios from 'axios'

export default {
    name: 'VideoBg',
    data: () => {
        return {
            media: 'video',
            src: '',
            poster: "~@/assets/video/poster.jpg"
        }
    },
    mounted(){
        this.$nextTick(function() {
            this.setDimensions()
            window.addEventListener('resize', this.setDimensions)
            this.getVideo()
		})
    },
    methods: {
        setDimensions () {
            this.$el.style.height = `${window.innerHeight}px`
            this.$el.style.marginTop = `-${this.$parent.$parent.$refs.header.$el.getBoundingClientRect().height}px`
        },
        getVideo() {
            axios.get('http://localhost:1337/homepage')
                .then(response => {
                    const resp = response.data;
                    if (resp.Cover){
                        const bckgr = resp.Cover.VideoOrImage
                        switch (bckgr.mime.split('/')[0]) {
                            case 'video':
                                this.media = 'video'
                                this.src = `http://localhost:1337${bckgr.url}`                                
                                break;
                            case 'image':
                                this.media = 'pic'
                                this.src = `http://localhost:1337${bckgr.url}`                                
                                break;                        
                            default:
                                this.media = 'color'
                                this.src = `#000000`  
                                break;
                        }
                    }
                })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/scss/common.scss';

.background{
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
    .overlay {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0,0,0,0.35);
    }
    .static{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: contain;
        background-repeat: no-repeat;
    }
}
</style>