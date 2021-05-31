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
      <el-table-column align="center" label="操作" width="200">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" @click="handleEditRole(row)">
            {{ titleMap.edit }}
          </el-button>
          <el-button type="success" size="mini" @click="handleAssignUser(row)">
            {{ titleMap.assignUser }}
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

  </div>
</template>

<script>
import { pageRole } from '@/api/role'

export default {
  name: 'RoleList',
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
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      console.log('fetch data')
      pageRole(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleAddRole() {
      alert('add role')
    },
    handleEditRole() {
      alert('edit role')
    },
    handleAssignUser() {
      alert('handle assign user')
    }
  }
}
</script>
