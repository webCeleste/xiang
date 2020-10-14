<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="组织名称" prop="orgName">
        <el-input
          v-model="queryParams.orgName"
          placeholder="请输入组织名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组织层级" prop="status">
        <el-select v-model="queryParams.orgLevel" placeholder="请选择组织层级" clearable size="small">
          <el-option v-for="dict in orgLevelOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
	    <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 查询 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:organization:add']">新增</el-button>
      </el-col>
      <!-- 导入 v-hasPermi="['system:organization:import']" -->
<!--      <el-col :span="1.5">-->
<!--        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" >导入</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 党组织表格 -->
    <el-table v-loading="loading" :data="organizationList" row-key="orgId" default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="组织名称" align="left" prop="orgName" min-width="28%"/>
      <el-table-column label="组织全称" align="left" prop="orgFullName" min-width="28%"/>
      <el-table-column label="组织层级" align="center" prop="orgLevel" :formatter="orgLevelFormat" min-width="14%"/>
      <el-table-column label="组织排序" align="center" prop="orderNum" min-width="10%"/>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" min-width="10%"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="10%">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:organization:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:organization:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改党组织对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级组织" prop="parentId">
              <treeselect v-model="form.parentId" :options="organizationOptions" :normalizer="normalizer" placeholder="请选择上级组织" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织层级" prop="orgLevel">
              <el-select v-model="form.orgLevel" placeholder="请选择组织层级" clearable :style="{width: '100%'}">
                <el-option v-for="dict in orgLevelOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织排序" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入组织排序" :maxlength="4" clearable
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织名称" prop="orgName">
              <el-input v-model="form.orgName" placeholder="请输入组织名称" :maxlength="100" show-word-limit clearable
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织全称" prop="orgFullName">
              <el-input v-model="form.orgFullName" placeholder="请输入组织全称" :maxlength="256" show-word-limit
                        clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织规模" prop="orgScale">
              <el-input v-model="form.orgScale" placeholder="请输入组织规模" :maxlength="256" show-word-limit
                        clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织状态" prop="orgScale">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="组织说明" prop="remake">
              <el-input v-model="form.remake" type="textarea" placeholder="请输入组织说明" :maxlength="500"
                        show-word-limit :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="组织图集" prop="orgFileIds">
              <el-upload ref="orgFileIds" :file-list="orgFileIdsfileList" :action="orgFileIdsAction" multiple
                         :before-upload="orgFileIdsBeforeUpload" list-type="picture" accept="image/*">
                <el-button size="small" type="primary" icon="el-icon-upload">上传图片</el-button>
                <div slot="tip" class="el-upload__tip">只能上传不超过 2MB 的image/*文件</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 党组织导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrganization, getOrganization, delOrganization, addOrganization, updateOrganization, exportOrganization, importTemplate } from "@/api/basicOrg/organization";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Organization",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 党组织表格数据
      organizationList: [],
      // 党组织树选项
      organizationOptions: [],
      //组织状态
      statusOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 党组织导入参数
      upload: {
        // 是否显示弹出层（党组织导入）
        open: false,
        // 弹出层标题（党组织导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/organization/importData",
      },
      // 查询参数
      queryParams: {
        parentId: null,
        ancestors: null,
        orgCode: null,
        orgName: null,
        orgFullName: null,
        orgScale: null,
        orgLevel: null,
        orderNum: null,
        status: null,
        remake: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [{
          required: true,
          message: '请选择上级组织',
          trigger: 'change'
        }],
        orgLevel: [{
          required: true,
          message: '请选择组织层级',
          trigger: 'change'
        }],
        orgName: [{
          required: true,
          message: '请输入组织名称',
          trigger: 'blur'
        }],
        orgFullName: [{
          required: true,
          message: '请输入组织全称',
          trigger: 'blur'
        }],
        orgScale: [],
        orderNum: [{
          required: true,
          pattern: /^[0-9]*$/,
          message: '请输入正确的数字',
          trigger: 'blur'
        }],
        remake: [],
      },
      orgFileIdsAction: 'https://jsonplaceholder.typicode.com/posts/',
      orgFileIdsfileList: [],
      orgLevelOptions: [],
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_org_level").then(response => {
      this.orgLevelOptions = response.data;
    })
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询党组织列表 */
    getList() {
      this.loading = true;
      listOrganization(this.queryParams).then(response => {
        this.organizationList = this.handleTree(response.data, "orgId", "parentId");
        this.loading = false;
      });
    },
    /** 转换党组织数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.orgId,
        label: node.orgName,
        children: node.children
      };
    },
	  /** 查询部门下拉树结构 */
    getTreeselect() {
      this.loading = true;
      listOrganization().then(response => {
        // this.organizationOptions = [];
        // const data = { orgId: 0, orgName: '顶级节点', children: [] };
        // data.children = this.handleTree(response.data, "orgId", "parentId");
        // this.organizationOptions.push(data);
        this.organizationOptions = this.handleTree(response.data, "orgId", "parentId");
        this.loading = false;
      });
    },
    // 字典组织层级字典翻译
    orgLevelFormat(row, column) {
      return this.selectDictLabel(this.orgLevelOptions, row.orgLevel);
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        orgId: null,
        parentId: null,
        ancestors: null,
        orgCode: null,
        orgName: null,
        orgFullName: null,
        orgScale: null,
        orgLevel: null,
        orderNum: null,
        status: "0",
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "党组织导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
	  this.getTreeselect();
      this.open = true;
      this.title = "添加党组织";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
	  this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.orgId;
      }
      getOrganization(row.orgId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改党组织";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.orgId != null) {
            updateOrganization(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addOrganization(this.form).then(response => {
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
      this.$confirm('是否确认删除党组织编号为"' + row.orgId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOrganization(row.orgId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 附件上传 */
    orgFileIdsBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2
      if (!isRightSize) {
        this.$message.error('文件大小超过 2MB')
      }
      let isAccept = new RegExp('image/*').test(file.type)
      if (!isAccept) {
        this.$message.error('应该选择image/*类型的文件')
      }
      return isRightSize && isAccept
    },
  }
};
</script>
<style>
  .el-upload__tip {
    line-height: 1.2;
  }
</style>
