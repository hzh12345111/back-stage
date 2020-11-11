<template>
  <div class="orders">
      <!-- 面包屑 -->
    <bread-crumb :breadCrumbObj="breadCrumbObj"></bread-crumb>
  </div>
</template>

<script>
export default {
data() {
  return {
     breadCrumbObj: {
        second: "订单管理",
        third: "订单列表",
      },
  }
},
}
</script>

<style>

</style>