<template>
  <div>
       <!--        面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 列表区域 -->
            <el-table :data="roleList" border stripe >
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="i1">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag @close="removeRightById(scope.row,item1.id)" closable >
                                     {{item1.authName}}
                                </el-tag>
                               <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 二级权限 -->
                                <el-row :class="[i2 === 0 ? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="i2">
                                    <el-col :span="6">
                                        <el-tag type="success" @close="removeRightById(scope.row,item2.id)" closable >{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="i3" closable @close="removeRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
    
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            //所有角色列表
            roleList:[]
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        // 根据ID删除对应的权限
        async removeRightById(role,rightId){
            //弹框提示
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err => err)
            if(confirmResult !== 'confirm'){
                return this.$message.info('取消了删除')
            }
            const {data:res} = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status !== 200){
                return this.$message.error('删除失败')
            }
            role.children = res.data
        },
        async getRolesList(){
           const{data:res} = await this.$axios.get('roles')
            if(res.meta.status !== 200) {
                return this.$message.error('获取列表失败')
            }
            this.roleList = res.data
            console.log(this.roleList);
            
       }
    }
}
</script>

<style lang="less">
    .vcenter{
        display: flex;
        align-items:center;
    }
    .el-tag{
        margin: 7px;
    }
    .bdtop{
        border-top:1px solid #eee;
    }
    .bdbottom{
        border-bottom:1px solid #eee;
    }
</style>