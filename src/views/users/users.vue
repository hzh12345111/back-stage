<template>
  <div class="users">
    <!-- 面包屑 -->
    <bread-crumb :breadCrumbObj="breadCrumbObj"></bread-crumb>
    <!-- 查询框 -->
    <div class="check">
      <el-input placeholder="请输入内容" v-model="query" class="ipt" @keyup.enter.native="searchUsers()">
        <el-button slot="append" @click="searchUsers()" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="primary"  class="adduser" @click="openAddUsersDialog()">添加用户</el-button>
    </div>

    <!-- 表格 -->
    <template>
      <el-table :data="obj.users" border="" class="biao">
        <el-table-column type="index" width="55" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username" width="180"></el-table-column>
        <el-table-column label="邮箱" prop="email" width="180"></el-table-column>
        <el-table-column label="电话" prop="mobile" width="206"></el-table-column>
        <el-table-column label="创建日期" prop="create_time" width="242">
          <template slot-scope='slot'>
            {{slot.row.create_time|handelDate}}
          </template>
        </el-table-column>
        <el-table-column label="用户状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch
              @change="editUsersStatus(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>  
          </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="small" @click="openEditUsersDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="small" @click="deletUsers(scope.row.id)"></el-button>
            <el-button type="success" icon="el-icon-check" circle size="small" @click="rolesUser(scope.row)"></el-button>
          </template>  
        </el-table-column>
      </el-table>
    </template>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 15px"
      :current-page="params.pagenum"
      :page-sizes="[2, 3, 4, 8]"
      :page-size="params.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="obj.total"
      @size-change='handelSizeChange'
      @current-change='handelCurrentChange'
    ></el-pagination>

    <!-- 添加用户 -->
    <!-- :visible.sync:控制弹窗显示隐藏 -->
    <el-dialog
        title="新增用户"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose">
        <el-form :model="addUsersObj" :rules="addUsersRules" ref="addUserForm">
          <el-form-item label="用户名" :label-width="'120px'" prop='username'>
            <el-input v-model="addUsersObj.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="'120px'" prop='password'>
            <el-input v-model="addUsersObj.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="'120px'">
            <el-input v-model="addUsersObj.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="'120px'">
            <el-input v-model="addUsersObj.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAddUsers()">取 消</el-button>
          <el-button type="primary" @click="addUsers()">确 定</el-button>
        </span>
      </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisble"  width="600px">
      <el-form :model="editUserObj">
        <el-form-item label="用户名" :label-width="'120px'" prop="username">
          <el-input v-model="editUserObj.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="'120px'">
          <el-input v-model="editUserObj.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="'120px'">
          <el-input v-model="editUserObj.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEditUsers()">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配用户角色 -->
    <!-- :visible.sync:控制弹窗显示隐藏 -->
    <el-dialog title="分配角色" :visible.sync="UserAllotdialog"  width="600px">
      <el-form :model="rolesUserForm">
        <el-form-item label="用户名" :label-width="'120px'">
          <el-input v-model="rolesUserForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="'120px'">
          <el-select v-model="rolesUserForm.rid" placeholder="请选择">
            <el-option label="请选择"  :value="-1"></el-option>
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="UserAllotdialog=false">取 消</el-button>
        <el-button type="primary" @click="putUserRoles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {
      breadCrumbObj: {
        second: "用户管理",
        third: "用户列表",
      },
      params: {
        query: "",
        pagenum: 1,
        pagesize: 4,
      },
       addUsersObj: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
       editUserObj: {
        username: "",
        email: "",
        mobile: ""
      },
      query:"",
      userList: [],
      input1: "",
      obj: [],
      rolesUserForm: [],
      rolesList:[],
      dialogVisible: false,
      editDialogVisble: false,
      UserAllotdialog:false,
      addUsersRules: {
        username: { required: true, message: "请输入用户名", trigger: "blur" },
        password: { required: true, message: "请输入密码", trigger: "blur" }
      }
    };
  },
  methods: {
    async grtUsers() {
      // 获取数据用户列表
      const res = await this.$axios("users", {}, "GET", this.params);
      // console.log(res);
      this.obj = res.data;
    },
    handelSizeChange(val){ 
      //每页条数发生变化 ，获取用户列表
      setTimeout(async()=>{
        this.params.pagesize=val;
        const res = await this.$axios("users", {}, "GET", {...this.params,pagesize:val});
        this.obj = res.data;
      },100)
    },
    async handelCurrentChange(val){
      //页码跳转
      this.params.pagenum=val;
      const res =await this.$axios("users", {}, "GET", {...this.params,pagenum:val});
      this.obj = res.data;
    },
    async searchUsers(){
      //搜索框 查询
      const res =await this.$axios("users", {}, "GET", {...this.params,query:this.query});
      this.params.query=this.query;
      this.obj = res.data;
    },
    async editUsersStatus(obj){
      //修改用户状态
      const res = await this.$axios(`users/${obj.id}/state/${obj.mg_state}`,{},"PUT")
       this.$message({
            message: res.meta.msg,
            type: "success",
        });
    },
    openAddUsersDialog(){
      //打开添加用户弹窗
      this.dialogVisible=true;
    },
    addUsers(){
      //确定添加用户
      this.$refs.addUserForm.validate(async valid => {
        if(valid){
          const res =await this.$axios('users',this.addUsersObj,'POST')
          this.$message({
                message: res.meta.msg,
                type: "success",
          });
          this.$refs.addUserForm.resetFields();
          this.dialogVisible=false;
          this.grtUsers()
        }else{
          return false
        }
      })
    },
    cancelAddUsers(){
      //取消添加用户
      this.$refs.addUserForm.resetFields();
      this.dialogVisible=false;
    },
    handleClose(done) {
      //添加用户关闭弹窗
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    openEditUsersDialog(obj){
      //编辑用户提交
      this.editDialogVisble=true;
      this.editUserObj=JSON.parse(JSON.stringify(obj)) 
    },
    cancelEditUsers(){
      //取消编辑按钮
      this.editDialogVisble=false;
    },
    async editUser(){
      //确定编辑按钮
      const res=await this.$axios(`users/${this.editUserObj.id}`,this.editUserObj,'PUT')
      this.$message({
            message: res.meta.msg,
            type: "success",
      });
      this.editDialogVisble=false;
      this.grtUsers()
    },
    
    async getUserList() {
      //用户角色列表
      const res= await this.$axios("roles",'GET')
      this.rolesList = res.data;
      console.log(res.data)
    },
    async rolesUser(obj){
      //  分配用户 
      const res =await this.$axios(`users/${obj.id}`,'GET')
      this.rolesUserForm = res.data;
      console.log(this.rolesUserForm)
      this.UserAllotdialog = true;
    },
    async putUserRoles(){
      //提交用户角色按钮
      const { id, rid } = this.rolesUserForm; 
      console.log(id,rid)
      const res = await this.$axios(`users/${id}/role`, {rid}, 'PUT') 
      this.$message({
          message: res.meta.msg,
          type: "success"
      });
      this.UserAllotdialog=false;
      this.grtUsers();
    },
    deletUsers(id){
      //删除用户弹窗
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res=await this.$axios(`users/${id}`,{},'DELETE')
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
           this.grtUsers()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
  filters:{ //过滤时间
    handelDate(val){
       return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  created() {
    this.grtUsers();
    this.getUserList()
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
</style>>
