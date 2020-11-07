<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card视图区域 -->
    <el-card>
      <div>
        <el-input placeholder="请输入内容" class="input-with-select" v-model="goodsProp.query" clearable @clear="getGoodsList()">
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
        </el-input>
        <el-button type="primary" @click="toAdd">添加商品</el-button>
      </div>

      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <!-- <el-button type="primary" icon="el-icon-edit" size="mini"></el-button> -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delBtnById(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 商品分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsProp.pagenum"
        :page-sizes="[10, 15, 20, 40]"
        :page-size="goodsProp.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { log } from "util";
export default {
  data() {
    return {
      // 商品列表数据
      goodsList: [],
      // 请求参数
      goodsProp: {
        query:'',
        pagenum: 1,
        pagesize: 10
      },
      // 商品总数
      total: 0,
     
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get(`goods`, {
        params: this.goodsProp
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表数据失败！");
      }

      this.goodsList = res.data.goods;

      this.total = res.data.total;
    },
    // 处理分页显示数量
    handleSizeChange(arg) {
     this.goodsProp.pagesize = arg
     this.getGoodsList()
    },
    // 处理当前页码变化
    handleCurrentChange(arg) {
      this.goodsProp.pagenum = arg
      this.getGoodsList();
    },
    delBtnById(id) {
       this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$http.delete(`goods/${id}`)
          if(res.meta.status !== 200) {
            return
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getGoodsList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    toAdd() {
      this.$router.push('/goods/add')
    }
  }
};
</script>

<style lang="less" scoped>
.input-with-select {
  width: 300px;
  margin-right: 20px;
}
</style>