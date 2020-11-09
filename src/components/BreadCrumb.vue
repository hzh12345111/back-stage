<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/users?123' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ breadCrumbObj.second }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ breadCrumbObj.third }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    breadCrumbObj: {
      type: Object,
    },
  },
};
</script>

<style>
</style>