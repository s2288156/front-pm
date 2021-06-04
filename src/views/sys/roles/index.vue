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
        @click="handleAddRole"
      >
        {{ titleMap.add }}
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
      <el-table-column prop="role" label="角色" align="center" width="300" />
      <el-table-column prop="name" label="角色名称" align="center" width="300" />
      <el-table-column prop="remark" label="备注" align="center" />
      <el-table-column align="center" label="操作">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" @click="handleEditRole(row)">
            {{ titleMap.edit }}
          </el-button>
          <el-button type="success" size="mini" @click="handleAssignUser(row)">
            {{ titleMap.assignUser }}
          </el-button>
          <el-button type="danger" size="mini" @click="deleteRole(row)">
            {{ $t('table.delete') }}
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="roleInfo" label-position="left" label-width="100px">
        <el-form-item v-show="dialogStatus==='update'" label="Id" prop="id">
          <span>{{ roleInfo.id }}</span>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-input v-model="roleInfo.role" />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="roleInfo.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?addRole():updateRole()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { pageRole, addRole, deleteRole } from '@/api/role'
import Pagination from '@/components/Pagination'

export default {
  name: 'RoleList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      titleMap: {
        reload: '刷新',
        add: '新增',
        edit: '编辑',
        assignUser: '分配用户'
      },
      roleInfo: {
        role: undefined,
        name: undefined
      },
      dialogStatus: '',
      listQuery: {
        page: 1,
        limit: 20
      },
      textMap: {
        create: this.$t('table.add'),
        edit: this.$t('table.edit')
      },
      dialogFormVisible: false,
      rules: {
        // change(value值改变)，focus(获到焦点)，blur(失去焦点)
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        role: [{ required: true, message: 'role is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      pageRole(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    resetDialogFormData() {
      this.roleInfo = {
        role: undefined,
        name: undefined
      }
    },
    handleAddRole() {
      this.resetDialogFormData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    addRole() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addRole(this.roleInfo).then(() => {
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
    handleEditRole() {
      alert('edit role')
    },
    updateRole() {
      alert('待开发')
    },
    handleAssignUser() {
      alert('handle assign user')
    },
    deleteRole(row) {
      this.$confirm('确认要删除此角色吗？', '警告', {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel')
      }).then(() => {
        deleteRole({ id: row.id }).then(() => {
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
