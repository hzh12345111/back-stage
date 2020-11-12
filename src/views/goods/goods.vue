<template>
  <div class="goods">
    <!-- 面包屑 -->
    <bread-crumb :breadCrumbObj="breadCrumbObj"></bread-crumb>
    <!-- 查询框 -->
    <div class="check">
      <el-input placeholder="请输入内容" v-model="query" class="ipt" @keyup.enter.native="searchUsers()">
        <el-button slot="append" @click="searchUsers()" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="primary"  class="adduser" >添加商品</el-button>
    </div>
    <!-- 表格 -->
    <template>
       <el-table :data="obj.goods" border="" class="biao">
        <el-table-column type="index" width="55" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="754"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="100"></el-table-column>
        <el-table-column label="创建日期" prop="upd_time" width="120">
          <template slot-scope='slot'>
            {{slot.row.upd_time|handelDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size='small'></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size='small'></el-button>
          </template>  
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <el-pagination
      style="margin-top: 15px"
      :current-page="params.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="params.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="obj.total"
      @size-change='handelSizeChange'
      @current-change='handelCurrentChange'
    ></el-pagination>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {
      breadCrumbObj: {
        second: "商品管理",
        third: "商品列表",
      },
      params: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      query:'',
      obj:[]
    };
  },
  methods: {
    async gitGoodsList(){
      const res=await this.$axios('goods',{},"GET",this.params)
      this.obj=res.data;
    },
    handelSizeChange(val){ 
      //每页条数发生变化 ，获取用户列表
      setTimeout(async()=>{
        this.params.pagesize=val;
        const res = await this.$axios("goods", {}, "GET", {...this.params,pagesize:val});
        this.obj = res.data;
      },100)
    },
    async handelCurrentChange(val){
      //页码跳转
      this.params.pagenum=val;
      console.log(val)
      const res =await this.$axios("goods", {}, "GET", {...this.params,pagenum:val});
      this.obj = res.data;
      console.log(this.obj)
    },
    async searchUsers(){
      //搜索框 查询
      const res =await this.$axios("goods", {}, "GET", {...this.params,query:this.query});
      this.params.query=this.query;
      this.obj = res.data;
    },
  },
  filters:{ //过滤时间
    handelDate(val){
       return dayjs(val).format("YYYY-MM-DD");
    }
  },
  created() {
    this.gitGoodsList()
  },
};
</script>

<style lang="scss" scoped>
.check {
  margin-top: 15px;
  .ipt {
    margin-right: 10px;
    margin-bottom: 20px;
    width: 264px;
  }
}
.biao{
  height: 444px;
  overflow-y:inherit ;
}
.el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
}
</style>>