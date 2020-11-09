<template>
  <div class="home">
    <el-container style="height: 100vh">
      <el-aside width="auto">
        <el-menu
          unique-opened
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :router="true"
          active-text-color="#fff"
          text-color="#999"
          background-color="#001529"
          :default-active="defaultActive"
        >
          <template>
            <h3 v-if="isCollapse == true" class="logo_img">
              <img
                src="../img/download.jpg"
                style="height: 40px; width: 40px; border-radius: 50%"
              />
            </h3>
            <h3 v-if="isCollapse == false">后台管理</h3>
          </template>
          <el-submenu
            v-for="item in menus"
            :key="item.id"
            :index="'' + item.id"
          >
            <template slot="title">
              <i v-if="item.path == 'users'" class="el-icon-user-solid"></i>
              <i v-if="item.path == 'rights'" class="el-icon-more"></i>
              <i v-if="item.path == 'goods'" class="el-icon-shopping-bag-2"></i>
              <i v-if="item.path == 'orders'" class="el-icon-s-order"></i>
              <i v-if="item.path == 'reports'" class="el-icon-s-data"></i>
              <template v-if="!isCollapse">
                {{ item.authName }}
              </template>
            </template>
            <el-menu-item
              v-for="_item in item.children"
              :key="_item.id"
              :index="'/home/' + _item.path"
              >{{ _item.authName }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- :index="'/home/' +_item.path" -->
      <el-container class="btn_warp">
        <div class="btn" @click="box">
          <i class="el-icon-s-unfold" v-if="isCollapse == true"></i>
          <i class="el-icon-s-fold" v-if="isCollapse == false"></i>
        </div>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="signOut()"
                >退出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ username }}</span>
        </el-header>

        <el-main class="el-main">
          <div class="main_box">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.home {
  overflow: hidden;
  border-left: 1px solid rgb(238, 238, 238);
  height: 100vh;
}
.el-menu {
  background: #001529;
  color: #999;
  border-right: none;
  height: 100vh;
  h3 {
    color: #fff;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-weight: normal;
    font-size: 16px;
  }
  .el-submenu {
    background: #001529;
  }
}
.el-menu-item {
  background: #001529;
}
.el-header {
  border-bottom: 1px solid #ccc;
  line-height: 60px;
}
.el-main {
  overflow: overlay;
  padding: 20px;
  box-sizing: border-box;
  background: rgb(238, 238, 238);
  .main_box {
    border-radius: 5px;
    padding: 15px;
    box-sizing: border-box;
    height: calc(100vh - 100px);
    background: #fff;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 300px;
}
.logo_img {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.btn_warp {
  position: relative;
  .btn {
    font-size: 20px;
    position: absolute;
    left: 20px;
    top: 20px;
  }
}
</style>>

<script>
export default {
  data() {
    return {
      username: localStorage.getItem("username"),
      defaultActive: "",
      // this.$route.path
      menus: [],
      isCollapse: false,
    };
  },
  watch: {
    "$route.path": {
      //监听路由变化
      deep: true, //深度监听
      immediate: true, //首次刷新让watch生效
      handler(current) {
        // console.log(current);
        this.defaultActive = current;
        // this.$forceUpdate() //页面刷新
      },
    },
  },
  methods: {
    async getMenus() {
      //获取左侧菜单权限
      const res = await this.$axios("menus").then((res) => {
        this.menus = res.data;
      });
    },
    box() {
      //点击折叠左侧菜单
      this.isCollapse = !this.isCollapse;
    },
    signOut() {
      //退出
      localStorage.clear();
      this.$store.commit("resetState");
      this.$router.push("/login");
    },
  },
  created() {
    this.getMenus();
  },
};
</script>