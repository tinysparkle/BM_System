<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- alert警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置参数！" type="warning" :closable="false" show-icon></el-alert>
      <!-- 级联选择器区域 -->
      <el-row class="cate-opt">
        <el-col>
          <span>请选择商品分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- Tab标签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddParams"
          >添加参数</el-button>
          <!-- 动态表格区域 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddParams"
          >添加属性</el-button>
          <!-- 静态表格区域 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addParamsVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsRules"
        ref="addParamsForm"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话筒 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editParamsVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editParamsForm"
        :rules="editParamsRules"
        ref="editParamsForm"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { log } from "util";
import { validate } from "json-schema";
import { async } from "q";
export default {
  data() {
    return {
      // 所有商品分类数据
      cateList: [],
      // 级联选择器已选中的cat_id值
      selectedKeys: [],
      // Tab标签默认选中项
      activeName: "many",
      // 动态表格数据
      manyTableData: [],
      // 静态表格数据
      onlyTableData: [],
      // 添加参数对话框默认隐藏
      addParamsVisible: false,
      // 添加参数对话框数据源
      addParamsForm: {
        attr_name: ""
      },
      // 添加参数对话框校验规则
      addParamsRules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      // 修改参数对话康默认隐藏
      editParamsVisible: false,
      editParamsForm: {
        attr_name: ""
      },
      editParamsRules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有分类商品数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类信息失败！");
      }
      this.cateList = res.data;
    },
    // 级联选择框中项发生变化，会触发这个函数
    handleChange() {
      this.getCateParams();
    },
    // Tab标签点击处理函数
    handleTabClick() {
      this.getCateParams();
    },
    // 获取分类参数
    async getCateParams() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });

      if (res.meta.status !== 200) {
        this.$message.error("获取参数失败！");
      }
      // 判断获取到的数据是动态数据还是静态数据
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 添加参数对话框
    showAddParams() {
      this.addParamsVisible = true;
    },
    // 监听添加参数对话框关闭
    addDialogClosed() {
      this.$refs.addParamsForm.resetFields();
    },
    // 添加动态参数或者静态属性
    addParams() {
      this.$refs.addParamsForm.validate(async validate => {
        if (!validate) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateID}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败！");
        }
        this.$message.success("添加成功!");
        this.getCateParams();
      });
      this.addParamsVisible = false;
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes/${id}`,
        { params: { attr_sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败！");
      }
      this.editParamsForm.attr_name = res.data.attr_name;
      this.editParamsForm.attr_id = res.data.attr_id;
      this.editParamsVisible = true;
    },
    editDialogClosed() {
      this.$refs.editParamsForm.resetFields();
    },
    // 编辑提交参数
    commitEdit() {
      this.$refs.editParamsForm.validate(async validate => {
        if (!validate) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateID}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) {
          return this.error("修改失败！");
        }
        this.getCateParams();
      });
      this.editParamsVisible = false;
    },
    // 删除参数
    deleteParams(attrid) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.cateID}/attributes/${attrid}`
          );
          if (res.meta.status !== 200) {
            return;
          }
          this.getCateParams();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 如果没有return 说明输入的值合法，进行后续操作
      row.attr_vals.push(row.inputValue);
      row.inputValue = "";
      row.inputVisible = false;
      this.alterPramas(row);
    },
    async alterPramas(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateID}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        this.$message.error("修改参数失败！");
      }
      this.$message.success("修改参数成功！");
    },
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.alterPramas(row);
    }
  },
  // 计算属性
  computed: {
    // 如果数组中的长度不为3，则返回true 表示禁用
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 分类id
    cateID() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
    },
    // 添加参数对话框title
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.cate-opt {
  margin: 15px 0;
}
.el-tag {
  margin: 0 10px;
}

.input-new-tag {
  width: 120px;
}
</style>