<template lang="pug">
  header
    .content
      .buttons
        .back( @click="goBack()")
          font-awesome-icon.save-icon(:icon="['fas', 'chevron-left']")
      .buttons
        .save( @click="save()")
          font-awesome-icon.save-icon(:icon="['fas', 'check-square']")
        .cancel( @click="cancel()")
          font-awesome-icon.save-icon(:icon="['fas', 'times-circle']")
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push("/admin");
    },
    save() {
      this.$parent.$el.style.opacity = 0.5;
      this.$parent.$el.style.pointerEvents = "none";
      this.$emit("save");
    },
    cancel() {
      this.goBack();
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #ffffff;
  padding: 1em;
  z-index: 99999;
  .content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .buttons {
      font-size: 1.5em;
      display: flex;
      .save,
      .cancel {
        color: #1167b1;
        padding: 0.25em 1.5em;
        transition: all 0.3s, color 0s;
        border: 1px solid #1167b1;
        border-radius: 3px;
        margin: 0 0.25em;
        cursor: pointer;
        &:hover {
          color: #fff;
          background: #1167b1;
        }
      }
      .cancel {
        color: grey;
        border-color: grey;
        &:hover {
          background: grey;
        }
      }
      .back {
        cursor: pointer;
        padding: 0.25em 1.5em;
      }
    }
  }
}
</style>
