<template>
    <div class="ApproveForm">
        <div class="header" v-show="!see">
            <Button Name="添加" @click.native="AddLength" :iconadd="true"/>
        </div>
        <div class="tableH layout">
            <el-table :data="jsonList" border style="width:100%">
                <el-table-column  type="index" label="序号" width="50"></el-table-column>
                <el-table-column  prop="data" label="数据类型" width="150">
                    <template slot-scope="scope">
                        <Select :SelecttemData="datas" :arguName="scope.$index" :values="scope.row.type" :SelecttemDetail="['dKey','dKeyname']" @sonSelect="upSelect" widths="120px" :small="small" :disabled="see"/>
                    </template>
                </el-table-column>
                <el-table-column  prop="label" label="显示名称" width="200">
                    <template slot-scope="scope">
                        <Input placeholder="请输入名称" :arguName="scope.$index" widths="160px" :value="scope.row.label" @sonInput="upInput" :readonlys="see"/>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="250" style="display:'none'">
                    <template slot-scope="scope" class="" >
                        <div class="">
                            <Button Name="删除" :buttonClass="see?'Btndisabled':'Btn'"  @click.native="DeleteItem(scope.$index)"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  ></el-table-column>
            </el-table>
        </div>
        <div class="footer" v-show="!see">
            <Button Name="取消" @click.native="cancle" buttonClass="None"/>
            <Button Name="保存" @click.native="submit" />
        </div>
    </div>
</template>
<script>
    import Button from "../../../common/Button";
    import Select from "../../../common/Select";
    import Input from "../../../common/Input"
    export default{
        components: {
            Button,Select,Input
        },
        data(){
            return{
                small:true,
                datas:[],
                jsonList:[{label: "", type: "input", data: "D001"}],
                see:false,
            }
        },
        methods:{
            cancle(){
                history.go(-1);
            },
            upInput(value,index){
                this.jsonList[index].label=value;
            },
            //选择数据类型
            upSelect(value,index){
                this.jsonList[index].type=value;
                let data='';
                this.datas.map(el=>{
                    if(el.dKey==value){
                        data=el.dValue;
                    }
                })
                this.jsonList[index].data=data;
                console.log(
                    this.jsonList
                )
            },
            SelectChange(index){
                //dKey对应的datas中的索引
                let dValueIndex=0;
                this.datas.map((v,i)=>{
                    if(v.dKey==this.jsonList[index].type){
                        dValueIndex=i;
                        return;
                    }
                })
                this.jsonList[index].data= this.datas[dValueIndex].dValue;
            },
            //添加一条
            AddLength(){
                this.jsonList.push({label: "", type: "input", data: "D001"});
            },
            //删除一条
            DeleteItem(index){
                if(this.see){
                    return;
                }else{
                    this.jsonList.splice(index,1);
                }
            },
            //提交表单
            submit(){
                let newlist=[];
                this.jsonList.map(el=>{
                    if(el.label){
                        newlist.push(el)
                    }
                });
                if(newlist.length==0){
                    this.$message({
                        type:"info",
                        message:"请最少输入一条有效数据"
                    });
                    return;
                }
                let data={
                    floId:this.$route.query.id,
                    jsonList:newlist
                }
                this.$post(this.$host+"/api/sysmgr/dynamicForm/add",data).then(d=>{
                    if(d.success){
                        //新增流程表单成功
                        this.$message({
                            type: 'success',
                            message: '保存成功!',
                            duration:"500",
                            onClose:()=>{
                                this.$router.push({
                                    path:"/NavDetail/ExamineApprove"
                                })
                            }
                        });
                    }
                })
            }
        },
        mounted () {
            let id = this.$route.query.id;
            let type=this.$route.query.type||"";
            if(type=="_see"){
                this.see=true;
            }
            //获取表单类型
            this.$post(this.$host+"/api/sysmgr/dict/getFormElement",{}).then(d=>{
                if(d.success){
                    this.datas=d.data;
                }   
            })
            //获取表单配置
            this.$post(this.$host+"/api/sysmgr/dynamicForm/getOne/"+id,{}).then(d=>{
                if(d.success){
                    if(d.data){
                        this.jsonList=d.data.jsonList;
                    }
                }
            })
        }
    }
</script>
<style scoped>
    .footer{
        text-align: center;
        margin-top: 24px;
    }
    .footer button:last-child{
        margin-left: 24px;
    }
    .ApproveForm{
    }
    .ApproveForm .header{
        padding: 12px 0;
    }
    .button{
    background: none !important;
    color: #386b88 !important;
}
      .table-bordered {
        border: 1px solid #ddd;
        border-collapse: separate;
        border-left: 0;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }
    .table-bordered th, .table-bordered td {
    border-left: 1px solid #ddd;
}
.table thead{
    background: #efefef;
}
.table th, .table td {
    text-align: center;
    vertical-align: top;
    border-top: 1px solid #ddd;
    font-size: 12px;
    height: 2.5rem;
    line-height: 2.5rem;
    width: 12.5rem;
}
.table th{
    font-size: 14px;
    
}
.table th:first-child, .table td:first-child{
    width: 4.166667rem;
    background: #efefef;
}
.table th{
    border-top:none;
}
</style>