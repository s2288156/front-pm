<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-table-column prop="projectName" label="项目名称" align="center" width="300" />
      <el-table-column prop="moduleName" label="模块名称" align="center" width="500" />
      <el-table-column prop="moduleVersion" label="版本" align="center" />
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
        <el-form-item v-show="false" label="Pid" prop="pid">
          <span>{{ dialogFormData.pid }}</span>
        </el-form-item>
        <el-form-item label="Module" prop="dependMid">
          <el-select v-model="dialogFormData.dependMid" placeholder="请选择模块" @change="selectModule">
            <el-option v-for="(item,index) in moduleList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Version" prop="version">
          <el-select v-model="dialogFormData.version" placeholder="请选择版本">
            <el-option v-for="(item,index) in versionList" :key="index" :label="item.version" :value="item.version" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="addDepend">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dependAdd, listDepend } from '@/api/projects'
import { listModules, listModuleVersions } from '@/api/module'
import Pagination from '@/components/Pagination'

export default {
  name: 'ProjectDependList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      textMap: {
        add: this.$t('table.add'),
        edit: this.$t('table.edit')
      },
      listQuery: {
        page: 1,
        limit: 20,
        pid: undefined
      },
      rules: {
        pid: [{ required: true, message: 'pid is required', trigger: 'change' }],
        dependMid: [{ required: true, message: 'dependMid is required', trigger: 'change' }],
        version: [{ required: true, message: 'version is required', trigger: 'change' }]
      },
      dialogVisible: false,
      dialogStatus: '',
      moduleList: [],
      versionList: [],
      dialogFormData: {
        pid: undefined,
        dependMid: undefined,
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
      listDepend(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    requestModuleData() {
      listModules({ page: 1, limit: 500 }).then(response => {
        this.moduleList = response.data
      })
    },
    selectModule() {
      this.dialogFormData.version = undefined
      listModuleVersions({ page: 1, limit: 500, mid: this.dialogFormData.dependMid }).then(response => {
        this.versionList = response.data
      })
    },
    resetProjectFormData() {
      this.dialogFormData = {
        pid: this.$route.query.pid,
        dependMid: undefined,
        version: undefined
      }
    },
    handleAddProject() {
      this.resetProjectFormData()
      this.requestModuleData()
      this.dialogStatus = 'add'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    addDepend() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          dependAdd(this.dialogFormData).then(() => {
            this.dialogVisible = false
            this.$notify({
              title: 'Success',
              message: '项目依赖添加成功',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
          })
        }
      })
    }
  }
}
</script>
