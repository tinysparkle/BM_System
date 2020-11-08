<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="props.query" clearable @clear="getOrders()">
            <el-button slot="append" icon="el-icon-search" @click="getOrders()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay==='1'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope>
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="showBtn"></el-button>
            <!-- <el-button icon="el-icon-location" type="success" size="mini" @click="showProgress"></el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="props.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="props.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="addressDialogClose"
      >
        <el-form
          :model="adressForm"
          :rules="adressFormRules"
          ref="adressFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="活动名称" prop="address1">
            <el-cascader v-model="adressForm.address1" :options="cityData"></el-cascader>
          </el-form-item>
          <el-form-item label="活动名称" prop="address2">
            <el-input v-model="adressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%" >
        <span>这是物流信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="progressVisible = false">取 消</el-button>
          <el-button type="primary" @click="progressVisible = false">确 定</el-button>
        </span>
      </el-dialog> -->
    </el-card>
  </div>
</template>

<script>
import cityData from "./cityData";
export default {
  data() {
    return {
      tableData: [],
      // 订单列表请求参数
      props: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      addressVisible: false,
      adressForm: {
        address1: [],
        address2: ""
      },
      adressFormRules: {
        address1: [
          { required: true, message: "请选择一个地区", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      cityData,
      progressVisible:false,
      progress:[]
    };
  },
  created() {
    this.getOrders();
  },
  methods: {
    async getOrders() {
      const { data: res } = await this.$http.get("orders", {
        params: this.props
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单数据失败！");
      }
      this.tableData = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(s) {
      this.props.pagesize = s;
      this.getOrders();
    },
    handleCurrentChange(s) {
      this.props.pagenum = s;
      this.getOrders();
    },
    showBtn() {
      this.addressVisible = true;
    },
    addressDialogClose() {
      this.$refs.adressFormRef.resetFields();
    },
    async showProgress() {
      // 供测试的物流单号：1106975712662
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败!')
      }
      this.progress= res.data
      this.progressVisible = true

    }
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>