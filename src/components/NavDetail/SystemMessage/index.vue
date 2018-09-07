<template>
    <div class="SystemMessage">
        <ul class="clearfix">
            <li class="SystemMSM" :class="{navigation:navigation==0}" @click.stop="Native(0)">用户消息(对内)<i v-show="navigation==0" class="icon icongou" ></i></li>
            <li class="SystemMSM" :class="{navigation:navigation==1}" @click.stop="Native(1)">客户消息(对外)<i v-show="navigation==1" class="icon icongou" ></i></li>
        </ul>
        <div class="tableH">
            <template>
                <el-table :data="navigation===0?content:[]"  style="width:100%" border>
                    <el-table-column prop="eventName" label="消息类型" width="200"></el-table-column>
                    <el-table-column :prop="navigation===0?'useRule':''" :label="(navigation==0&&'发送对象')||(navigation==1&&'微信公众号消息')" width="280">
                        <template slot-scope="scope">
                            <el-cascader clearable change-on-select :show-all-levels="false" :options="SendObject" size="mini" :props="props" v-model="scope.row.useRule" @change="change"></el-cascader>
                            <!-- <el-tag size="mini" closable v-for="tag in scope.row.useRule">{{tag}}</el-tag> -->
                        </template>
                    </el-table-column>
                    <el-table-column :prop="navigation===0?'reply':''" :label="(navigation==0&&'Web后台站内消息')||(navigation==1&&'短信消息')" width="280">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.isOpen">是否发送</el-checkbox>
                            <Button Name="编辑内容" class="Btn" @click.native.stop="SystemDetail(scope.$index,scope.row)"/>
                        </template>
                    </el-table-column> 
                    <!-- <el-table-column prop="reply" :label="(navigation==0&&'APP消息推送')||(navigation==1&&'智能推送')" width="250">
                        <template slot-scope="scope">
                            <Button Name="编辑内容" class="Btn" @click.native.stop="AppDetail(scope.$index,scope.row)"/>
                        </template>
                    </el-table-column>-->
                    <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope">
                            <Button Name="保存" class="Btn" @click.native.stop="save(scope.$index,scope.row)"/>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="1" fixed="right"></el-table-column>
                </el-table>
            </template>
        </div>
        <Mtk v-show="IsShow"/>
        <div v-show="IsShow" class="SystemBox">
            <header class="Header">Web后台站内消息<i class="icon Fork Postion" @click.stop='cancel'></i></header>
            <div class="SystemCont">
                <span class="SystemText">消息类型：</span>
                <span>{{eventName}}</span>
            </div>
            <div class="SystemCont">
                <span class="SystemText">标签说明：</span>
                <span style="width:75%">
                    <span class="SystemTag" v-for="(item,index) in remark" :key="index">{{item.nameChinese+"："+item.nameEnglish}}</span>                    
                </span>
            </div>
            <div class="SystemCont">
                <span class="SystemText">站内信标题：</span>
                <Input :value='tmptName' @sonInput="sonInput" arguName="tmptName" widths="13.333333rem"/>
            </div>
            <div class="SystemCont">
                <span class="SystemText">内容模板：</span>
                <Textarea :values="cont"  @sonTextarea="sonInput" arguName="cont" minRows="3" maxRows="5" widths="30rem"/>
            </div>
            <div class="SystemCont">
                <span class="SystemText">同步消息模板：</span>
                <span>
                    <el-switch v-model="isOpen" :width="width" active-color="#2cbcc8" inactive-color="#DCDFE6"/>
                    <p>开启后可将当前设置的内容模板同步到同一消息类型下的其他推送方式</p><span>(微信公众号消息除外)</span>
                </span>
            </div>
            <div class="SystemBtn">
                <Button Name="取消" class="None" @click.native="cancel"/>                    
                <Button Name="确定" @click.native="submit"/>
            </div>
        </div>
    </div>
</template>

<script>
import Button from '../../common/Button'
import Mtk from '../../common/Mtk'
import Input from '../../common/Input'
import Textarea from '../../common/Textarea'
export default {
    components:{Button,Mtk,Input,Textarea},
    data(){
        return{
            width:24,
            navigation:0,
            content:[],
            SendObject:[],
            props:{
                value:"id",
                label:"name",
                children:"children",
            },
            IsShow:false,
            eventName:'',
            remark:[],
            isOpen:false,
            tmptName:'',
            cont:'',
            id:'',            
        }
    },
    mounted(){
        this.getObject()
        this.getSystem()
    },
    methods:{
        getObject(){
            this.$post(this.$host+'api/sys/msg/querySendObject',{}).then(d=>{
                if(d.success){
                    this.SendObject = d.data
                }
            })
        },
        change(value){
            console.log(value)
        },
        getSystem(){
            this.$post(this.$host+'/api/sys/msg/querySysmsgTemplate',{}).then(d=>{
                if(d.success){
                    let content = d.data
                    content.map(e=>{(e.isOpen==1&&(e.isOpen=true))||(e.isOpen==0&&(e.isOpen=false))
                        if(typeof(e.useRule)=="string"){
                            e.useRule=JSON.parse(e.useRule)
                            if(e.useRule.storeAll){
                                e.useRule=e.useRule.storeAll
                            }
                            if(e.useRule.statInfo){
                                e.useRule=e.useRule.statInfo
                            }
                            if(e.useRule.followEmp){
                                e.useRule=e.useRule.followEmp
                            }
                            if(e.useRule.busi){
                                e.useRule=e.useRule.busi
                            }
                        }
                    })
                    this.content = content
                }
            })
        },
        Native(Num){
            Num==0?this.navigation=0:this.navigation=1;
        },
        // AppDetail(index,item){
        //     this.$router.push({path:'/NavDetail/AppMessage',query:{id:item.id}})
        // },
        save(index,item){
            if(item.useRule.length<1){
                this.$message({
                    type: 'info',
                    message: '请选择发送对象！',
                    duration:"1000",
                }); 
                return
            }
            let useRule = {}
            if(item.useRule[0]==1){
                useRule.storeAll=item.useRule
            }
            if(item.useRule[0]==2){
                useRule.statInfo=item.useRule
            }
            if(item.useRule[0]==3){
                useRule.followEmp=item.useRule
            }
            if(item.useRule[0]==4){
                useRule.busi=item.useRule
            }
            let _data = {
                id:item.id,
                isOpen:item.isOpen?1:0,
                useRule:JSON.stringify(useRule)
            }
            this.$post(this.$host+'/api/sys/msg/modifySysmsgTemplate',_data).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '保存成功！',
                        duration:"1000",
                    }); 
                }
            })
        },
        SystemDetail(index,item){
            // this.$router.push({path:'/NavDetail/BackMessage',query:{id:item.id}})
            this.$post(this.$host+"api/sys/msg/querySysmsgTemplateOne", {id:item.id}).then(d => {
                if(d.success) {
                    this.IsShow = true;
                    this.eventName = d.data.eventName
                    // d.data.isOpen==1?this.isOpen=true:this.isOpen=false;
                    this.tmptName = d.data.tmptName                
                    this.remark = d.data.remark                
                    this.cont = d.data.cont                
                    this.id = d.data.id                
                }
            });
        },
        sonInput(value,arguName){
            this[arguName]=value
        },
        cancel(){
            this.IsShow = false;
        },
        submit(){
            let _data = {
                id:this.id,
                cont:this.cont,
                tmptName:this.tmptName
            }
            this.$post(this.$host+'/api/sys/msg/modifySysmsgTemplate',_data).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '保存成功！',
                        duration:"1000",
                    }); 
                    this.cancel()
                }
            })
        }
    }
}
</script>

<style >
.el-checkbox__label{
    font-size: 12px;
    padding-top: 4px;
}
.el-switch__core {
    height: 14px!important;
}
 .el-switch__core .el-switch__button {
  top: 0;
  left: 0;
  width: 12px!important;
  height: 12px!important;
}
 .is-checked .el-switch__core .el-switch__button {
  transform: translate3d(10px, 0px, 0px) !important;
}
.SystemMessage .el-switch__core:after{
  top: 0;
  left: 0;
  width: 12px!important;
  height: 12px!important;
}
.el-switch.is-checked .el-switch__core::after{
    margin-left: -12px!important;
}
.SystemMSM{
    float: left;
    border: 1px solid #efefef;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: relative;
    cursor: pointer;
}
.SystemMSM.navigation{
    border: 1px solid #2cbcc8;
    color: #2cbcc8;
}
.icongou::before{
    content: "\e650";
    position: absolute;
    font-size: 36px;
    right: -10px;
    bottom: -9px;
}
.SystemMessage .tableH{
    margin:1rem 0;
}
.SystemBox{
    width: 50rem;
    /* height: 41.666667rem; */
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    z-index: 1000;
    border-radius: 4px;
    background: #fff;
    overflow: hidden;
}
.SystemBox .Header{
    font-size:1.166667rem; 
    margin:0 1.5rem 2.5rem 1.5rem;
    padding:1.333333rem 0 .833333rem 0;
    border-bottom:solid 1px #efefef;
    color: #5d717c;
}
.SystemBox .Postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
.SystemCont{
    display: -webkit-flex;
    display: flex;
    margin-bottom: 1.5rem;
}
.SystemText{
    display: inline-block;
    width: 20%;
    text-align: right;
}
.SystemTag{
    margin-right: 1rem;
    display: inline-block;
}
.SystemBtn{
    margin: 3rem 0;
    text-align: center;
}
.SystemBtn button:first-child{
    margin-right: 2rem;
}
</style>
