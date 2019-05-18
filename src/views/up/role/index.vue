<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.roleId" :placeholder="$t('roleTable.id')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('roleTable.id')" prop="roleId" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.roleId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('roleTable.name')" prop="name" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('roleTable.title')" prop="title" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('roleTable.description')" prop="description" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('roleTable.ctime')" prop="ctime" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ctime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('roleTable.orders')" prop="orders" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orders }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('roleTable.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('roleTable.edit') }}
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            {{ $t('roleTable.delete') }}
          </el-button>
          <el-button type="primary" size="mini" @click="handleAddRolePermission(row.roleId)">
            {{ $t('roleTable.createRolePermission') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('roleTable.type')" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('roleTable.uri')">
          <el-input v-model="temp.uri" :autosize="{ minRows: 2}" type="text" placeholder="Please input" />
        </el-form-item>
        <el-form-item :label="$t('roleTable.icon')">
          <el-input v-model="temp.icon" :autosize="{ minRows: 2}" type="text" placeholder="Please input" />
        </el-form-item>
        <el-form-item :label="$t('roleTable.name')">
          <el-input v-model="temp.name" :autosize="{ minRows: 2}" type="text" placeholder="Please input" />
        </el-form-item>
        <el-form-item :label="$t('roleTable.roleValue')">
          <el-input v-model="temp.roleValue" :autosize="{ minRows: 2}" type="text" placeholder="Please input" />
        </el-form-item>
        <el-form-item :label="$t('roleTable.pid')">
          <el-input v-model="temp.pid" :autosize="{ minRows: 2}" type="text" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="permissionDialogFormVisible">
      <el-form ref="permissionForm" :rules="rules" :model="rolePermissionTemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('roleTable.permissionId')" prop="permissionId">
          <el-select
            v-model="rolePermissionTemp.permissionId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="fetchPermissionByName"
          >
            <el-option
              v-for="item in rolePermissions"
              :key="item.permissionId"
              :label="item.name"
              :value="item.permissionId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogFormVisible = false">
          {{ $t('roleTable.cancel') }}
        </el-button>
        <el-button type="primary" @click="createRolePermission">
          {{ $t('roleTable.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createRole, updateRole, fetchRole, createRolePermission } from '@/api/role'
import { fetchPermissionByName } from '@/api/permission'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const calendarTypeOptions = [// 类型(1:目录,2:菜单,3:按钮)
  { key: '1', display_name: 'Directory' },
  { key: '2', display_name: 'Menu' },
  { key: '3', display_name: 'Button' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
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
        pageSize: 10,
        type: undefined,
        roleId: undefined
      },
      permissionQuery: {
        roleId: undefined,
        name: undefined
      },
      calendarTypeOptions,
      temp: {
        id: undefined,
        type: 1,
        uri: '',
        name: '',
        roleValue: '',
        systemId: 1,
        pid: ''
      },
      rolePermissionTemp: {
        roleId: undefined,
        permissionId: undefined
      },
      rolePermissions: [],
      dialogFormVisible: false,
      permissionDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create',
        createRolePermission: 'Create Permission'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    fetchPermissionByName(query) {
      this.permissionQuery.name = query
      fetchPermissionByName(this.permissionQuery).then(response => {
        this.rolePermissions = response.data
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAddRolePermission(roleId, status) {
      this.rolePermissionTemp.roleId = roleId
      this.permissionQuery.roleId = roleId
      this.dialogStatus = 'createRolePermission'
      this.permissionDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['permissionForm'].clearValidate()
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        systemId: 1,
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createRolePermission() {
      this.$refs['permissionForm'].validate((valid) => {
        if (valid) {
          createRolePermission(this.rolePermissionTemp).then(() => {
            this.getList()
            this.permissionDialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 1000
            })
          })
        }
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          createRole(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
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
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateRole(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchRole(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
