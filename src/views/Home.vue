<template lang="pug">
    main.content
        videoBg
        Sections
</template>
<script>
import videoBg from "./home/videoBg";
import Sections from "./home/sections";

export default {
  name: "Content",
  components: {
    videoBg,
    Sections,
  },
  methods: {},
  mounted() {},
};
</script>
