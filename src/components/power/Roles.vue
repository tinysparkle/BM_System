<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 每一个row都是24列 -->
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
            >
              <!-- 一级标签 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级标签 -->
              <el-col :span="19">
                <!-- 二级 -->
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2===0?'':'bdtop','vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级标签 -->
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRole(scope.row)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleUser(scope.row.id)"
            >删除</el-button>
            <!-- 管理按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showRightsTree(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑角色区域 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleVisible" width="50%">
      <el-form ref="editRoleRef" :model="editRoleForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色区域 -->
    <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="50%" @close="closeAddRole">
      <el-form ref="addRoleRef" :model="addRoleForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitAddRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 权限树区域 -->
    <el-dialog title="分配权限" :visible.sync="rightsTreeVisible" width="50%">
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        :default-checked-keys="defKeys"
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsTreeVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 保存所有角色信息
      rolesList: [],
      // 编辑角色弹出框
      editRoleVisible: false,
      // 添加角色弹出框
      addRoleVisible: false,
      // 保存每行角色的信息
      editRoleForm: {},
      // 添加角色信息
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      defaultProps: {
        children: "children",
        label: "authName"
      },
      rightsTreeVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 默认选中的权限key值
      defKeys: [],
      // 获取当前角色的id
      roleId:''
    };
  },
  created() {
    // 获取所有角色列表
    this.getRoleList();
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败!");
      }
      this.rolesList = res.data;
    },
    // 打开编辑角色
    editRole(roleInfo) {
      this.editRoleVisible = true;
      this.editRoleForm = roleInfo;
    },
    // 提交更改后的角色信息
    async commitRole() {
      const { data: res } = await this.$http.put(
        "roles/" + this.editRoleForm.id,
        {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("编辑角色信息失败！");
      }
      this.$message.success("编辑角色信息成功！");
      this.getRoleList();
      this.editRoleVisible = false;
    },
    // 删除角色
    deleUser(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("roles/" + id);
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败");
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getRoleList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加角色按钮
    addRole() {
      this.addRoleVisible = true;
    },
    // 提交添加角色
    async commitAddRole() {
      const { data: res } = await this.$http.post("roles", this.addRoleForm);
      if (res.meta.status !== 201) {
        return this.$message.error("添加用户失败！");
      }
      this.$message.success("添加用户成功！");
      this.addRoleVisible = false;
      this.getRoleList();
    },
    // 重置添加角色对话框表单
    closeAddRole() {
      (this.addRoleForm.roleName = ""), (this.addRoleForm.roleDesc = "");
    },
    // 删除三级权限标签
    async removeRightById(roleInfo, id) {
      const resConfirm = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (resConfirm != "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${roleInfo.id}/rights/${id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      this.$message.success("删除权限成功");
      // 调用获取角色方法会刷新整个网页 重新渲染数据
      // this.getRoleList()
      roleInfo.children = res.data;
    },
    // 展示分配权限树
    async showRightsTree(role) {
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限失败！");
      }
      this.rightsList = res.data;
      this.defKeys = [];
      this.getDefKeysId(role, this.defKeys);

      this.roleId = role.id
      this.rightsTreeVisible = true;
    },
    // 递归获取默认勾选权限的id值
    getDefKeysId(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getDefKeysId(item, arr);
      });
    },
    // 笨方法
    // getDefKeysId(node, arr) {
    //   node.children.forEach(element => {
    //     element.children.forEach(item2 => {
    //       item2.children.forEach(item3 => {
    //         console.log(item3.id);
    //         arr.push(item3.id)
    //       });
    //     });
    //   });
    // }

    async commitRights() {
      const keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ];
     const idStr  = keys.join(",");
      
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {rids:idStr}
      );

      if(res.meta.status!==200) {
        return this.$message.error('更新失败！')
      }
       this.$message.success('更新成功！')
      this.getRoleList()
      this.rightsTreeVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
// 垂直居中对其
.vcenter {
  display: flex;
  align-items: center;
}
</style>