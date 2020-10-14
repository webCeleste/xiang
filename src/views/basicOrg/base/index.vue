<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="组织id" prop="orgId">
        <el-input
          v-model="queryParams.orgId"
          placeholder="请输入组织id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="等级" prop="level">
        <el-input
          v-model="queryParams.level"
          placeholder="请输入等级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="颁发表彰单位" prop="issueCompany">
        <el-input
          v-model="queryParams.issueCompany"
          placeholder="请输入颁发表彰单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="受表彰单位" prop="commendCompany">
        <el-input
          v-model="queryParams.commendCompany"
          placeholder="请输入受表彰单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表彰时间" prop="commendTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.commendTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择表彰时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="负责人" prop="dutyPerson">
        <el-input
          v-model="queryParams.dutyPerson"
          placeholder="请输入负责人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basicOrg:base:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basicOrg:base:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basicOrg:base:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['basicOrg:base:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="baseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键id" align="center" prop="baseId" /> -->
      <el-table-column label="组织id" align="center" prop="orgId" />
      <el-table-column label="等级" align="center" prop="level" />
      <el-table-column label="颁发表彰单位" align="center" prop="issueCompany" />
      <el-table-column label="受表彰单位" align="center" prop="commendCompany" />
      <el-table-column label="表彰时间" align="center" prop="commendTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.commendTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="dutyPerson" />
      <el-table-column label="备注" align="center" prop="remake" />
      <el-table-column label="排序" align="center" prop="sort" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basicOrg:base:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basicOrg:base:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改先进基层党组织对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="组织id" prop="orgId">
          <el-input v-model="form.orgId" placeholder="请输入组织id" />
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-input v-model="form.level" placeholder="请输入等级" />
        </el-form-item>
        <el-form-item label="颁发表彰单位" prop="issueCompany">
          <el-input v-model="form.issueCompany" placeholder="请输入颁发表彰单位" />
        </el-form-item>
        <el-form-item label="受表彰单位" prop="commendCompany">
          <el-input v-model="form.commendCompany" placeholder="请输入受表彰单位" />
        </el-form-item>
        <el-form-item label="表彰时间" prop="commendTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.commendTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择表彰时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="负责人" prop="dutyPerson">
          <el-input v-model="form.dutyPerson" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="备注" prop="remake">
          <el-input v-model="form.remake" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序" prop="remake">
          <el-input v-model="form.sort" type="textarea" placeholder="请输入顺序" />
        </el-form-item>
        <!-- <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBase, getBase, delBase, addBase, updateBase, exportBase } from "@/api/basicOrg/base";

export default {
  name: "Base",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 先进基层党组织表格数据
      baseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orgId: null,
        level: null,
        issueCompany: null,
        commendCompany: null,
        commendTime: null,
        dutyPerson: null,
        remake: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询先进基层党组织列表 */
    getList() {
      this.loading = true;
      listBase(this.queryParams).then(response => {
        this.baseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        baseId: null,
        orgId: null,
        level: null,
        issueCompany: null,
        commendCompany: null,
        commendTime: null,
        dutyPerson: null,
        remake: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.baseId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加先进基层党组织";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const baseId = row.baseId || this.ids
      getBase(baseId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改先进基层党组织";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.baseId != null) {
            updateBase(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addBase(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const baseIds = row.baseId || this.ids;
      this.$confirm('是否确认删除先进基层党组织编号为"' + baseIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBase(baseIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有先进基层党组织数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBase(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
