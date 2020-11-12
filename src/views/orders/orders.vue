<template>
  <div class="orders">
    <!-- 面包屑 -->
     <bread-crumb :breadCrumbObj="breadCrumbObj"></bread-crumb>
    <el-table :data="orderList.goods" style="width: 100%;margin-top:20px" border>
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column label="订单编号" prop="order_number"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          <el-button  :type="scope.row.order_pay==0?'danger':'primary'" plain size="small" >{{scope.row.order_pay | filOrdePay}}</el-button>
          </template>
        
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <el-table-column label="下单时间" prop="update_time"></el-table-column>
      <el-table-column label="操作">
        <el-button icon="el-icon-edit" size="small" plain></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="params.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="params.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="orderList.total"
    ></el-pagination>
    
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderList: [],
      params:{
        pagenum: 1,
        pagesize: 10
      },
      breadCrumbObj: {
        second: "订单管理",
        third: "订单列表",
      },
    };
  },
  methods: {
    //获取订单列表
    async getOrderList() {
      const res=await this.$axios('orders',{},'GET',this.params)
      this.orderList=res.data
    },
    //显示条数
    handleSizeChange(num){
      this.params.pagesize=num;
      this.getOrderList()
    },
    //页数
    handleCurrentChange(num){
      this.params.pagenum=num;
      this.getOrderList()
    }
  },
  created(){
    this.getOrderList()
  },
  filters:{
    filOrdePay(msg){
      if(msg==0){
          return "未付款"
      }else if(msg==1){
         return "已付款"
      }else if(msg==2){
         return "待定"
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.orders {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 5px;
}
</style>