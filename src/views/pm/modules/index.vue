<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.pid" placeholder="项目" filterable clearable style="width: 120px" class="filter-item" @change="fetchData">
        <el-option v-for="item in projectsData" :key="item.id" :label="item.name" :value="item.id" />
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
      <el-table-column prop="projectName" label="项目名称" align="center" width="120" />
      <el-table-column prop="name" label="模块名称" align="center" />
      <el-table-column prop="latestVersion" label="最新模块版本号" align="center" />
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />

    <el-dialog :visible.sync="dialogVisible" :title="actionMap[dialogStatus]">
      <el-form ref="dialogForm" :rules="rules" :model="dialogFormData" label-position="left" label-width="100px">
        <el-form-item v-show="dialogStatus==='update'" label="Id" prop="id">
          <span>{{ dialogFormData.id }}</span>
        </el-form-item>
        <el-form-item label="Project" prop="pid">
          <el-select v-model="dialogFormData.pid" placeholder="请选择关联项目">
            <el-option v-for="(item,index) in projectsData" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="dialogFormData.name" />
        </el-form-item>
        <el-form-item label="Version" prop="version">
          <el-input v-model="dialogFormData.version" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="addModule">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProjects } from '@/api/projects'
import { listModules, addModule } from '@/api/module'
import Pagination from '@/components/Pagination'

export default {
  name: 'Modules',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      actionMap: {
        update: 'Update',
        add: 'Add'
      },
      listQuery: {
        page: 1,
        limit: 500,
        pid: undefined
      },
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        pid: [{ required: true, message: 'pid is required', trigger: 'change' }],
        version: [{ required: true, message: 'version is required', trigger: 'change' }]
      },
      dialogVisible: false,
      dialogStatus: '',
      projectsData: [],
      dialogFormData: {
        id: undefined,
        pid: undefined,
        name: undefined,
        version: undefined
      }
    }
  },
  created() {
    this.listQuery.pid = this.$route.query.pid
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listModules(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
      this.requestProjectsData()
    },
    requestProjectsData() {
      listProjects(this.listQuery).then(response => {
        this.projectsData = response.data
      })
    },
    resetDialogFormData() {
      this.dialogFormData = {
        id: undefined,
        pid: undefined,
        name: undefined,
        version: undefined
      }
      this.requestProjectsData()
    },
    handleAddProject() {
      this.resetDialogFormData()
      this.dialogStatus = 'add'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    addModule() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          addModule(this.dialogFormData).then(() => {
            this.dialogVisible = false
            this.$notify({
              title: 'Success',
              message: '模块添加成功',
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

    }
  }
}
</script>
