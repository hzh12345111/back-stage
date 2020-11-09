<template>
  <div class="login">
    <div class="login-form-warp">
      <h3 class="login-form-title">欢迎登陆</h3>
      <div class="login-form">
        <el-form :model="form" :rules="rules" ref="form" size="small">
          <el-form-item prop="username">
            <el-input placeholder="用户名" v-model="form.username">
              <el-button slot="prepend" icon="el-icon-user-solid"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              v-model="form.password"
              type="password"
            >
              <el-button slot="prepend" icon="el-icon-lock"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" class="btn" @click="login()"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var validateName = (rule, value, callback) => {
      let uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
      if (!uPattern.test(value)) {
        callback(new Error("请输入4到16位（字母，数字，下划线，减号）"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          // { required: true, message: "请输入用户名", trigger: "blur" },
          // { min: 5, max: 5, message: "长度在 5 到 5 个字符", trigger: "blur" },
          { validator: validateName, trigger: "change" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    login() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // const res = await this.$axios("login", this.form, "POST");
          // console.log(res);
          // this.$message({
          //   message: res.meta.msg,
          //   type: "success",
          // });
          // this.$store.commit("SET_TOKEN", res.data.token);
          // this.$router.push("/Home");
          this.$axios("login", this.form, "POST")
            .then((res) => {
              this.$message({
                message: res.meta.msg,
                type: "success",
              });
              this.$store.commit("setUsername", res.data.username);
              this.$store.commit("SET_TOKEN", res.data.token);
              this.$router.push({
                name: 'Users'
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100vh;
  background: url(https://file.iviewui.com/admin-dist/img/login-bg.0899ffa6.jpg)
    center center no-repeat;
  background-size: cover;
  .login-form-warp {
    box-sizing: border-box;
    width: 300px;
    background: #ffffff;
    border-radius: 15px;
    margin-right: 160px;
    .login-form-title {
      padding: 15px;
      border-bottom: 1px solid #ddd;
      font-size: 14px;
      font-weight: 700;
    }
    .login-form {
      padding: 15px;
      .login-form-btn {
        width: 100%;
      }
      .btn {
        width: 100%;
      }
    }
  }
}
</style>
   