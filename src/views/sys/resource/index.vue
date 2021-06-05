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
        @click="handleAddResource"
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
      <el-table-column prop="url" label="URL" align="center" />
      <el-table-column align="center" label="操作" width="200">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" @click="handleAddResource(row)">
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
      <el-form ref="dataForm" :rules="rules" :model="resourceInfo" label-position="left" label-width="100px">
        <el-form-item v-show="dialogStatus==='update'" label="Id" prop="id">
          <span>{{ resourceInfo.id }}</span>
        </el-form-item>
        <el-form-item label="Method" prop="requestMethod">
          <el-select v-model="resourceInfo.requestMethod" placeholder="请选择">
            <el-option v-for="item in requestMethods" :key="item.method" :label="item.method" :value="item.method" />
          </el-select>
        </el-form-item>
        <el-form-item label="Path" prop="apiPath">
          <el-input v-model="resourceInfo.apiPath" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?addResource():updateResource()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageResource, addResource } from '@/api/resource'
import Pagination from '@/components/Pagination'

export default {
  name: 'ResourceList',
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
      rules: {
        // change(value值改变)，focus(获到焦点)，blur(失去焦点)
        requestMethod: [{ required: true, message: 'method is required', trigger: 'blur' }],
        apiPath: [{ required: true, message: 'uri is required', trigger: 'blur' }]
      },
      dialogStatus: '', // dialog状态
      dialogVisible: false, // dialog默认不显示
      resourceInfo: {
        id: undefined,
        requestMethod: undefined,
        apiPath: undefined
      },
      requestMethods: [
        { method: 'GET' },
        { method: 'POST' },
        { method: 'PUT' },
        { method: 'DELETE' }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      pageResource(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    resetResourceInfo() {
      this.resourceInfo = {
        id: undefined,
        requestMethod: undefined,
        apiPath: undefined
      }
    },
    handleAddResource() {
      this.resetResourceInfo()
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$refs['dataForm'].clearValidate()
    },
    addResource() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addResource(this.resourceInfo).then(() => {
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
    updateResource() {
      alert('...')
    }
  }
}
</script>
