<template>
  <div class="login-container">
    <div class="login-box">
      <h1>LOGIN</h1>

      <!-- 登陆表单区域 -->
      <div class="login-input">
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输密码"
              prefix-icon="el-icon-lock"
              type="password"
            ></el-input>
          </el-form-item>
          <el-button @click="login" type="primary" round>login</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(async valid => {
        // 不为true 则校验失败 return
        if (!valid) return;
        // 结构赋值 取出data
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status != 200)
          return this.$message({
            showClose: true,
            message: "用户名或密码失败",
            type: "error"
          });
        this.$message({
          showClose: true,
          message: "登陆成功",
          type: "success"
        });

        //  将登陆后得token保存到sessionStorage中
        window.sessionStorage.setItem("token", res.data.token);
        // 编程式跳转页面
        this.$router.push('\home')
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  background: url("../assets/imgs/login-bj.png") no-repeat;
  background-size: 100% 100%;
  height: 100%;
}
.login-box {
  background-color: #00000090;
  width: 450px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
  text-align: center;
}

.login-input {
  padding: 0 100px;
  margin-top: 30px;
}

.login-input button {
  width: 150px;
}

.login-box h1 {
  color: #ffffff;
  text-align: center;
}
</style>