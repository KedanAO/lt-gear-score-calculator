<script setup>

</script>

<template>
  <div class="option">
    <slot>Option</slot>
  </div>
</template>
<style scoped>
.option{
  position: relative;
  padding: 5px 10px;
  border: 1px solid gray;
  border-radius: 4px;
  cursor: pointer;
  background-color: #fefeff;
  z-index: 300;
  margin-bottom: 1px;
}

.option:hover {
  background-color: #f1f1f3;
}
</style>