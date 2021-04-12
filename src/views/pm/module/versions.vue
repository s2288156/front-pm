<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-refresh" @click="fetchData">
        {{ $t('table.refresh') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddVersion">
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" :index="1" align="center" label="No." width="95" />
      <el-table-column prop="version" label="版本号" align="center" />
      <el-table-column prop="description" label="描述" align="center" />
      <el-table-column align="center" label="创建时间" width="250">
        <template v-slot="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" @click="handleEditVersion(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDeleteVersion(row)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />

    <el-dialog :visible.sync="dialogVisible" :title="textMap[dialogStatus]">
      <el-form ref="dialogForm" :rules="rules" :model="dialogFormData" label-position="left" label-width="100px">
        <el-form-item v-show="dialogStatus === 'add'" label="版本" prop="version">
          <el-input v-model="dialogFormData.version" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="dialogFormData.description" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'add ' ? addVersion() : editVersion()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listModuleVersions, addVersion, updateVersion } from '@/api/module'
import Pagination from '@/components/Pagination'

export default {
  name: 'ModuleVersions',
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
        limit: 10,
        sort: '+version',
        mid: undefined
      },
      rules: {
        mid: [{ required: true, message: 'mid is required', trigger: 'change' }],
        version: [{ required: true, message: 'version is required', trigger: 'change' }]
      },
      dialogVisible: false,
      dialogStatus: '',
      dialogFormData: {
        id: undefined,
        mid: undefined,
        version: undefined,
        description: undefined
      }
    }
  },
  created() {
    this.listQuery.mid = this.$route.query.mid
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listModuleVersions(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    resetDialogFormData() {
      this.dialogFormData = {
        mid: this.listQuery.mid,
        version: undefined,
        description: undefined
      }
    },
    handleAddVersion() {
      this.resetDialogFormData()
      this.dialogStatus = 'add'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    addVersion() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          addVersion(this.dialogFormData).then(() => {
            this.dialogVisible = false
            this.$notify({
              title: 'Success',
              message: '版本添加成功',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
          })
        }
      })
    },
    handleEditVersion(row) {
      this.resetDialogFormData()
      this.dialogStatus = 'update'
      this.dialogFormData.id = row.id
      this.dialogFormData.description = row.description
      this.dialogVisible = true
    },
    editVersion() {
      updateVersion(this.dialogFormData).then(() => {
        this.dialogVisible = false
        this.$notify({
          title: 'Success',
          message: '版本更新成功',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
      })
    },
    handleDeleteVersion(row) {
      alert('待开发')
    }
  }
}
</script>
<style>
.el-table .cell {
  white-space: pre-line;
}
</style>
