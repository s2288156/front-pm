<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-refresh"
        @click="fetchData"
      >
        {{ $t('table.search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleAddUser"
      >
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="index" :index="1" align="center" label="No." width="60" />
      <el-table-column label="头像" align="center" width="80">
        <template v-slot="scope">
          <el-avatar :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column align="center" label="注册时间" width="250">
        <template v-slot="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" @click="handleUpdateUser(row)">
            {{ $t('table.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :rules="rules" :model="userInfo" label-position="left" label-width="100px">
        <el-form-item v-show="dialogStatus==='update'" label="Id" prop="id">
          <span>{{ userInfo.id }}</span>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" />
        </el-form-item>
        <el-form-item v-show="dialogStatus==='create'" label="密码" prop="password">
          <el-input v-model="userInfo.password" show-password />
        </el-form-item>
        <el-form-item v-show="dialogStatus==='create'" label="确认密码" prop="confirmPassword">
          <el-input v-model="userInfo.confirmPassword" show-password />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userInfo.name" />
        </el-form-item>
        <el-form-item label="Role">
          <el-tree ref="tree" :data="allRoleList" :props="defaultProps" show-checkbox node-key="id" />
        </el-form-item>
        <el-checkbox-group v-model="userRoleList">
          <el-checkbox v-for="role in allRoleList" :key="role.id" :label="role.role">{{ role.role }}</el-checkbox>
        </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?addUser():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { registerUser, listUser, setRoles } from '@/api/user'
import { listRoleByUid } from '@/api/role'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id'
      },
      textMap: {
        create: this.$t('table.add'),
        edit: this.$t('table.edit')
      },
      userInfo: {
        id: undefined,
        name: undefined,
        username: undefined,
        password: undefined,
        confirmPassword: undefined
      },
      allRoleList: [],
      userRoleList: [],
      defaultProps: {
        label: 'role'
      },
      rules: {
        // change(value值改变)，focus(获到焦点)，blur(失去焦点)
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        username: [{ required: true, message: 'username is required', trigger: 'blur' }],
        password: [{ required: true, message: 'password is required', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: 'confirmPassword is required', trigger: 'blur' }]
      },
      dialogStatus: '', // dialog状态
      dialogVisible: false, // dialog默认不显示
      userSetRolesCmd: {
        uid: undefined,
        roleIds: []
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listUser(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    resetTemp() {
      this.userInfo = {
        name: undefined,
        username: undefined,
        password: undefined,
        confirmPassword: undefined
      }
    },
    handleAddUser() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$refs['dataForm'].clearValidate()
    },
    addUser() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          registerUser(this.userInfo).then(response => {
            this.userInfo = Object.assign({}, response.data)
            this.dialogVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
          })
        }
      })
    },
    handleUpdateUser(row) {
      this.dialogStatus = 'update'
      this.userInfo = {
        id: row.id,
        username: row.username,
        name: row.name
      }
      const listRoleQuery = {
        uid: row.id
      }
      this.dialogVisible = true
      listRoleByUid([]).then(response => {
        this.allRoleList = response.data
      })
      listRoleByUid(listRoleQuery).then(response => {
        this.userRoleList = response.data
      })
      this.$nextTick(() => {
        const nodes = [{ id: '2', role: 'GUEST', name: '参观者' }]
        this.$refs.tree.setCheckedNodes(nodes)
        console.log(nodes)
      })
    },
    updateData() {
      const selectRoleIds = []
      this.$refs.tree.getCheckedNodes().forEach(function(value) {
        selectRoleIds.push(value.id)
      })
      this.userSetRolesCmd = {
        uid: this.userInfo.id,
        roleIds: selectRoleIds
      }
      setRoles(this.userSetRolesCmd).then(() => {
        this.dialogVisible = false
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
      })
    }
  }
}
</script>
