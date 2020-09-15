<template lang="pug">
    main.content
        videoBg
        Sections
</template>
<script>
import videoBg from "../components/home/videoBg";
import Sections from "../components/home/sections";

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
