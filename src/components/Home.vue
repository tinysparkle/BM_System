<template>
  <el-container class="home-container">
    <!-- 侧边栏区域 -->
    <el-aside :width="isCollapse?'64px':'200px'">
      <div class="logo">
        <img src="../assets/logo.png" alt width="60px" />
      </div>
      <div class="toggleCollapse" @click="toggle">|||</div>
      
      <el-menu
        :default-active="activePaths" 
        background-color="#333744"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        router
      >
        <!-- 一级菜单 -->
        <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
          <template slot="title">
            <i :class="iconObj[item.id]"></i>
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            :index="'/'+subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="activePath('/'+subItem.path)"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <h1>欢迎使用后台管理系统</h1>
        <el-button class="exitBtn" type="warning" @click="exit" size="small">退出</el-button>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getMenu();
    // 记录刷新前状态
    this.activePaths = window.sessionStorage.getItem("activePath")
  },
  data() {
    return {
      menuList: [],
      iconObj: {
        "125": "el-icon-s-custom",
        "103": "el-icon-s-tools",
        "101": "el-icon-s-goods",
        "102": "el-icon-s-order",
        "145": "el-icon-s-data"
      },
      isCollapse: false,
      activePaths:''
    };
  },
  methods: {
    // 退出按钮
    exit() {
      // 销毁sessionstorage中的token值
      window.sessionStorage.clear();
      // 跳转到登录页面
      this.$router.push("/login");
    },
    // 获取左侧菜单列表
    async getMenu() {
      const { data: res } = await this.$http.get("menus");

      if (res.meta.status != 200) this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    // 侧边栏切换形态
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    // 设置二级菜单高亮效果
    activePath(path) {
      window.sessionStorage.setItem("activePath",path)
      this.activePaths = path
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-aside {
  background-color: #333744;
  overflow: hidden;
  .el-menu {
    border-right: 0;
  }
}
.el-header {
  background-color: #f6f6f6;
}
.el-header h1 {
  display: inline-block;
}
.el-main {
  background-color: #eaedf1;
}

.exitBtn {
  float: right;
  margin: 10px 0;
}

.logo {
  width: 200px;
  height: 60px;
  background-color: #333744;
}

.logo img {
  display: block;
  margin: 0 auto;
}
.toggleCollapse {
  background-color: #000;
  font-size: 15px;
  color: #fff;
  text-align: center;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
// 侧边栏切换动画
// .el-menu-vertical-demo:not(.el-menu--collapse) {
//     width: 200px;
//     min-height: 400px;
//   }
</style>