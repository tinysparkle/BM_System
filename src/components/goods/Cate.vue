<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card区域 -->
    <el-card>
      <el-button type="primary" @click="addCateBtn">添加分类</el-button>

      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        :data="categories"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen;"></i>
          <i class="el-icon-error" v-else></i>
        </template>

        <!-- 排序模板 -->

        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>

        <!-- 操作模板 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="editBtn(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleBtnById(scope.row.cat_id)"
          ></el-button>
        </template>
      </tree-table>

      <!-- 页码区域 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="currentChange"
        @size-change="sizeChange"
      ></el-pagination>
    </el-card>

    <!-- 添加分类区域 -->
    <el-dialog title="添加分类" :visible.sync="addCateVisible" width="50%" @close="addCateClose">
      <el-form ref="addCateRef" label-width="100px" :rules="addCateRules" :model="addCateForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectedCate"
            :options="parentCateList"
            expandTrigger="hover"
            @change="parentCateChanged"
            :props="cascaderPrpos"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitAddCateBtn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类区域 -->
    <el-dialog title="编辑分类" :visible.sync="editCateVisible" width="50%">
      <el-form ref="editCateRef" label-width="100px" :rules="addCateRules" :model="editCateForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitEditCateBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有分类商品
      categories: [],
      // 查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品总数
      total: 0,
      // 表格各列的配置
      columns: [
        {
          label: "商品名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          // 将当前列定义为模板列
          type: "template",
          // 表示当前列的模板名称
          template: "isok"
        },
        {
          label: "排序",
          // 将当前列定义为模板列
          type: "template",
          // 表示当前列的模板名称
          template: "order"
        },
        {
          label: "操作",
          // 将当前列定义为模板列
          type: "template",
          // 表示当前列的模板名称
          template: "opt"
        }
      ],
      // 添加分类弹出框默认隐藏
      addCateVisible: false,
      // 选中的分类
      selectedCate: [],
      // 添加分类校验
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 1, max: 4, message: "长度在1到4个字符", trigger: "blur" }
        ]
      },
      addCateForm: {
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级,默认添加一级分类
        cat_level: 0
      },
      // 所有父级分类列表
      parentCateList: [],
      cascaderPrpos: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true
      },
      cateId: 0,
      editCateForm: {},
      editCateVisible: false
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });

      if (res.meta.status !== 200) {
        this.$message.error("获取数据失败");
      }
      this.categories = res.data.result;

      this.total = res.data.total;
    },
    // 页数改变时的事件
    currentChange(value) {
      this.queryInfo.pagenum = value;
      this.getCategories();
    },
    // 每页条数改变时的事件
    sizeChange(value) {
      this.queryInfo.pagesize = value;
      this.getCategories();
    },
    // 添加分类按钮
    addCateBtn() {
      this.getParentCate();
      this.addCateVisible = true;
    },

    // 获取所有父级的分类
    async getParentCate() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取所有父级分类失败!");
      }
      this.parentCateList = res.data;
    },
    parentCateChanged() {
      if (this.selectedCate.length > 0) {
        this.addCateForm.cat_pid = this.selectedCate[
          this.selectedCate.length - 1
        ];
        this.addCateForm.cat_level = this.selectedCate.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 提交添加商品分类
    commitAddCateBtn() {
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败!");
        }
        this.$message.success("添加成功!");
      });
      this.getCategories();
      this.addCateVisible = false;
    },
    addCateClose() {
      this.$refs.addCateRef.resetFields();
      this.selectedCate = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    editBtn(info) {
      this.editCateForm = info;
      this.cateId = info.cat_id;
      this.editCateVisible = true;
    },
    async commitEditCateBtn() {
      const { data: res } = await this.$http.put("categories/" + this.cateId, {
        cat_name: this.editCateForm.cat_name
      });
      if (res.meta.status !== 200) {
        return this.$message.error("更新失败！");
      }
      this.$message.success("更新失败！");
      this.getCategories();
      this.editCateVisible = false;
    },
    deleBtnById(id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("categories/" + id);
          if(res.meta.status!==200) {
            return this.$message.error("删除失败！")
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
            this.getCategories()
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>