<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="userprop.query" clearable @clear="getUserlist">
            <el-button slot="append" icon="el-icon-search" @click="getUserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addUserVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <!-- 操作，例如修改删除 需要拿到用户id进行删除 所以需要作用域插槽 -->
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleUser(scope.row.id)"
            ></el-button>
            <!-- 管理按钮 -->
            <el-tooltip effect="dark" content="用户管理" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userprop.pagenum"
        :page-sizes="[1, 2, 6, 10]"
        :page-size="userprop.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- dialog添加用户区 -->
    <el-dialog title="添加用户" :visible.sync="addUserVisible" width="50%" @close="closeDialog">
      <!-- 表单验证 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- dialog修改用户区 -->
    <el-dialog title="修改用户" :visible.sync="editUserVisible" width="50%" @close="editDialogClosed">
      <!-- 表单验证 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色区域 -->
    <el-dialog title="分配角色" :visible.sync="setRoleVisible" width="50%">
      <div>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
      </div>
      <div>
        <span>分配新角色：</span>
        <el-select v-model="selectedId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitSetRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义校验规则
    // 验证邮箱规则
    const checkEmail = (rule, value, cb) => {
      var emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (emailReg.test(value)) {
        // 邮箱合法
        return cb();
      }
      cb(new Error("清输入合法的邮箱"));
    };
    // 验证手机规则
    const checkMobile = (rule, value, cb) => {
      var mobileReg = /^1(3|4|5|6|7|8|9)\d{9}$/;

      if (mobileReg.test(value)) {
        // 手机号合法
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 查询参数
      userprop: {
        query: "",
        pagenum: 1,
        pagesize: 6
      },
      // 保存用户数据
      userlist: [],
      total: 0,
      // 添加用户区域是否显示
      addUserVisible: false,
      // 修改用户是否显示
      editUserVisible: false,
      // 添加用户表单对象
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 修改用户表单对象
      editForm: {
        email: "",
        mobile: ""
      },
      // 添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在6到12个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 分配角色区域默认隐藏
      setRoleVisible: false,
      // 所有角色列表
      roleList: [],
      // 已选中的角色id值
      selectedId: "",
      // 当前选中的用户信息
      userInfo:[]
    };
  },
  created() {
    // 页面加载查询用户信息
    this.getUserlist();
  },
  methods: {
    // 获取用户列表
    async getUserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.userprop
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户信息失败！");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    // 每页条数
    handleSizeChange(pagesizes) {
      this.userprop.pagesize = pagesizes;
      this.getUserlist();
    },
    // 当前页改变时触发
    handleCurrentChange(pagechange) {
      this.userprop.pagenum = pagechange;
      this.getUserlist();
    },
    // 修改用户状态
    async userStateChange(userState) {
      const { data: res } = await this.$http.put(
        `users/${userState.id}}/state/${userState.mg_state}`
      );
      if (res.meta.status !== 200) {
        // 状态更新失败立即将状态恢复到原来
        userState.mg_state = !userState.mg_state;
        return this.$message.error("状态更新失败！");
      }
      this.$message.success("状态更新成功！");
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async validate => {
        if (!validate) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        this.addUserVisible = false;

        this.getUserlist();
      });
    },
    // 关闭添加用户dialog并对表单进行重置
    closeDialog() {
      this.$refs.addFormRef.resetFields();
    },
    // 关闭修改dialog并对表单进行重置
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息
    async editUser(id) {
      this.editUserVisible = true;
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editForm = res.data;
    },
    // 提交用户信息并提交
    commitEdit() {
      this.$refs.editFormRef.validate(async validate => {
        if (!validate) {
          return;
        }
        // 验证通过
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("修改用户信息失败");
        }
        this.$message.success("修改用户信息成功");
        this.editUserVisible = false;
        this.getUserlist();
      });
    },
    // 删除用户
    deleUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("users/" + id);
          if (res.meta.status !== 200) return;
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getUserlist();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 分配角色
    async setRole(info) {
      this.userInfo = info

      const { data: res } = await this.$http.get("roles");

      if (res.meta.status !== 200) {
        this.$message.error("获取角色失败！");
      }
      this.roleList = res.data;

      this.setRoleVisible = true;
    },
    async commitSetRole() {
      if (!this.selectedId) {
        return this.$message.info("请选择角色!");
      }
      console.log(this.userInfo);
      
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        { rid: this.selectedId }
      );

      console.log(res);
      

      if(res.meta.status!==200) {
        this.$message.error('分配角色失败')
      }
      this.getUserlist()

      this.setRoleVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
</style>