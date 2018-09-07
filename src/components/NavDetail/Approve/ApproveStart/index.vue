<template>
    <div class="ApproveStartS">
    <ul class="ApproveStart clearfix">
        <li v-for="item in datas" :class="{active:item.active}" @click="startApprove(item)" >
            {{item.flowName}}
        </li>
    </ul>
    <div class="addContact" v-show="ApproveDetail">
        <ul class="Tbodys">
            <li v-for="(item,index) in startApprovedatas" >
                <span class="left">{{item.label}}：</span>
                <!-- 机构类型选择     2        -->
                <span v-if="item.type=='select_orgtype'">
                    <Select :SelecttemData="select_orgtype" :values="Names[index][item['name']]" :arguName="index" :SelecttemDetail="['dKey','dKeyname']" @sonSelectobj="upSelectselect_orgtype"/>
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                </span>
                <!-- 性别选择    3       -->
                <span v-else-if="item.type=='select_sex'">
                    <Select :SelecttemData="select_sex"  :arguName="index" :values="Names[index][item['name']]" :SelecttemDetail="['dKey','dKeyname']" @sonSelectobj="upSelectselect_sex"/>
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                </span>
                <!-- 是否选择  4           -->
                <span v-else-if="item.type=='select_is'">
                    <Select :SelecttemData="select_is"  :arguName="index" :values="Names[index][item['name']]" :SelecttemDetail="['dKey','dKeyname']" @sonSelectobj="upSelect"/>
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                </span>
                <!-- 日期选择 5          -->
                <span v-else-if="item.type=='date'">
                    <!-- <Select :SelecttemData="select_is"  :arguName="index" :SelecttemDetail="['dKey','dKeyname']" @sonSelect="upSelect"/> -->
                    <DatePicker :arguName="index" @clickDatePiker="upDatePiker"/>
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                </span>
                <!-- 时间选择 6       -->
                <span v-else-if="item.type=='time'">
                    <TimePicker :arguName="index" @clickTimePiker="upDatePiker" />
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                </span>
                <!-- 日期时间选择(生效时间和截止时间) 7        -->
                <span v-else-if="item.type=='datetime_take'||item.type=='datetime_end'">
                    <TakeTimePiker :arguName="index" @clickTakeTimePiker="upDatePiker"/>
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                </span>
                <!-- 用户选择 8-->
                <span v-else-if="item.type=='query_user'">
                    <Input placeholder="请选择用户"  :value="PeopleUserName"  @click.native="showPeopleUser" readonly="readonly" />
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                    <AboutPeople :RadioPeople="Radio"  :AboutPeopleSelected="AboutPeopelSelectedUser" v-show="PeopleShowUser" :Index="index" :canclefun="canclefun"/>
                </span>
                <!-- 发起人 8-->
                <span v-else-if="item.type=='query_emp_id'">
                    <Input placeholder="请选择用户"  :value="PeopleName"  @click.native="showPeople" readonly="readonly" />
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                    <AboutPeople :RadioPeople="Radio"  :AboutPeopleSelected="AboutPeopelSelected" v-show="PeopleShow" :Index="index" :canclefun="canclefun"/>
                </span>
                <!-- 机构部门选择 9-->
                <span v-else-if="item.type=='query_org_code'">
                    <getCorpStore @getCorpStore="getCorpStore" :values="corpCodeArr" :Index="index" :widths="'160px'"/>
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                </span>
                <!-- 门店选择 10-->
                <span v-else-if="item.type=='query_store_code'">
                    <Select :SelecttemData="storeDatas"  :arguName="index" :values="Names[index][item['name']]" :SelecttemDetail="['sCode','sShortName']" @sonSelectobj="upSelectquery_store_code" :widths="'160px'"/>
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                </span>
                <!-- 岗位选择 11-->
                <span v-else-if="item.type=='select_job'">
                    <Select :SelecttemData="select_job"  :arguName="index" :values="Names[index][item['name']]" :SelecttemDetail="['id','statName']" @sonSelectobj="upSelectselect_job" :widths="'160px'"/>
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                </span>
                <!-- 职位选择 12-->
                <span v-else-if="item.type=='select_position'">
                    <Select :SelecttemData="select_position"  :arguName="index" :values="Names[index][item['name']]" :SelecttemDetail="['id','pstName']" @sonSelectobj="upSelectselect_position" :widths="'160px'"/>
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                </span>
                <!-- 岗位/职位选择 -->
                <span v-else-if="item.type=='select_jobposition'">
                    <Position  @IndexPostPosition="upPostPosition" :Index="index"/>
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                </span>
                
                <!-- 多行文本输入 13-->
                <span v-else-if="item.type=='areatext'">
                    <!-- <TakeTimePiker :arguName="index" @clickTakeTimePiker="upDatePiker"/> -->
                    <Textarea :arguName="index" @sonTextarea="upSelect"/>
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                </span>
                <!-- 输入框 1-->
                <span v-else="item.type=='input'">
                    <Input :value="Names[index][item['name']]" :arguName="index" @sonInput="upInput" />
                    <i v-show="!Names[index][item['name']]&&bixu">必填</i>
                </span>
            </li>
        </ul>
        <div class="footer">
            <Button Name="取消" @click.native="cancle" buttonClass="None"/>
            <Button Name="提交" @click.native="commit"/>
        </div>
    </div>
</div>
</template>
<script>
    import Input from "../../../common/Input";
    import Select from "../../../common/Select";
    import DatePicker from "../../../common/DatePiker";
    import TimePicker from "../../../common/TimePicker";
    import TakeTimePiker from "../../../common/TakeTimePiker";
    import getCorpStore from "../../../common/getCorpStore";
    import AboutPeople from "../../../common/AboutPeople";
    import AboutBranch from "../../../common/AboutBranch";
    import Textarea from "../../../common/Textarea";
    import Button from "../../../common/Button"
    import Position from "../../../common/Position"
    export default{
        components: {
            Input,Select,DatePicker,TimePicker,TakeTimePiker,getCorpStore,AboutBranch,Textarea,Button,AboutPeople,Position  
        },
        data(){
            return{
                bixu:false,
                corpCodeArr:[],
                active:false,
                itemName:"",//流程名称
                ApproveDetail:false,
                Id:"",
                datas:[],
                startApprovedatas:"",
                datass:{
                    name:"<p>11111</p>"
                },
                PeopleName:"",//员工名称
                PeopleUserName:"",//员工名称
                sShortName:"",//门店名称
                cName:"",//部门名称
                select_orgtype:[],//机构类型
                select_sex:[],//性别选择
                select_is:[],//是否选择
                select_job:[],//岗位选择
                select_position:[],//职位选择
                Radio:true,//表示单选用户
                PeopleShow:false,//员工显示模块
                BranchShow:false,//部门显示模块
                PeopleShowUser:false,//用户选择
                StoreShow:false,//门店显示模块
                date:[],
                Names:[],//传的对象
                storeDatas:[],
            }
        },
        methods:{
            upPostPosition(e,index){
                console.log(e)
                console.log(index)
                let item=this.startApprovedatas[index].name;
                if(e.length>0){
                    this.Names[index][item]=e[0].id+"/"+e[1].id;
                    this.Names[index]['name']=e[0].name+"/"+e[1].name;
                }else{
                    this.Names[index][item]="";
                    this.Names[index]['name']="";
                }
            },
            canclefun(){
                this.PeopleShowUser=false;
                this.PeopleShow=false;
            },
            // 选中机构类型
            upSelectselect_orgtype(obj,value,index){
                console.log(obj);
                let item=this.startApprovedatas[index].name;
                this.Names[index][item]=value;
                this.Names[index]['name']=obj.dKeyname;
                console.log(this.Names[index])
            },
            // 选择门店
            upSelectquery_store_code(obj,value,index){
                console.log(obj);
                console.log(value);
                let item=this.startApprovedatas[index].name;
                this.Names[index][item]=value;
                this.Names[index]['name']=obj.sShortName;
                console.log(this.Names[index])
            },
            // 选择岗位
            upSelectselect_job(obj,value,index){
                console.log(obj);
                console.log(value);
                let item=this.startApprovedatas[index].name;
                this.Names[index][item]=value;
                this.Names[index]['name']=obj.statName;
                console.log(this.Names[index])
            },
            // 选择职位
            upSelectselect_position(obj,value,index){
                console.log(obj);
                console.log(value);
                let item=this.startApprovedatas[index].name;
                this.Names[index][item]=value;
                this.Names[index]['name']=obj.pstName;
                console.log(this.Names[index])
            },
            
            // 显示部门选择模块
            showStore(){
                this.StoreShow=!this.StoreShow;
            },
            // 显示部门选择模块
            showBranch(){
                this.BranchShow=!this.BranchShow;
            },
            // 选择部门
            AboutBranchSelected(modle,index){
                console.log(modle)
                console.log(index)
                let item=this.startApprovedatas[index].name;
                this.Names[index][item]=modle.cCode;
                this.cName=modle.cName;
                console.log(this.Names)
                this.showBranch();
            },
            getCorpStore(value,index,cName){
                console.log(value)
                console.log(index)
                console.log(cName)
                if(value){
                    let item=this.startApprovedatas[index].name;
                    this.Names[index][item]=value[value.length-1];
                    this.Names[index]['name']=cName;
                    this.startApprovedatas.map((el,i)=>{
                        if(el.type=="query_store_code"){
                            let item=this.startApprovedatas[i].name;
                            this.Names[i][item]="";
                        }
                    });
                    this.getStore(value[value.length-1])
                }
            },
            getStore(value){
                let data={
                    pageNumber:1,
                    pageSize:1000,
                    corpCode:value||this.$getCookie("dept")||"",
                    queryType:0,
                }
                this.$post(this.$host+"/api/store/store/allnamecode",data).then(d=>{
                    if(d.success){
                        let content=d.data.content.map(e=>{
                            e.active=false;
                            return e;
                        })
                        this.storeDatas=content;
                    }
                });
            },
            // 显示用户user选择模块
            showPeopleUser(){
                this.PeopleShowUser=!this.PeopleShowUser;
            },
            // 选择用户
            AboutPeopelSelectedUser(modle,index){
                console.log(modle.id);
                console.log(index);
                let item=this.startApprovedatas[index].name;
                this.Names[index][item]=modle.id;
                this.Names[index]['name']=modle.empName;
                this.PeopleUserName=modle.empName;
                this.showPeopleUser();
            },
            // 显示用户选择模块
            showPeople(){
                this.PeopleShow=!this.PeopleShow;
            },
            // 选择用户员工emp_id
            AboutPeopelSelected(modle,index){
                console.log(modle);
                console.log(index);
                let item=this.startApprovedatas[index].name;
                this.Names[index][item]=modle.id;
                this.Names[index]['name']=modle.empName;
                this.PeopleName=modle.empName;
                console.log(this.Names);
                this.showPeople();
            },
            upDatePiker(value,index){
                let item=this.startApprovedatas[index].name;
                this.Names[index][item]=value;
                console.log(value)
            },
            upSelect(value,index){
                let item=this.startApprovedatas[index].name;
                this.Names[index][item]=value;
                console.log(value)
                console.log(this.Names)
            },
            upInput(value,index){
                let item=this.startApprovedatas[index].name;
                this.Names[index][item]=value;
            },
            commit(){
                this.bixu=false;
                this.Names.map(el=>{
                    if(!el.value){
                        this.bixu=true;
                        this.$message({
                            type:"info",
                            message:"请完善必填项"
                        });
                    }
                })
                if(this.bixu){
                    return;
                }
                let data={
                    dynaFormId:this.Id,//表单id
                    jsonList:this.Names
                }
                this.$post(this.$host+"/api/sysmgr/formDataInfo/startFlow",data).then(d=>{
                    if(d.success){
                        this.bixu=false;
                        this.$message({
                            type:"success",
                            message:"提交成功",
                            duration:"800",
                            onClose:this.cancle()
                        })
                        
                    }
                })
            },
            cancle(){
                this.ApproveDetail=false;
            },
            selectChange(){
                console.log(
                    this.Names
                )
            },
            //发起对应流程的审批详情
            startApprove(item){
                this.datas.map(el=>{
                    el.active=false;
                });
                item.active=true;
                let id=item.id;
                this.itemName=item.flowName;
                this.Id=id;
                this.startApprovedatas="";
                this.$post(this.$host+"/api/sysmgr/dynamicForm/getOne/"+id,{}).then(d=>{
                    if(d.success){
                        this.valuesTimePicker="";
                        this.PeopleUserName="";
                        this.PeopleName="";
                        this.corpCodeArr=[];
                        this.startApprovedatas=d.data.jsonList;
                        this.Names=[];
                        let canShow=true;
                        this.startApprovedatas.map((v,i)=>{
                            if(v.type=="refund_page "){//是退款流程，去退款
                                this.$router.push({
                                    path:"/NavDetail/refund/addRefund?type=_add"
                                });
                                canShow=false;
                            }
                        })
                        if(canShow){
                            this.startApprovedatas.map((v,i)=>{
                                let fildNameobj=new Object();
                                let fildName=v.name;
                                fildNameobj[fildName]="";
                                fildNameobj.label=v.label;
                                fildNameobj.type=v.type;
                                fildNameobj.data=v.data;
                                this.Names.push(fildNameobj);
                                switch(v.type){
                                    case "select_sex"://性别选择
                                                    this.$post(this.$host+"/api/sysmgr/dict/getCSPCDict/"+v.data,{}).then(d=>{
                                                        if(d.success){
                                                            this.select_sex=d.data;
                                                        }
                                                    });
                                                    break;
                                    case "select_is"://是否选择
                                                    this.$post(this.$host+"/api/sysmgr/dict/getCSPCDict/"+v.data,{}).then(d=>{
                                                        if(d.success){
                                                            this.select_is=d.data;
                                                        }
                                                    });
                                                    break;
                                    case "select_orgtype"://机构类型选择
                                                    this.$post(this.$host+"/api/sysmgr/dict/getCSPCDict/"+v.data,{}).then(d=>{
                                                        if(d.success){
                                                            this.select_orgtype=d.data;
                                                        }
                                                    });
                                                    break;
                                    case "select_job"://岗位选择
                                                    this.$post(this.$host+"/api/store/empstat/idnameall",{}).then(d=>{
                                                        if(d.success){
                                                            this.select_job=d.list;
                                                        }
                                                    });
                                                    break;  
                                    case "select_position"://职位选择
                                                    this.$post(this.$host+"/api/store/emppost/idNameQueryAll",{}).then(d=>{
                                                        if(d.success){
                                                            this.select_position=d.list;
                                                        }
                                                    });
                                                    break;
                                    case "query_org_code"://门店 
                                    case "query_store_code":
                                                    this.getStore();                       
                                }
                            });
                            this.ApproveDetail=true;
                        }
                        
                    }
                })
            }
        },
        mounted () {
            //获取审批列表
            let data={
                status:1,
            };
            this.$post(this.$host+"/api/sysmgr/flowConfig/list",data).then(d=>{
                 if(d.success){
                    let content=d.data;
                    content.map(el=>{
                        el.active=false;
                    });
                    this.datas=content;
                 }
            })
        }
    }
</script>
<style scoped>
    .ApproveStartS{
    }
    .ApproveStart{
        float:left;
    }
   .ApproveStart>li{
        width: 200px;
        height: 40px;
        background: #DCDFE6;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        color: #5d717c;
        margin-bottom: 24px;
        cursor: pointer;
    }
    .ApproveStart>li:hover,
    .ApproveStart>li.active{
        color: #fff;
        background: #2CBCC8;
    }
    .ApproveStart>li:last-child{
        border-bottom: solid 1px rgba(204, 204, 204, 0.8);;
    }
    .ApproveStart ul li{
        float: left;
        font-size: 1.166667rem;
        padding: .416667rem .833333rem;
        text-align: center;
        color: #666666;
    }
    .ApproveStart ul li img{
        display: block;
        width: 9.333333rem;
    }
    .ApproveStart ul li:hover{
        background: #cbe6f6;
    }
    .addContact {
        padding-left: 225px;
    }
    .addContact>header{
        font-size: 2rem;
    text-align: center;
    color: #386b88;
    padding-bottom: 2rem;
    }
    .Tbodys{
        border-radius: .666667rem;
    }
    .Tbodys > li:first-child {
    border-top: 1px solid #efefef;
}
    .Tbodys>li{
        margin: 0 auto;
    border: 1px solid #efefef;
    border-top: none;
    background: #fafafa;
}
.Tbodys > li > span {
    padding: 7px 0;
    padding-left: 12px;
    min-height: 40px;
    background: #fff;
    width: 85%;
    display: inline-block;
    border-left: 1px solid #efefef;
}
.Tbodys > li > span.left {
    padding-left: 0;
    width: 15%;
    text-align: right;
    background: #fafafa;
    margin-left: 0;
    border-left: none;
}
.footer{
    margin-top: 2.5rem;
    padding-left: 16rem;
}
button{
        margin-left: 24px;
    }
    .Textarea{
        padding:12px 0;
    }
</style>