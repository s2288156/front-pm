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
        {{ actionMap.reload }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleAddGroup"
      >
        {{ actionMap.add }}
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
      <el-table-column prop="name" label="组名称" align="center" />
      <el-table-column align="center" label="创建时间" width="250">
        <template v-slot="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="handleEditRole(row)">
            {{ actionMap.edit }}
          </el-button>
          <el-button size="mini" type="denger" @click="handleDeleteGroup(row,$index)">
            {{ actionMap.delete }}
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

    <el-dialog :visible.sync="dialogGroupVisible" :title="actionMap[dialogStatus]">
      <el-form ref="groupForm" :rules="rules" :model="groupFormData" label-position="left" label-width="100px">
        <el-form-item v-show="dialogStatus==='update'" label="Id" prop="id">
          <span>{{ groupFormData.id }}</span>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="groupFormData.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupVisible = false">
          {{ actionMap.cancel }}
        </el-button>
        <el-button type="primary" @click="addGroup">
          {{ actionMap.confirm }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGroup, add, deleteGroup } from '@/api/group'
import Pagination from '@/components/Pagination'

export default {
  name: 'Group',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      actionMap: {
        reload: '刷新',
        add: '新增',
        edit: '编辑',
        assignUser: '分配用户',
        confirm: '确认',
        cancel: '取消',
        delete: '删除'
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }]
      },
      dialogGroupVisible: false,
      dialogStatus: '',
      groupFormData: {
        id: undefined,
        name: undefined
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listGroup(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    resetGroupFormData() {
      this.groupFormData = {
        id: undefined,
        name: undefined
      }
    },
    handleAddGroup() {
      this.resetGroupFormData()
      this.dialogStatus = 'add'
      this.dialogGroupVisible = true
      this.$nextTick(() => {
        this.$refs['groupForm'].clearValidate()
      })
    },
    addGroup() {
      this.$refs['groupForm'].validate((valid) => {
        if (valid) {
          add(this.groupFormData).then(() => {
            this.dialogGroupVisible = false
            this.$notify({
              title: 'Success',
              message: '组添加成功',
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
    handleAssignUser() {
      alert('handle assign user')
    },
    handleDeleteGroup(row, index) {
      deleteGroup(row.id).then(() => {
        this.$notify({
          title: 'Success',
          message: '组删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    }
  }
}
</script>
