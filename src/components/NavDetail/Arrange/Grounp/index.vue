<template>
    <div class="Grounp ">
        <div class="clearfix">
            <ul class="left">
                <li @click="selectgrounp(item,index)" :class="{active:item.active}" v-for="(item,index) in grounps">{{item.groupName}}</li>
                <li @click="addgroup" :class="{active:xinactive}" v-show="grounps.length>0">+添加新的小组</li>
            </ul>
            <div class="right">
                <header class="clearfix">
                    <div class="left">
                        小组名称：<Input placeholder="请输入新小组名称" :value="groupName" arguName="groupName" @sonInput="upInput"/>
                    </div>
                    <div class="right">
                        <Button Name="删除该小组" v-show="this.groupId" @click.native="deletegroup"/>
                    </div>
                </header>
                <div >
                    <p class="title">
                        小组成员
                    </p>   
                    <Button Name="添加" @click.native="addEmp"/>
                    <div :style="{minWidth:'400px',maxWidth: '482px'}">
                        <el-table :data="datas" border style="width:100%">
                            <el-table-column label="员工姓名" prop="empName"  width="120"></el-table-column>
                            <el-table-column label="岗位" prop="statName"  width="120"></el-table-column>
                            <el-table-column label="职位" prop="pstName"  width="120"></el-table-column>
                            <el-table-column  width="120">
                                <template slot-scope="prop">
                                    <Button buttonClass="Btn" Name="移除" @click.native="deleteitem(prop.$index)"/>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="footer">
                    <!-- <Button buttonClass="None" Name="取消"/> -->
                    <Button  Name="保存" @click.native="save"/>
                </div>
            </div>
        </div>
        <div class="model"  v-show="modelShow">
            <header class="clearfix Header">
                <div class="left">选择未分组的员工</div>
                <div class="right"><i class="icon iconclose" @click="cancleemps"></i></div>
            </header>
            <div class="body">
                <div class="demand">
                        岗位/职位：<Position  :arguName="['jobs','jName']" @sonPostPosition="sonPostPosition"/>
                        员工：<Input placeholder="姓名/工号" arguName="workNoOrName" @sonInput="upInput"/>
                            <Button Name="查询" @click.native="demand"/>

                </div>
                <div :style="{minWidth:'400px',maxWidth: '532px'}">
                    <el-table :data="empList" border style="width:100%" @selection-change="select" >
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column label="员工姓名" prop="empName"  width="120"></el-table-column>
                        <el-table-column label="员工工号" prop="workNo"  width="120"></el-table-column>
                        <el-table-column label="岗位" prop="statName"  width="120"></el-table-column>
                        <el-table-column label="职位" prop="pstName"  width="120"></el-table-column>
                    </el-table>
                    <Paging :handleCurrentChange="handleCurrentChange" :total="total" v-show="total>10" :pageSize="10" :currentPage="currentPage" class="paging"/>
                    <div class="Footer">
                        <Button buttonClass="None" Name="取消" @click.native="cancleemps"/>
                        <Button  Name="确定" @click.native="sureEmps"/>
                    </div>
                </div>
            </div>
        </div>
        <Mtk v-show="modelShow"/>
    </div>
</template>
<script>
    import Position from "../../../common/Position"
    import Paging from "../../../common/Paging"
    import Mtk from "../../../common/Mtk"
    import Input from "../../../common/Input"
    import Button from "../../../common/Button"
    export default{
        components: {
            Input,Button,Mtk,Position,Paging
        },
        data(){
            return{
                currentPage:1,
                modelShow:false,
                grounps:[],//小组的列表
                datas:[],//小组成员的数据
                groupName:"",
                groupId:"",
                empList:[],
                total:1,
                yuEmps:[],
                xinactive:false,
                position:"",//职位
                jobs:"",//岗位
                workNoOrName:"",//员工工号或者员工姓名,
            }
        },
        methods: {
            // 删除该分组
            deletegroup(){
                this.$post(this.$host+"/api/store/employee/deleteGroup",{groupId:this.groupId}).then(d=>{
                    if(d.success){
                        this.$message({
                            type:"success",
                            message:"删除分组成功"
                        });
                        this.Load();
                    }
                })
            },
            // 点击新增小组
            addgroup(){
                this.groupId="";
                this.groupName="";
                this.datas=[];
                this.xinactive=true;
                this.grounps.map(el=>{
                    el.active=false;
                })
            },
            // 保存
            save(){
                if(!this.groupName){
                    this.$message({
                        type:"info",
                        message:"小组名称不能为空"
                    });
                    return;
                }
                if(this.groupId){//修改
                    let data={
                        groupName:this.groupName,
                        empInfo:this.datas,
                        groupId:this.groupId
                    }
                    this.$post(this.$host+"/api/store/employee/addOrUpdateGroup",data).then(d=>{
                        if(d.success){
                            this.$message({
                                type:"success",
                                message:"修改成功"
                            });
                            this.$post(this.$host+"/api/store/employee/findGroupName",{}).then(d=>{
                                if(d.success){
                                    let data=d.data;
                                    data.map((el,index)=>{
                                        el.active=false;
                                        if(el.groupId==this.groupId){
                                            el.active=true;
                                        }
                                    })
                                    this.xinactive=false;
                                    this.grounps=data;
                                }
                            })
                        }
                    })
                }else{//新增
                    let data={
                        groupName:this.groupName,
                        empInfo:this.datas
                    }
                    this.$post(this.$host+"/api/store/employee/addOrUpdateGroup",data).then(d=>{
                        if(d.success){
                            this.$message({
                                type:"success",
                                message:"新增分组成功"
                            });
                            this.groupId=d.data.groupId;
                            this.$post(this.$host+"/api/store/employee/findGroupName",{}).then(d=>{
                                if(d.success){
                                    let data=d.data;
                                    data.map((el,index)=>{
                                        el.active=false;
                                        if(el.groupId==this.groupId){
                                            el.active=true;
                                        }
                                    });
                                    this.xinactive=false;
                                    
                                    this.grounps=data;
                                }
                            })
                        }
                    })
                }
            },
            upInput(value,arguName){
                this[arguName]=value;
            },
            // 选择小组
            selectgrounp(item,index){
                this.grounps.map(el=>{
                    el.active=false;
                })
                this.xinactive=false;
                item.active=true;
                this.groupId=item.groupId;
                this.groupName=item.groupName;
                this.$post(this.$host+"/api/store/employee/findGroupEmployee",{groupId:this.groupId}).then(da=>{
                    if(da.success){
                        this.datas=da.data;
                    }
                })
            },
            // 选择岗位
            sonPostPosition(item){
                console.log(item)
                this.jobs=item[0];
                this.position=item[1];
            },
            // 查询
            demand(){
                let data={
                    pageNumber:1,
                    pageSize:10,
                    groupId:this.groupId,
                    jobs:this.jobs,
                    position:this.position,
                    workNoOrName:this.workNoOrName
                }
                this.$post(this.$host+"/api/store/employee/findEmployeeAndGroupPage",data).then(d=>{
                    if(d.success){
                        this.modelShow=true;
                        this.empList=d.data.content;
                        this.total=d.data.total;
                    }
                })
            },
            // 选中的员工
            select(items){
                this.yuEmps=items;
            },
            // 确定选中的员工
            sureEmps(){
                this.yuEmps.map(el=>{
                    let canpush=true;
                    this.datas.map(val=>{
                        if(el.workNo==val.workNo){
                            canpush=false;
                        }
                    })
                    canpush&&this.datas.push(el)
                });
                this.modelShow=false;
            },
            // 取消员工弹框
            cancleemps(){
                this.modelShow=false;
            },
            // 点击 添加员工
            addEmp(){
                this.currentPage=1;
                let data={
                    pageNumber:1,
                    pageSize:10,
                    groupId:this.groupId,
                    jobs:this.jobs,
                    position:this.position,
                    workNoOrName:this.workNoOrName
                }
                this.$post(this.$host+"/api/store/employee/findEmployeeAndGroupPage",data).then(d=>{
                    if(d.success){
                        this.modelShow=true;
                        this.empList=d.data.content;
                        this.total=d.data.total;
                    }
                })
            },
            // 分页
            handleCurrentChange(index){
                this.currentPage=parseInt(index);
                let data={
                    pageNumber:parseInt(index),
                    pageSize:10,
                    groupId:this.groupId,
                    jobs:this.jobs,
                    position:this.position,
                    workNoOrName:this.workNoOrName
                }
                this.$post(this.$host+"/api/store/employee/findEmployeeAndGroupPage",data).then(d=>{
                    if(d.success){
                        this.empList=d.data.content;
                        this.total=d.data.total;
                    }
                })
            },
            // 移除
            deleteitem(index){
                this.datas.splice(index,1);
            },
            Load(){
                this.$post(this.$host+"/api/store/employee/findGroupName",{}).then(d=>{
                    if(d.success){
                        let data=d.data;
                        if(data.length>0){
                            data.map((el,index)=>{
                                el.active=false;
                                if(index==0){
                                    el.active=true;
                                }
                            })
                            this.grounps=data;
                            if(this.grounps.length==0){
                                this.xinactive=true;
                            }
                            this.groupName=d.data[0].groupName;
                            this.groupId=d.data[0].groupId;
                            this.$post(this.$host+"/api/store/employee/findGroupEmployee",{groupId:d.data[0].groupId}).then(da=>{
                                if(da.success){
                                    this.datas=da.data;

                                }
                            })
                        }else{
                            this.grounps=[];
                            this.groupName="";
                            this.groupId="";
                            this.datas=[];
                            this.xinactive=true;
                        }
                        
                    }
                })
            }
        },
        mounted(){
            this.Load();
        }
    }
</script>
<style scoped>
    .Footer{
        text-align: right;
        padding: 2rem 0;
    }
    .body{
        width: 532px;
        margin:  0 auto;
    }
    .body .demand{
        padding-bottom: 2rem;
    }
    .model{
        background: #fff;
        width: 600px;
    }
    .Grounp{
        width: 640px;
        padding-top: 1rem;
    }
    .Grounp>.right header{
        padding-bottom: 2rem;
    }
    .footer{
        text-align: center;
        margin-top: 2rem;
    }
    .paging{
        text-align: right;
        margin-top: 12px;
    }
</style>