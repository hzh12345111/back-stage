<template>
  <div class="roles">
    <!-- 面包屑 -->
    <bread-crumb :breadCrumbObj="breadCrumbObj"></bread-crumb>
    <el-button type="primary" class="btn-role" @click="gitRoles()"
      >添加角色</el-button
    >
    <!-- 表格 -->
    <div class="box">
      <el-table :data="rolesList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <template v-if="scope.row.children.length > 0">
              <el-row
                v-for="(item, index) in scope.row.children"
                :key="item.id"
              >
                <el-col :span="4">
                  <el-tag
                    closable
                    @close="delectAuthority(scope.row, item.id, 0, index)"
                    >{{ item.authName }}</el-tag
                  >
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-row
                    v-for="(_item, _index) in item.children"
                    :key="_item.id"
                  >
                    <el-col :span="4">
                      <el-tag
                        closable
                        type="success"
                        @close="
                          delectAuthority(scope.row, _item.id, 1, index, _index)
                        "
                        >{{ _item.authName }}</el-tag
                      >
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                    <el-col :span="20">
                      <el-tag
                        closable
                        type="warning"
                        v-for="(__item, __index) in _item.children"
                        :key="__item.id"
                        @close="
                          delectAuthority(
                            scope.row,
                            __item.id,
                            2,
                            index,
                            _index,
                            __index
                          )
                        "
                        >{{ __item.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
            <span v-else>暂无权限</span>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
          width="180"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
          width="180"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="small"
              @click="editRoles(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              circle
              size="small"
              @click="editAuthority(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              @click="removeRoles(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加角色-->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-form :model="formRoles">
        <el-form-item label="角色名称" :label-width="'120px'" prop="roleName">
          <el-input v-model="formRoles.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="'120px'" prop="roleDesc">
          <el-input v-model="formRoles.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRoles()">取 消</el-button>
        <el-button type="primary" @click="gitAddRoles()">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑角色-->
    <el-dialog title="编辑角色" :visible.sync="editrolesdialog">
      <el-form :model="editrolesform">
        <el-form-item label="角色名称" :label-width="'80px'" prop="roleName">
          <el-input
            v-model="editrolesform.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="'80px'">
          <el-input
            v-model="editrolesform.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editrolesdialog = false">取 消</el-button>
        <el-button type="primary" @click="putEditRoles()">确 定</el-button>
      </div>
    </el-dialog>
    <!--角色权限-->
    <el-dialog :visible.sync="editAuthoritydialog">
      <el-tree 
         :data="authorityList"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        ref="tree"
        default-expand-all>
      </el-tree>
       <div slot="footer" class="dialog-footer">
        <el-button @click="editAuthoritydialog = false">取 消</el-button>
        <el-button type="primary" @click="putEditAuthority()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breadCrumbObj: {
        second: "权限管理",
        third: "角色列表",
      },
      rolesList: [],
      dialogVisible: false,
      editrolesdialog: false,
      editAuthoritydialog:false,
      formRoles: {
        roleName: "",
        roleDesc: "",
      },
      editrolesform: {
        id: "",
        roleName: "",
        roleDesc: "",
      },
      authorityList:[],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      roleId: ""
    };
  },
  methods: {
    async getRolesList() {
      //获取角色列表
      const res = await this.$axios("roles", {}, "GET");
      this.rolesList = res.data;
      // console.log(res.data);
    },
    async delectAuthority(scopeRow, rightId, index, ...arr) {
      //删除角色权限
      const res = await this.$axios(
        `roles/${scopeRow.id}/rights/${rightId}`,
        {},
        "DELETE"
      );
      if (index == 0) {
        scopeRow.children.splice(arr[0], 1);
      } else if (index == 1) {
        scopeRow.children[arr[0]].children.splice(arr[1], 1);
      } else if (index == 2) {
        scopeRow.children[arr[0]].children[arr[1]].children.splice(arr[2], 1);
      }
      this.$message({
        message: res.meta.msg,
        type: "success",
      });
    },
    gitRoles() {
      //打开对话开框
      this.dialogVisible = true;
    },
    async gitAddRoles() {
      //确定添加角色
      const res = await this.$axios("roles", this.formRoles, "POST");
      console.log(res);
      this.$message({
        message: res.meta.msg,
        type: "success",
      });
      this.getRolesList();
      this.dialogVisible = false;
      this.formRoles.roleName = "";
      this.formRoles.roleDesc = "";
    },
    cancelRoles() {
      //取消添加角色
      this.formRoles.roleName = "";
      this.formRoles.roleDesc = "";
      this.dialogVisible = false;
    },
    editRoles(obj) {
      //编辑角色
      this.editrolesdialog = true;
      this.editrolesform = JSON.parse(JSON.stringify(obj));
    },
    async putEditRoles() {
      //提交角色
      const { id, roleName, roleDesc } = this.editrolesform;
      const res = await this.$axios(
        `roles/${id}`,
        { roleName, roleDesc },
        "PUT"
      );
      this.$message({
        showClose: true,
        message: res.meta.msg,
        type: "success",
      });
      this.editrolesdialog = false;
      this.getRolesList();
    },
    removeRoles(id) {
      //删除角色
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios(`roles/${id}`, {}, "delete")
            .then((res) => {
              this.$message({
                showClose: true,
                message: res.meta.msg,
                type: "success",
              });
              this.getRolesList();
            })
            .catch((err) => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async getAuthorityTree() {
      //获取权限列表
      const  res =await this.$axios('rights/tree')
      this.authorityList=res.data;
    },
    async editAuthority(obj) {
       //显示编辑权限弹窗  先获取所有的权限列表，然后将已有权限渲染
      this.roleId = obj.id;
      await this.getAuthorityTree(); //同步执行，只有当数据调取成功才显示弹窗  也可以使用then（显示tanc）
      this.editAuthoritydialog = true; //dom渲染是异步操作，所以使用$nextTick等dom渲染完成之后进行操作
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(obj.children); //渲染已有权限
      });
    },
    async putEditAuthority() {
      const rids = this.$refs.tree.getCheckedKeys().join(","); //获取选中的权限
      // getCheckedKeys  通过key选中权限列表
      console.log(rids)
      const res=await this.$axios(`roles/${this.roleId}/rights`,{rids},'POST')
       this.$message({
          showClose: true,
          message: res.meta.msg,
          type: "success"
        });
        this.editAuthoritydialog = false;
        this.getRolesList()
    }
  },
  created() {
    this.getRolesList();
  },
};
</script>

<style lang="scss" scoped>
.roles {
  box-sizing: border-box;
  height: 520px;
  overflow-y: auto;
  .btn-role {
    margin-top: 15px;
  }
}
</style>>

</style>