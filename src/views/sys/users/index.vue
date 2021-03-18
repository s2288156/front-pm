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
        {{ titleMap.reload }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleAddUser"
      >
        {{ titleMap.addUser }}
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
      <el-table-column type="index" :index="1" align="center" label="No." width="95" />
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="gender" label="性别" width="110" align="center" />
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template v-slot="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间" width="250">
        <template v-slot="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" @click="handleUpdateAdmin(row)">
            {{ titleMap.edit }}
          </el-button>
          <el-button type="success" size="mini" @click="handleAssignRole(row)">
            {{ titleMap.assignRole }}
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

    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px">
        <el-form-item label="Id" prop="id">
          <span>{{ temp.id }}</span>
        </el-form-item>
        <el-form-item label="Username" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item v-show="dialogStatus==='create'" label="Password" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item v-show="dialogStatus==='update'" label="Gender">
          <el-radio-group v-model="temp.gender">
            <el-radio label="MALE" />
            <el-radio label="FEMALE" />
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="dialogStatus==='update'" label="Status">
          <el-radio-group v-model="temp.status">
            <el-radio label="ACTIVE" />
            <el-radio label="DELETED" />
            <el-radio label="FROZEN" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ titleMap.cancel }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?addUser():updateData()">
          {{ titleMap.confirm }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="titleMap.assignRole" :visible.sync="dialogAssignRoleVisible">
      <el-drag-select v-model="assignRoleData.roleNames" style="width: 500px;" multiple placeholder="请选择">
        <el-option
          v-for="role in assignRoleData.roles"
          :key="role.id"
          :label="role.name"
          :value="role.name"
        />
      </el-drag-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAssignRoleVisible= false">
          {{ titleMap.cancel }}
        </el-button>
        <el-button type="primary" @click="assignRole">
          {{ titleMap.confirm }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addUser, getList, update } from '@/api/user'
import { assign, listFor, listAll } from '@/api/role'
import Pagination from '@/components/Pagination'
import ElDragSelect from '@/components/DragSelect'

export default {
  name: 'UserList',
  components: { Pagination, ElDragSelect },
  filters: {
    statusFilter(status) {
      const statusMap = {
        DELETED: 'danger',
        ACTIVE: 'success',
        FROZEN: ''
      }
      return statusMap[status]
    }
  },
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
      temp: {
        id: undefined,
        name: undefined,
        gender: undefined,
        status: undefined,
        username: undefined,
        createTime: undefined,
        password: undefined
      },
      dialogStatus: '', // dialog状态
      dialogFormVisible: false, // dialog默认不显示
      dialogTitleMap: {
        update: '编辑',
        create: '新增'
      },
      titleMap: {
        edit: '编辑',
        assignUser: '分配角色',
        confirm: '确认',
        cancel: '取消',
        addUser: '新增用户',
        reload: '刷新',
        action: '操作'
      },
      rules: {
        username: [{ required: true, message: 'username is required', trigger: 'change' }]
      },
      dialogAssignRoleVisible: false,
      assignRoleData: {
        uid: '',
        roleNames: [''],
        roleIdMap: new Map(),
        roles: [{ id: '', name: '', description: '' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleUpdateAdmin(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          update(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        gender: undefined,
        status: undefined,
        username: '',
        createTime: undefined,
        password: ''
      }
    },
    handleAddUser() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.nextTick()(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    addUser() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addUser(this.temp).then(response => {
            this.temp = Object.assign({}, response.data)
            this.dialogFormVisible = false
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
    handleAssignRole(row) {
      listFor(row.id).then(response => {
        this.assignRoleData.roleNames = response.data.map(function(value) {
          return value.name
        })
        this.assignRoleData.uid = row.id
      })
      listAll().then(response => {
        this.assignRoleData.roles = response.data
        const map = new Map()
        this.assignRoleData.roles.forEach(function(value) {
          map.set(value.description, value.id)
        })
        this.assignRoleData.roleIdMap = map
        this.dialogAssignRoleVisible = true
      })
    },
    assignRole() {
      const param = {
        uid: this.assignRoleData.uid,
        roleIds: []
      }
      const map = this.assignRoleData.roleIdMap
      this.assignRoleData.roleNames.forEach(function(value) {
        param.roleIds.push(map.get(value))
      })
      assign(param).then(() => {
        this.dialogAssignRoleVisible = false
        this.$notify({
          title: 'Success',
          message: '角色分配成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
