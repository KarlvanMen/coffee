<template lang="pug">
  footer
    .content
      .buttons
        .delete(@click="deleteFunc()")
          font-awesome-icon.save-icon(:icon="['fas', 'trash']")
</template>

<script>
export default {
  name: "Footer",
  methods: {
    deleteFunc() {
      this.$parent.$el.style.opacity = 0.5;
      this.$parent.$el.style.pointerEvents = "none";
      this.$emit("deleteContent");
    },
  },
};
</script>

<style lang="scss">
footer {
  .content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .buttons {
      font-size: 1.5em;
      display: flex;
      .delete {
        color: #aa4130;
        padding: 0.25em 1.5em;
        transition: all 0.3s, color 0s;
        border: 1px solid #aa4130;
        border-radius: 3px;
        margin: 0 0.25em;
        cursor: pointer;
        &:hover {
          color: #fff;
          background: #aa4130;
        }
      }
    }
  }
}
</style>
