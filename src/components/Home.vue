<template>
  <div>
    <el-button type='info' @click="exit">退出</el-button>
  </div>
</template>

<script>
export default {
  data(){
    return {

    }
  },
  methods:{
    exit() {
      // 销毁sessionstorage中的token值
      window.sessionStorage.clear();
      // 跳转到登录页面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>