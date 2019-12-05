<template>
    <div>
<!--        面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片视图结构-->
        <el-card class="box-card">
<!--            搜索与添加-->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input clearable @clear = 'getUserList'  placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
<!--            用户列表区域-->
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" >
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
<!--            分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
<!--        添加用户的对话框-->
        <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogclose">
<!--            内容主体区域-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
<!--                底部区域-->
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>


<!--        修改的对话框-->
        <el-dialog
                title="修改用户"
                :visible.sync="EditdialogVisible"
                width="50%"
        @close="editDialogClose">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="EditdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Users",
        data(){
            // 验证邮箱的规则
            let checkEmail =(rule,value,cb) =>{
                const regEmail =/\w+@[a-z0-9]+\.[a-z]{2,4}/;
                if (regEmail.test(value)){
                    return cb()
                }
                cb(new Error("请输入合法的邮箱"))
            }
            // 验证手机号的规则
            let checkMobile = (rule,value,cb) =>{
                const regMobile =/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                if (regMobile.test(value)){
                    return cb()
                }
                cb(new Error("请输入合法的手机号"))
            }
            return{
                // 修改信息的验证规则
                editFormRules:{
                    email:[
                        {required: true,message:'请输入邮箱地址',trigger:'blur'},
                        {validator:checkEmail,trigger:'blur'}
                    ],
                    mobile:[
                        {required: true,message:'请输入手机号码',trigger:'blur'},
                        {validator:checkMobile,trigger:'blur'}
                    ]

                },
                // 修改用户的对象
                editForm:{},
                // 控制修改对话框的值
                EditdialogVisible:false,
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:2,
                },
                userList:[],
                total:0,
                //控制添加用户对话框的显示和隐藏
                addDialogVisible:false,
                // 添加用户表单的数据
                addForm:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:''
                },
                // 添加表单的验证对象
                addFormRules:{
                    username:[
                        {required: true,message:'请输入用户名',trigger:'blur'},
                        {min:3,max:10,message: '用户名的长度在3个到10个字符之间',trigger:'blur'}

                    ],
                    password:[
                        {required: true,message:'请输入密码',trigger:'blur'},
                        {min:6,max:15,message: '用户名的长度在6个到15个字符之间',trigger:'blur'}
                    ],
                    email:[
                        {required: true,message:'请输入邮箱地址',trigger:'blur'},
                        {validator:checkEmail,trigger:'blur'}
                    ],
                    mobile:[
                        {required: true,message:'请输入手机号码',trigger:'blur'},
                        {validator:checkMobile,trigger:'blur'}
                    ]
                },
            }

        },
        methods:{
            // 修改用户信息
            editUserInfo(){
                this.$refs.editFormRef.validate(async valid =>{
                    if(!valid) return
                    const {data:res} = await this.$axios.put('users/' + this.editForm.id,this.editForm)
                    if(res.meta.status !==200){
                        return this.$message.error('更新用户信息失败')
                    }
                    this.EditdialogVisible = false
                    this.getUserList()
                    this.$message.success('用户信息修改成功')
                })
            },
            // 监听修改对话框关闭事件
            editDialogClose(){
                this.$refs.editFormRef.resetFields();
            },
            // 展示编辑用户的对话框
            async showEditDialog(id){
                const {data:res} = await this.$axios.get('users/'+ id)
                if(res.meta.status !== 200){
                    this.$message.error("查询用户失败")
                }
                this.editForm = res.data
                this.EditdialogVisible = true

            },
            // 点击添加，添加用户
            addUser(){
                this.$refs.addFormRef.validate(async valid=>{
                    if(!valid) return
                    const {data:res} = await this.$axios.post('users',this.addForm)
                    if(res.meta.status !== 201){
                        this.$message.error("添加用户失败")
                    }
                    this.$message.success("添加用户成功");
                    this.addDialogVisible = false;
                    this.getUserList();
                })
            },
            //监听添加对话框的关闭时间
            addDialogclose(){
                this.$refs.addFormRef.resetFields();
            },
            async getUserList(){
                const {data:res} = await this.$axios.get('users',{params:this.queryInfo})
                 // console.log(res.data.total);
                if(res.meta.status != 200){
                    return this.$message.error('获取用户列表失败！')
                }
                this.userList = res.data.users
                this.total = res.data.total
            },
            //监听pagesize改变的事件：每页多少条
            handleSizeChange(newSize){
                // console.log(newSize);
                this.queryInfo.pagesize = newSize
                this.getUserList()

            },
            // 监听页码改变的事件:第几页
            handleCurrentChange(newPage){
                //console.log(newPage);
                this.queryInfo.pagenum = newPage
                this.getUserList();
            },
            // 监听switch的状态
            async userStateChange(userinfo){
                // console.log(userinfo);
                const{data:res} = await this.$axios.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
                if(res.meta.status != 200){
                    userinfo.mg_state = !userinfo.mg_state
                    return this.$message.error('更新状态失败')
                }
                this.$message.success('更新用户状态成功')

            }
        },
        created() {
            this.getUserList()
        }
    }
</script>

<style scoped lang="less">

</style>