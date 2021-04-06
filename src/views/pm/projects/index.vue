<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.groupId" placeholder="组" filterable clearable style="width: 120px" class="filter-item" @change="fetchData">
        <el-option v-for="item in groupsData" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-refresh" @click="fetchData">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddProject">
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
      <el-table-column type="index" :index="1" align="center" label="No." width="95" />
      <el-table-column prop="groupName" label="组" align="center" width="300" />
      <el-table-column label="项目名称" align="center">
        <template v-slot="{row}">
          <span class="link-type" @click="skipToModules(row.id)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="250">
        <template v-slot="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="handleEditRole(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDeleteGroup(row,$index)">
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

    <el-dialog :visible.sync="dialogVisible" :title="textMap[dialogStatus]">
      <el-form ref="dialogForm" :rules="rules" :model="dialogFormData" label-position="left" label-width="100px">
        <el-form-item v-show="dialogStatus==='update'" label="Id" prop="id">
          <span>{{ dialogFormData.id }}</span>
        </el-form-item>
        <el-form-item label="Group" prop="groupId">
          <el-select v-model="dialogFormData.groupId" placeholder="请选择组">
            <el-option v-for="(item,index) in groupsData" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="dialogFormData.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="addProject">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProjects, add } from '@/api/projects'
import { listGroup } from '@/api/group'
import Pagination from '@/components/Pagination'

export default {
  name: 'Projects',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      textMap: {
        add: 'Add',
        edit: 'Edit'
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        groupId: [{ required: true, message: 'groupId is required', trigger: 'change' }]
      },
      dialogVisible: false,
      dialogStatus: '',
      groupsData: [],
      dialogFormData: {
        id: undefined,
        name: undefined,
        groupId: undefined,
        description: undefined
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listProjects(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
      this.requestGroupData()
    },
    resetGroupFormData() {
      this.dialogFormData = {
        id: undefined,
        name: undefined,
        groupId: undefined,
        description: undefined
      }
      this.requestGroupData()
    },
    requestGroupData() {
      listGroup(this.listQuery).then(response => {
        this.groupsData = response.data
      })
    },
    handleAddProject() {
      this.resetGroupFormData()
      this.dialogStatus = 'add'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    addProject() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          add(this.dialogFormData).then(() => {
            this.dialogVisible = false
            this.$notify({
              title: 'Success',
              message: '项目添加成功',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
          })
        }
      })
    },
    handleEditRole() {
      alert('待开发')
    },
    handleAssignUser() {
      alert('待开发')
    },
    handleDeleteGroup(row, index) {
      alert('待开发')
    },
    skipToModules(pid) {
      this.$router.push({ path: '/pm/modules', query: { pid: pid }})
    }
  }
}
</script>
