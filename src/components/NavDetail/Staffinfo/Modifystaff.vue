<template>
    <div class="ModSta">
         <ul class="ModStaForm">
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>工号：</div>
                <div class="ModStaInput">
                    <span>{{workNo}}</span>
                    <!-- <Input :placeholder="workNo" widths="13.333333rem" arguName="workNo" @sonInput="upInput" :maxlength='8' :readonlys="true" :focus="workNofocus" :blur="workNoblur"/> -->
                    <i class="pleft" v-show="workNoDisplay">工号由长度为8位的数字字母组合</i>   
                    <i class="error" v-show="workNoShow">必填</i> 
                </div>
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>姓名：</div>
                <div class="ModStaInput">
                    <Input :value="empName" widths="13.333333rem" arguName="empName" @sonInput="upInput" :maxlength='8' :blur="empNameblur"/>
                    <i class="error" v-show="empNameShow">必填</i>
                    <i class="error" v-show="empNameDisplay">姓名不能有特殊字符</i>
                </div>    
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>岗位/职位：</div>
                <div class="ModStaInput">
                    <Position :PostPosition="PostPosition" :arguName="['jobs','position']" @sonPostPosition="sonPostPosition"/>
                    <i class="error" v-show="positionShow">必填</i>
                </div>
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>身份证号：</div>
                <div class="ModStaInput">
                    <Input :value="cardNo" widths="13.333333rem" arguName="cardNo" @sonInput="upInput" :maxlength='18' :blur="cardNoblur"/>
                    <i class="error" v-show="cardNoShow">必填</i>
                    <i class="error" v-show="cardNoDisplay">身份证输入不合法！</i>
                </div>
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>手机号：</div>
                <div class="ModStaInput">
                    <Input :value="empTel" widths="13.333333rem" arguName="empTel" @sonInput="upInput" :maxlength='11' :blur="empTelblur"/>
                    <i class="error" v-show="empTelShow">必填</i>
                    <i class="error" v-show="empTelDisplay">手机号码格式错误！</i>
                </div>
            </li>
            <li class="AddModDatas">
                <div class="Add_mod">性别：</div>
                <div class="ModStaInput">
                    <Select :SelecttemData="Sex" arguName="gender" :values="gender" :SelecttemDetail="['value','key']" @sonSelect="sonSelect" widths="120px"/>
                    <i class="error" v-show="genderShow">必填</i>
                </div>
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod">生日：</div>
                <div class="ModStaInput">
                    <el-date-picker v-model="birthday" type="date"  value-format="yyyy-MM-dd"  :picker-options="birthdayOptions"></el-date-picker>                    
                </div>
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>入职日期：</div>
                <div class="ModStaInput">
                    <el-date-picker v-model="abordDate" type="date" size="mini" value-format="yyyy-MM-dd"></el-date-picker>
                    <i class="error" v-show="abordDateShow">必填</i>
                </div>
            </li>
            <li class="AddModDatas">
                <!-- <div class="Add_mod"><i class="icon waring"></i>所属部门：</div> -->
                <div class="Add_mod">所属部门：</div>
                <div class="ModStaInput">
                    <getCorpStore @getCorpStore="getCorpStore" :values="corpCodeArr"/>
                    <!-- <i class="error" v-show="deptShow">必填</i>      -->
                </div>               
            </li>
            <li class="AddModDatas">
                <div class="Add_mod">所属门店：</div>
                <div class="ModStaInput">
                    <Select :SelecttemData="storeDatas" :values="belongShop" arguName="belongShop" :SelecttemDetail="['sCode','sShortName']" @sonSelect="sonSelect"  widths="160px"/>
                    <!-- <i class="error" v-show="belongShopShow">必填</i> -->
                </div>
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>状态：</div>
                <div class="ModStaInput">
                    <Select :SelecttemData="allstatus" :values="status" arguName="status" :SelecttemDetail="['eStuCode','eStuValue']" @sonSelect="sonSelect"  widths="120px"/>
                    <i class="error" v-show="statusShow">必填</i> 
                </div>     
            </li>
            <!-- <li class="AddModDatas">
                <div class="Add_mod">预设角色：</div>
                <div class="ModStaInput">
                    <el-select v-model="roleIds" multiple size="mini" placeholder="请选择" style="width:160px">
                        <el-option v-for="item in Rcontent" :key="item.id" :label="item.rName" :value="item.id"> </el-option>
                    </el-select>
                </div> 
            </li> -->
        </ul>
        <div class="AddModBtn">
            <Button Name="取消"  class="None" @click.native="cancel"/>                
            <Button Name="保存" @click.native="save"/>
        </div>
    </div>
</template>

<script>
import Input from "../../common/Input";
import Button from "../../common/Button";
import Select from "../../common/Select";
import Position from "../../common/Position"
import getCorpStore from '../../common/getCorpStore'
import {mapState,mapMutations} from 'vuex'
export default {
  components: {Input,Button,Select,Position,getCorpStore},
    data(){
        return{
            PostPosition:[],
            workNo: "",
            empName: "",
            jobs: "",//职位id
            jName:"",//职位
            position:"",//岗位id
            statName:"",//岗位
            SelecttemData: [], // 查询职位            
            alljobs:[],//岗位
            allstatus: [],//状态
            Sex:[
            {key:"女",value:0},
            {key:"男",value:1},
            ],
            cardNo: "",
            empTel:'',   
            gender: "",                        
            storeDatas:[],
            birthday: "",
            birthdayOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },          
            abordDate: "",
            corpCodeArr:[],
            dept:"",
            belongShop: "",
            status: "",
            Rcontent:[],
            roleIds:[],
            workNoShow:false,
            workNoDisplay:false,
            empTelShow:false,
            empTelDisplay:false,
            empNameShow:false,
            empNameDisplay:false,
            positionShow:false,
            cardNoShow:false,
            cardNoDisplay:false,
            genderShow:false,
            abordDateShow:false,
            deptShow:false,            
            // belongShopShow:false,
            statusShow:false,
        }
    },
    watch:{
        abordDate(val){
            if(!val){
                this.abordDateShow = true
            }else{
                this.abordDateShow = false
            }
        }
    },
    computed:{
        ...mapState(['corpsvuex','storesvuex','allstatusvuex','employee','employeetotal'])
    },
    mounted() {
        this.getStore()        
        //查询全部状态
        this.getAllstatus()
        this.$post(this.$host+"/api/store/employee/query", {id:this.$route.query.id}).then(d => {
            if (d.success) {
                    this.workNo=d.workNo
                    this.empName=d.empName
                    this.statName=d.statName

                    this.jobs= d.jobs;
                    this.position=d.position                    
                    this.PostPosition.push(parseInt(d.jobs));
                    this.PostPosition.push(parseInt(d.position));
                    this.cardNo = d.cardNo
                    this.empTel = d.empTel                                          
                    this.gender = d.gender
                    this.abordDate= d.abordDate
                    this.birthday =d.birthday;
                    let dept=d.dept
                    this.recursive(dept)
                    this.corpCodeArr.push(dept);
                    this.dept= dept
                    this.belongShop= d.belongShop
                    this.status= d.status
                    
                    this.roleIds= d.roles
            }
        });
    },
    methods:{
        recursive(code){
            this.corpsvuex.map(e=>{
                if(e.cCode==code){
                    if(e.cParentCode==0)return
                    this.corpCodeArr.unshift(e.cParentCode)
                }
                e.childsCorpDTO&&this.recursion(e.childsCorpDTO,code)
            })
        },
        recursion(arr,code){
            arr.map(e=>{
                if(e.cCode==code){
                    if(e.cParentCode==0)return
                    this.corpCodeArr.unshift(e.cParentCode)
                    this.recursive(e.cParentCode)
                }
                e.childsCorpDTO&&this.recursion(e.childsCorpDTO,code)
            })
        },
        ...mapMutations(['setDatas']),
        //员工状态
        getAllstatus(){
            if(!this.allstatusvuex){
                this.$post(this.$host + "/api/store/employee/allstatus", {}).then(d => {
                    if (d.success) {
                        this.allstatus = d.data;
                        this.setDatas({name:'allstatusvuex',value:this.allstatus})
                    }
                });
            }else{
                this.allstatus = this.allstatusvuex
            }
        },
        workNofocus(){
            if(!this.workNo){
                this.workNoDisplay = true
                this.workNoShow = false
            }
        },
        workNoblur(){
            if(!this.workNo){
                return this.workNoShow = true , this.workNoDisplay = false
            }
            this.workNoShow = false 
            if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8}$/.test(this.workNo)){
                this.workNoDisplay = true ;this.workNoShow = false
                return
            }
            this.workNoDisplay = false
        },
        empNameblur(){
             if(!this.empName){
                this.empNameShow = true 
                this.empNameDisplay=false
                return 
            }
            this.empNameShow = false
            if(/[@#\$%\^&\*]+/g.test(this.empName)){
                this.empNameDisplay=true
            }else{
                this.empNameDisplay=false
            }
        },
        cardNoblur(){
            if(!this.cardNo){
                this.cardNoShow = true
                this.cardNoDisplay = false                            
                return 
            }
            this.cardNoShow = false
            console.log(this.birthday)
            if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.cardNo)){
                this.cardNoDisplay = true
            }else if(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.cardNo) && this.birthday == null){
               this.birthday = this.cardNo.substring(6,10)+'-'+this.cardNo.substring(10,12)+'-'+this.cardNo.substring(12,14)
               this.cardNoDisplay = false                           
            }
        },
        empTelblur(){
            if(!this.empTel){
                this.empTelDisplay = false
                this.empTelShow = true
                return 
            }
            this.empTelShow = false
            if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.empTel)){
                return this.empTelDisplay = true
            }
            this.empTelDisplay = false  
        },
        // 选择所属部门
        getCorpStore(value) {
            console.log(value)
            if(value.length<1){
                this.deptShow = true
            }else{
                this.deptShow = false                
            }
            if (this.dept != value[value.length-1]) {
                this.dept = value[value.length-1];
                this.belongShop = "";
                this.sShortName = ''
                this.getStore();
            }
        },
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 1000,
                corpCode: this.dept || this.$getCookie("dept") || "",
                queryType:0,
            }
            if(!this.dept){//默认门店（当前部门下的门店）
                if(this.storesvuex){
                    this.storesvuex.map(e=>{
                        e.active=false;
                        return e;
                    })
                    this.storeDatas=this.storesvuex;
                }else{
                    this.$post(this.$host+"/api/store/store/allnamecode",data).then(d=>{
                        if(d.success){
                            let content=d.data.content.map(e=>{
                                e.active=false;
                                return e;
                            })
                            this.storeDatas=content;
                            this.setDatas({name:"storesvuex",value:this.storeDatas})
                        }
                    });
                }
            }else{
                this.$post(this.$host+"/api/store/store/allnamecode",data).then(d=>{
                    if(d.success){
                        let content=d.data.content.map(e=>{
                            e.active=false;
                            return e;
                        })
                        this.storeDatas=content;
                    }
                });
            }
        },
        upInput(value, arguName) {
            this[arguName] = value;
        },
        sonSelect(value, arguName) {
            this[arguName] = value;
            if(value===""){
                this[arguName+"Show"]=true;
            }else{
                this[arguName+"Show"]=false;
            }
            console.log(arguName,value)
        },
        sonPostPosition(value,arguName0,arguName1){
            this[arguName0]=value[0]
            this[arguName1]=value[1]
            if(value.length<1){
                this.positionShow = true
            }else{
                this.positionShow = false
            }
        },
        save(){
            let CanNot = true;//能提交
            if(this.workNo == ""){
                    this.workNoShow = true
                    CanNot = false
            }
            if(this.workNoDisplay){
                    CanNot = false                
            }
            if(this.empName == ""){
                    this.empNameShow = true
                    CanNot = false
            }
            if(this.empNameDisplay){
                    CanNot = false
            }
            if(this.position == ""){
                    this.positionShow = true
                    CanNot = false
            }
            if(this.cardNo == ""){
                    this.cardNoShow = true
                    CanNot = false
            }
            if(this.cardNoDisplay){
                    CanNot = false
            }
            if(!this.empTel){
                    this.empTelShow = true
                    CanNot = false
            }
            if(this.empTelDisplay){
                    CanNot = false
            }
            if(this.gender === ""){
                    this.genderShow = true
                    CanNot = false
            }
            if(!this.abordDate){
                    this.abordDateShow = true
                    CanNot = false
            }
            if(this.sCode == ""){
                    this.sCodeShow = true
                    CanNot = false
            }
            // if(!this.dept){
            //         this.deptShow = true
            //         CanNot = false
            // }
            // if(!this.belongShop){
            //         this.belongShopShow = true
            //         CanNot = false
            // }
            if(this.status == ""){
                    this.statusShow = true
                    CanNot = false
            }
            if(!CanNot){
               return;
            }
            let _data = {
                id:this.$route.query.id,
                workNo: this.workNo,
                empName: this.empName,
                jobs: this.jobs,
                position: this.position,                
                cardNo: this.cardNo,
                empTel:this.empTel,
                gender: this.gender,
                birthday: this.birthday,                
                abordDate: this.abordDate,
                dept: this.dept,
                belongShop: this.belongShop,                
                status: this.status,
                // roleIds:this.roleIds,
            };
            if(this.workNo==this.$getCookie('workNo')){
                this.$confirm('此账号为当前登录账号，修改后将退出重新登录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post(this.$host+"/api/store/employee/update",_data).then(d =>{
                        if(d.success){
                            this.$message({
                                type: 'success',
                                message: '操作成功!',
                                duration:"1000",
                                onClose:()=>{
                                    let that = this
                                    this.$logOut(that)
                                }
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改',
                        duration:"1000",
                    });          
                });
            }else{
                this.$post(this.$host+"/api/store/employee/update", _data).then(d => {
                    if (d.success) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!',
                            duration:"1000",
                            onClose:()=>{
                                this.setDatas({ name: "isShopemployee", value: [] })
                                this.setDatas({ name: "isShopemployeetotal", value: "" })
                                this.setDatas({ name: "employee", value: [] })
                                this.setDatas({ name: "employeetotal", value: "" })
                                this.cancel()
                            }
                        })
                    }
                });
            }
        },
        cancel(){
            this.$router.push({ path:"/NavDetail/Staffinfo"}) 
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
.pleft{
    color: #999;
}
.ModStaForm{
    border:1px solid #EFEFEF;
}
.ModSta .AddModDatas {
    border-bottom: 1px solid #EFEFEF;
    display: flex;
}
.ModSta .AddModDatas:last-child{
    border-bottom:none;
}
.ModStaForm .Add_mod{
    width: 20rem;
    background: #FAFAFA;
    padding: 6px 0;
    text-align: right;
    font-size: 1rem;
    color: #666; 
    border-right: 1px solid #EFEFEF;
}
.ModStaInput{
    padding: .5rem 1rem;
}

.ModSta .AddModBtn{
  margin-left: 16rem;
  margin-top: 4rem;
}
.ModSta .AddModBtn button:first-child{
  margin-right:2rem;
}

</style>
