<template>
    <div class="SetMessage">
        <ul class="clearfix">
            <li class="MSMSelect" :class="{ToggleShow:ToggleShow===0}" @click.stop="toggle(0)">短信签名<i class="icon icongou" v-show="ToggleShow===0"></i></li>
            <li class="MSMSelect" :class="{ToggleShow:ToggleShow===1}" @click.stop="toggle(1)">短信正文<i class="icon icongou" v-show="ToggleShow===1"></i></li>
        </ul>
        <div class="LabelsThaeder">
            <Button Name='新增' :iconadd="true" @click.native="newLabel"/>
        </div>
        <template>
            <el-table :data="ToggleShow===0?SignContent:DataContent"  style="width:100%" border>
                <el-table-column :prop="ToggleShow===0?'signCode':'tmptCode'" label="编号" width="150"></el-table-column>
                <el-table-column :prop="ToggleShow===0?'sign':'cont'" label="内容" width="350"></el-table-column>
                <el-table-column label="状态" width="120">
                    <template slot-scope="scope">
                        <span>{{ (scope.row.status==0&&'已通过')||(scope.row.status==1&&'待审核')||(scope.row.status==2&&'已拒绝') }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="reply" label="审批信息" width="350"></el-table-column>                
                <el-table-column label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                        <Button Name="修改" class="Btn" v-if="scope.row.status!=0" @click.native.stop="Modify(scope.$index,scope.row)"/>
                        <i v-if="scope.row.status!=0" class="borderLeft"></i>
                        <Button Name="删除" class="Btn" @click.native.stop="Delete(scope.$index,scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column min-width="1" fixed="right"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="ToggleShow===0?SignTopage:DataTopage" :total="ToggleShow===0?Signtotal:Datatotal" class="pagingwidth"/>
        <Mtk v-show="Display"/>
        <div v-show="Display" class="SMSLabels">
            <header class="SMSHeader">{{id?'修改短信签名':'新增短信签名'}}<i class="icon Fork Postion" @click.stop="cancel"></i></header>
            <div class="SMSBox">
                <div class="SMStext"><i class="icon waring"></i>标签内容：</div>
                <div>
                    <Input widths="13.333333rem" :value="sign" arguName="sign" @sonInput="sonInput" :maxlength="12" :blur="signblur"/>
                    <i class="error" v-show="signIsShow">必填</i>
                </div>
            </div>
            <div class="SMSBox">
                <div class="SMStext">备注：</div>
                <div>
                    <Textarea :values="remark"  arguName="remark" @sonTextarea="sonInput" minRows="3" maxRows="5" widths="20rem"/>                    
                </div>
            </div>
            <div class="SMSLabelsBut">
                <Button Name="取消" class="None" @click.native.stop="cancel"/>
                <Button Name="确定" @click.native.stop="submit"/>
            </div>
        </div>
        <Mtk v-show="IsShow"/>
        <div v-show="IsShow" class="SMSContent">
            <header class="SMSHeader">{{ID?'修改短信内容':'新增短信内容'}}<i class="icon Fork Postion" @click.stop="callOff"></i></header>  
            <div class="SMSBox">
                <div class="SMStxt"><i class="icon waring"></i>模板名称：</div>
                <Input widths="13.333333rem" :value="tmptName" arguName="tmptName" @sonInput="sonInput" :blur="tmptNameblur"/>
                <i class="error" v-show="tmptNameIsShow">必填</i>
            </div>
            <div class="SMSBox">
                <div class="SMStxt"><i class="icon waring"></i>模板类型：</div>
                <span class="TemplateType" @click.stop="SmsType(0)"><i class="icon unradio" :class="{radio:busiType==0}"></i>普通通知</span>
                <span class="TemplateType" @click.stop="SmsType(1)"><i class="icon unradio" :class="{radio:busiType==1}"></i>预约</span>
                <span class="TemplateType" @click.stop="SmsType(2)"><i class="icon unradio" :class="{radio:busiType==2}"></i>注册</span>
                <span class="TemplateType" @click.stop="SmsType(3)"><i class="icon unradio" :class="{radio:busiType==3}"></i>促销</span>
            </div> 
            <div class="MessageBox">
                <div class="SMStxt"><i class="icon waring"></i>短信内容：</div>
                <Textarea :values="cont"  arguName="cont" @sonTextarea="sonInput" minRows="4" maxRows="8" widths="32rem" :blur="contblur" placeholder="模板示例：{1}为您的登录验证码，请于{2}分钟内填写。如非本人操作，请忽略本短信。（其中{数字}为可自定义的内容，须从1开始连续编号，如{1}、{2}等）"/>
                <i class="error" v-show="contIsShow">必填</i>
            </div>
            <div class="Prompt">
                <p>1.长度不超过450字。单条短信超过70字后，按67字/条分多条计费</p>
                <p>2.营销类短信，请在短信内容后面增加“回T退订”</p>
                <p>3.短信模板内容不能含有【】符号</p>
                <p>4.不能发送房产、移民、贷款、政治、色情暴力等违法短信</p>
                <p>模板示例：{1}为您的登录验证码，请于{2}分钟内填写。如非本人操作，请忽略本短信。（其中{数字}为可自定义的内容，须从1开始连续编号，如{1}、{2}等）</p>
            </div>
            <div class="SMSBox">
                <div class="SMStxt">备注：</div>
                <Textarea :values="remark"  arguName="remark" @sonTextarea="sonInput" minRows="2" maxRows="2" widths="32rem"/>
            </div>        
            <div class="SMSLabelsBut">
                <Button Name="取消" class="None" @click.native.stop="callOff"/>
                <Button Name="确定" @click.native.stop="confirm"/>
            </div>
        </div>
    </div>
</template>

<script>
import Input from '../../common/Input'
import Button from '../../common/Button'
import Paging from '../../common/Paging'
import Mtk from '../../common/Mtk'
import Textarea from '../../common/Textarea'
export default {
    components:{Input,Button,Paging,Mtk,Textarea},
    data(){
        return{
            ToggleShow:0,
            pageSize:20,
            SignContent:[],//短信签名数组            
            SignpageNumber:'',
            Signtotal:0,
            DataContent:[],//短信内容
            DatapageNumber:'',
            Datatotal:0,
            Display:false,
            id:'',
            signCode:'',
            sign:'',   
            signIsShow:false,         
            remark:'',
            IsShow:false,
            ID:'',
            tmptCode:'',
            tmptName:'',
            tmptNameIsShow:false,
            busiType:0,
            cont:'',
            contIsShow:false,
        }
    },
    mounted(){
        this.SignTopage(1)
        this.DataTopage(1)
    },
    methods:{
        sonInput(value,arguName){
            this[arguName]=value;
        },
        signblur(){
            if(!this.sign){
                this.signIsShow = true
                return
            }
            this.signIsShow = false
            if(!/[\u4e00-\u9fa5_a-zA-Z0-9_]{2,12}/.test(this.sign)){
                this.$message({
                    type: 'info',
                    message: '签名由长度2到12位中英文、数字组成！',
                    duration:"1000",
                });
            }  
        },
        tmptNameblur(){
            if(!this.tmptName){
                this.tmptNameIsShow = true
                return
            }
            this.tmptNameIsShow = false
            if(!/[\u4e00-\u9fa5_a-zA-Z0-9_]/.test(this.tmptName)){
                this.$message({
                    type: 'info',
                    message: '模板名称只能包含中英文及数字！',
                    duration:"1000",
                });
            }           
        },
        contblur(){
            if(!this.cont){
                this.contIsShow = true
                return
            }
            this.contIsShow = false
            if(this.cont.indexOf('【')>-1 || this.cont.indexOf('】')>-1){
                this.$message({
                    type: 'info',
                    message: '短信模板内容不能含有【】符号',
                    duration:"1000",
                });
            }
        },
        toggle(num){
            num===0?this.ToggleShow=0:this.ToggleShow=1;
        },
        SignTopage(index){
            let data ={
                pageSize:this.pageSize,
                pageNumber:parseInt(index),
                belongShop:this.$getCookie('belongShop'),                
            }
            this.$post(this.$host+'/api/msg/sign/findMsgSignPage',data).then(d=>{
                if(d.success){
                    this.SignContent = d.data.content
                    this.SignpageNumber = d.data.pageNumber
                    this.Signtotal = d.data.total
                }
            })
        },
        DataTopage(index){
            let data ={
                pageSize:this.pageSize,
                pageNumber:parseInt(index),               
            }
            this.$post(this.$host+'/api/msg/template/findMsgTemplatePage',data).then(d=>{
                if(d.success){
                    this.DataContent = d.data.content
                    this.DatapageNumber = d.data.pageNumber
                    this.Datatotal = d.data.total
                }
            })
        },
        newLabel(){
            if(this.ToggleShow===0){
                this.Display = true                
            }
            if(this.ToggleShow===1){
                this.IsShow = true
            }
        },
        Modify(index,item){
            if(this.ToggleShow===0){
                this.$post(this.$host+'/api/msg/sign/findMsgSignOne',{id:item.id}).then(d=>{
                    if(d.success){
                        this.Display = true
                        this.id = item.id
                        this.signCode = item.signCode
                        this.sign = d.data.sign
                        this.remark = d.data.remark
                    }
                })
            }
            if(this.ToggleShow===1){
                this.$post(this.$host+'/api/msg/template/findMsgTemplateById',{id:item.id}).then(d=>{
                    if(d.success){
                        this.IsShow = true
                        this.ID = d.data.id
                        this.tmptCode = d.data.tmptCode
                        this.tmptName = d.data.tmptName
                        this.busiType = d.data.busiType
                        this.cont = d.data.cont
                        this.remark = d.data.remark
                    }
                })
            }
        },
        Delete(index,item){
            if(this.ToggleShow===0){
                this.$messagebox.confirm('此操作将永久删除该短信签名, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                            this.$post(this.$host+"/api/msg/sign/delMsgSign", {signCodeList:[parseInt(item.signCode)],idList:[parseInt(item.id)]}).then(d => {
                                if (d.success) {
                                        // this.SignContent.splice(index, 1);
                                        this.$message({
                                            type: 'success',
                                            message: '删除成功!',
                                            duration:"1000",
                                        });
                                        this.SignTopage(this.SignpageNumber)
                                }
                            });
                    }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除',
                                duration:"1000",
                            });          
                    });
            }
            if(this.ToggleShow == 1){
                this.$messagebox.confirm('此操作将永久删除该短信正文, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                            this.$post(this.$host+"/api/msg/template/delMsgTemplate", {tmptCodeList:[parseInt(item.tmptCode)],idList:[parseInt(item.id)]}).then(d => {
                                if (d.success) {
                                        // this.DataContent.splice(index, 1);
                                        this.$message({
                                            type: 'success',
                                            message: '删除成功!',
                                            duration:"1000",
                                        });
                                        this.DataTopage(this.DatapageNumber)
                                }
                            });
                    }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除',
                                duration:"1000",
                            });          
                    });
            }
        },
        cancel(){
            this.signIsShow = this.Display = false
            this.id = ''
            this.sign = ''
            this.remark = ''
            this.signCode = ''
        },
        submit(){
            if(!this.sign){
                this.signIsShow = true
                return
            }
            if(!/[\u4e00-\u9fa5_a-zA-Z0-9_]{2,12}/.test(this.sign)){
                this.$message({
                    type: 'info',
                    message: '签名由长度2到12位中英文、数字组成！',
                    duration:"1000",
                });
                return
            }
            let data = {
                sign:this.sign,
                remark:this.remark,
            }
            if(this.id){
                data.id = this.id
                data.signCode = parseInt(this.signCode)                                
                this.$post(this.$host+'/api/msg/sign/modMsgSign',data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '修改成功！',
                            duration:"1000",
                        });
                        this.SignTopage(this.SignpageNumber)                        
                        this.cancel()
                    }
                })
            }else{
                data.belongShop = this.$getCookie('belongShop')                
                this.$post(this.$host+'/api/msg/sign/saveMsgSign',data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '新增成功！',
                            duration:"1000",
                        });
                        this.SignTopage(this.SignpageNumber)
                        this.cancel()
                    }
                })
            }
        },
        SmsType(num){
            if(this.busiType != num){
                this.busiType = num
            }
        },
        callOff(){
            this.tmptNameIsShow = this.contIsShow = this.IsShow = false
            this.ID = ''
            this.tmptCode = ''
            this.tmptName = ''
            this.busiType = 0
            this.cont = ''
            this.remark = ''
        },
        confirm(){
            if(!this.tmptName){
                this.tmptNameIsShow = true
                return
            }
            if(!/[\u4e00-\u9fa5_a-zA-Z0-9_]/.test(this.tmptName)){
                this.$message({
                    type: 'info',
                    message: '模板名称只能包含中英文及数字！',
                    duration:"1000",
                });
                return
            } 
            if(this.cont.indexOf('【')>-1 || this.cont.indexOf('】')>-1){
                this.$message({
                    type: 'info',
                    message: '短信模板内容不能含有【】符号',
                    duration:"1000",
                });
                return
            }
            if(!this.cont){
                this.contIsShow = true
                return
            }
            let data = {
                busiType:this.busiType,
                tmptName:this.tmptName,
                cont:this.cont,
                remark:this.remark,
            }
            if(this.ID){
                data.tmptCode = this.tmptCode
                data.id = this.ID
                this.$post(this.$host+'/api/msg/template/modMsgTemplate',data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '修改成功！',
                            duration:"1000",
                        });
                        this.DataTopage(this.DatapageNumber)                        
                        this.callOff()
                    }
                })
            }else{
                this.$post(this.$host+'/api/msg/template/saveMsgTemplate',data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '新增成功！',
                            duration:"1000",
                        });
                        this.DataTopage(this.DatapageNumber)                        
                        this.callOff()
                    }
                })
            }
        },
    }
}
</script>

<style scoped>
.error{
    font-size:1rem;
    color: #f50;
    margin-left: 1rem;
}
.icongou::before{
    content: "\e650";
    position: absolute;
    font-size: 36px;
    right: -10px;
    bottom: -9px;
}
.MSMSelect{
    float: left;
    border: 1px solid #efefef;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: relative;
    cursor: pointer;
}
.MSMSelect.ToggleShow{
    border: 1px solid #2cbcc8;
    color: #2cbcc8;
}
.LabelsThaeder{
    display: inline-block;
    margin:1rem 2rem 1rem 0;
}
.SMSLabels{
    width: 33.333333rem;
    height: 25rem;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    z-index: 1000;
    background: #fff;
    overflow: hidden;    
}
.SMSHeader{
    font-size:1.166667rem; 
    margin:0 1.5rem 2.5rem 1.5rem;
    padding:1.333333rem 0 .833333rem 0;
    border-bottom:solid 1px #efefef;
    color: #5d717c;
}
.SetMessage .Postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
.SMSBox{
    display: flex;
    margin-bottom: 1.5rem;
}
.MessageBox{
    display: flex;
}
.SMStext{
    width: 25%;
    text-align: right;
}
.SMSLabelsBut{
    margin-top: 2rem;
    text-align: center;
}
.SMSLabelsBut button:first-child{
    margin-right: 2rem;
}
.SMSContent{
    width: 50rem;
    height: 50rem;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    z-index: 1000;
    background: #fff;
    overflow: hidden;
}
.SMStxt{
    width: 20%;
    text-align: right;
}
.TemplateType{
    margin-right: 1rem;
    cursor: pointer;
}
.TemplateType .unradio::before{
    margin-right: .5rem;
}
.Prompt{
    padding-left: 20%;
    margin-bottom: 1.5rem;
}
</style>
