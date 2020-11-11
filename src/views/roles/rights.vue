<template>
  <div class="rights">
    <!-- 面包屑 -->
    <bread-crumb :breadCrumbObj="breadCrumbObj"></bread-crumb>
    <!-- 表格 -->
    <el-table
      border
      style="width: 100%; margin-top: 15px"
      :data="rightsList"
      height="450"
      stripe
    >
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column
        label="层级"
        prop="level"
        :formatter="filLevel"
      ></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { http } from "../../http";
export default {
  data() {
    return {
      rightsList: [],
      breadCrumbObj: {
        second: "权限管理",
        third: "权限列表",
      },
    };
  },
  methods: {
    //获取所有权限列表
    async getRightsList() {
      const res = await this.$axios("rights/list");
      this.rightsList = res.data;
    },
    filLevel(row) {
      if (row.level == 0) {
        return "一级";
      } else if (row.level == 1) {
        return "二级";
      } else if (row.level == 2) {
        return "三级";
      }
    },
  },
  created() {
    this.getRightsList();
  },
};
</script>
<style lang="scss" scoped>
.rights {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 5px;
}
</style>