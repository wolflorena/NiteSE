<script setup>
const props = defineProps({
  title: String,
});
</script>

<template>
  <button>{{ title }}</button>
</template>

<style scoped lang="less">
button {
  width: 100px;
  height: 40px;
  border-radius: 25px;
  padding: 10px;

  background-color: #ddb31b;
  color: black;
  border: none;

  font-size: large;

  cursor: pointer;
}
</style>
