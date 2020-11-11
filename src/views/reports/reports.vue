<template>
  <div class="reports">
    <!-- 面包屑 -->
    <bread-crumb :breadCrumbObj="breadCrumbObj"></bread-crumb>
    <!-- <chart ref="charts" :options="option"></chart> -->
    <div id="main" ref="echart"></div>
  </div>
</template>


<script>
import echarts from "echarts";
export default {
  data() {
    return {
      breadCrumbObj: {
        second: "数据统计",
        third: "数据报表",
      },
      type: "1",
      option: {},
    };
  },
  created() {
    this.getReports();
  },
  methods: {
    getReports() {
      this.$axios(`reports/type/${this.type}`, "get")
        .then((res) => {
          // console.log(res);
          this.option = res.data;
          const optionEcharts = {
            title: {
              text: "",
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                label: {
                  backgroundColor: "#6a7985",
                },
              },
            },
            legend: {
              data: [
                "邮件营销",
                "联盟广告",
                "视频广告",
                "直接访问",
                "搜索引擎",
              ],
            },
            toolbox: {
              feature: {
                saveAsImage: {},
              },
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
          };
          this.myChart.setOption({ ...this.option, ...optionEcharts });
        })
        .catch((err) => {});
    },
    showData() {
      // console.log(this);
    },
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("main"));
  },
};
</script>


<style lang="scss" scoped>
.reports {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 5px;
}  
.echarts,
#main {
  width: 100%;
  height: 500px !important;
}
</style>