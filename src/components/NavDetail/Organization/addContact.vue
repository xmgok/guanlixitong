<template>
    <div class="BG" :style="{minHeight:isHeight}" ref="p">
        <div class="addContact" >
            <ul class="Tbody">
                <li v-if="cParentCodeSHOW">
                    <span class="left"><i class="waring icon"></i>上级部门：</span>
                    <span>
                        <getCorpStore @getCorpStore="getCorpStore" :values="corpCodeArr" :CorpDatas="list" :placeholder="'请选择'"  :disabled="readonlys"/>
                        <i  class="pleft" v-if="!readonlys">{{cParentCodewaring}}</i>
                    </span>
                </li>
                <li>
                    <span class="left"><i class="waring icon" ></i>部门编号：</span>
                    <span>
                        <!-- 只能输入数字，长度3 -->
                        <i v-show="datas.cParentCode!=0">{{datas.cParentCode+" - "}}</i>
                        <Input :value="datas.cCode" arguName="cCode" @sonInput="upInput" :blur="blur" :focus="focus" :widths="'120px'" :onkeyup="onkeyup" maxlength="3" :readonlys="readonlys" v-show="!readonlys"/>
                        {{datas.cCode}}
                        <i :class="{warings:cCodeShow}" v-if="!readonlys" v-show="cPCodeShow" class="pleft">{{cCodewaring}}</i>
                    </span>
                </li>
                <li>
                    <span class="left"><i class="waring icon"></i>部门名称：</span>
                    <span>
                        <!-- 汉字和字母 -->
                        <Input :value="datas.cName" arguName="cName" @sonInput="upInput" maxlength="15" :blur="blurcName" :focus="focuscName" />
                        <i :class="{warings:cNameShow}" class="pleft">{{cNamewaring}}</i>
                    </span>
                </li>
                <li>
                    <span class="left">联系人：</span>
                    <span>
                            <!-- onkeyup="this.value=this.value.replace(/[^\u4E00-\u9FA5|A-Za-z]/g,'')" -->
                        <Input :value="datas.cLinkman" arguName="cLinkman" @sonInput="upInput" maxlength="15" />
                    </span>
                </li>
                <li>
                    <span class="left">联系电话：</span>
                    <span>
                        <Input :value="datas.cLinkTel" arguName="cLinkTel" @sonInput="upInput"  :onkeyup="onkeyup" maxlength="11"/>
                    </span>
                </li>
                <li>
                    <span class="left">微信号：</span>
                    <span>
                        <Input :value="datas.cWechat" arguName="cWechat" @sonInput="upInput" />
                    </span>
                </li>
                
                <li>
                    <span class="left"><i class="waring icon"></i>机构类型：</span>
                    <span>
                        <Select :SelecttemData="SelecttemData" :values="datas.cOrgType" arguName="cOrgType" :SelecttemDetail="['key','value']" @sonSelect="upSelect" />
                        <i :class="{warings:cOrgTypeShow}" class="pleft" v-show="cOrgTypeShow">必填</i>
                    </span>
                </li>
                <li>
                    <span class="left"><i class="waring icon"></i>可含门店：</span>
                    <span>
                        <Select :SelecttemData="SelecttemDataStore" :values="datas.isMgnStore" arguName="isMgnStore" :SelecttemDetail="['key','value']" @sonSelect="upSelect" />
                        <i :class="{warings:isMgnStoreShow}" class="pleft" v-show="isMgnStoreShow">必填</i>
                    </span>
                </li>
                <li class="clearfix">
                    <span class="left">LOGO：</span>
                    <div class="left righttag">
                        <!-- <div class="imgurl">
                            <img :src="imgurl" alt="">
                        </div> -->
                        <!-- <upload @sonInput='uploadimg' :arguName="imgurl"/> -->
                        <upload :url='imgurl'  @sonInput='uploadimg'   imgType="logo"/>
                    </div>
                </li>
            </ul>
            <div class="footer">
                <Button Name="取消" @click.native="cancle" buttonClass="None"/>
                <Button Name="提交" @click.native="commit" />
            </div>
        </div>
    </div>

</template>
<script>
import { mapMutations,mapState } from "vuex";
import Input from "../../common/Input";
import Button from "../../common/Button";
import upload from "../../common/upload";
import Select from "../../common/Select";
import getCorpStore from "../../common/getCorpStore"
export default {
    components: {
        Input, Button, Select ,getCorpStore ,upload
    },
    data() {
        return {
            imgurl:"",
            cPCodeShow:true,
            cParentCodewaring:"不填则默认为顶级部门",
            cCodewaring:"以上级部门编号开头，只能输入3位数字",
            cNamewaring:"",
            readonlys:false,
            corpCodeArr:[],
            isHeight:"100%",
            showMtk:false,
            SelectActive:false,
            AboutBranchClass:false,
            Cliked: false,
            showBranch: false,
            widths: "180px",
            cParentName: "",
            cCodeShow: false,
            cNameShow: false,
            cLinkmanShow: false,
            cLinkTelShow: false,
            cParentCodeShow: false,
            cParentCodeSHOW:true,
            cOrgTypeShow: false,
            isMgnStoreShow: false,
            SelecttemData: [
                { value: "公司", key: 1 },
                { value: "区域", key: 2 },
                { value: "部门", key: 3 }
            ],
            SelecttemDataStore: [
                { value: "是", key: 1 },
                { value: "否", key: 0 },
            ],
            datas: {
                cCode: "",
                cName: "",
                cShortName: "",
                cAddr: "",
                cLinkman: "",
                cLinkTel: "",
                cWechat: "",
                cParentCode:0,
                cOrgType: 3,
                cCoor: "",
                cLogo: "",
                isMgnStore: 0,
                cDelFlag: 0
            },
            list:[],
        }
    },
    computed: {
        ...mapState(["corpsvuex"]),
    },
    methods: {
        ...mapMutations(["setDatas"]),
        uploadimg(value,arguName){
            this.imgurl=value;
        },
        upSelect(value, arguName) {
            this.datas[arguName] = value;
            if(value===""){
                this[arguName+"Show"]=true;

            }else{
                this[arguName+"Show"]=false;
            }
        },
        //选择上级机构
        getCorpStore(item){
            if(item.length==0){
                this.datas.cParentCode =0;
                this.cParentCodeShow=true;
                // this.cParentCodewaring="必填";
            }else{
                this.datas.cParentCode = item[item.length-1];
                this.cParentCodeShow=false;
                // this.cParentCodewaring="";
            }
        },
        cancle() {
            this.$router.push({
                path: "/NavDetail/Organization"
            })
        },
        onkeyup(value){
            value.target.value=value.target.value.replace(/\D/g,'')
        },
        upInput(value, arguName) {
            this.datas[arguName] = value;
            if(arguName=='cCode'){
                let reg=/^\d+$/g;
                if(!reg.test(value)){
                    this.datas[arguName] = "";
                }
            }
        },
        blur(){
            if(this.datas.cCode.length!=3){
                this.cCodeShow = true;
                this.cCodewaring="长度应为3个数字字符";
            }
        },
        focus(){
            this.cCodeShow = false;
            this.cCodewaring="以上级部门编号开头，只能输入3位数字";
        },
        focuscName(){
            this.cNameShow = false;
            this.cNamewaring="";
        },
        blurcName(){
            if(this.datas.cName==""){
                this.cNameShow = true;
                this.cNamewaring="必填";
            }
        },
        ...mapMutations(["ReminderShowFunc"]),
        filechange(e) {
            let that = this;
            for (var i = 0; i < e.target.files.length; i++) {
                var file = e.target.files.item(i);
                if (file.size > 1024 * 1024 * 0.5) {
                    alert("图片大小不能超过 500kb!");
                    return;
                }
                var freader = new FileReader();
                freader.readAsDataURL(file);
                freader.onload = function (e) {
                    var src = e.target.result;
                    that.datas.cLogo = src;
                }
            }
        },
        digui(data,cCode){
                data.map(el=>{
                    if(el.cCode==cCode){
                        if(el.cParentCode==0){
                            return;
                        }
                        this.corpCodeArr.unshift(el.cParentCode);
                        this.gui(el.cParentCode);
                    }
                    if(el.childsCorpDTO){
                        this.digui(el.childsCorpDTO,cCode)
                    }
                })
            },
        gui(cCode){
            this.list.map(el=>{
                if(el.cCode==cCode){
                    if(el.cParentCode==0){
                        return;
                    }
                    this.corpCodeArr.unshift(el.cParentCode);
                }
                // el.childsCorpDTO&&this.digui(el.childsCorpDTO,cCode)
                if(el.childsCorpDTO){
                    this.digui(el.childsCorpDTO,cCode)
                }
            })
        },
        commit() {
            let update = this.$route.query.update || "";
            let CanNot = true;//能提交
            if(this.datas.cCode.length!=3&&this.datas.cParentCode!=0){
                this.cCodeShow = true;
                this.cCodewaring="长度应为3个数字字符";
                CanNot = false;
                return;
            }
            if(!this.$checkMobile(this.datas.cLinkTel)){
                if(this.datas.cLinkTel!=""){
                    CanNot = false;
                    return;
                }
            };
            if (this.datas.cName == "") {//商户名称为空时
                this.cNameShow = true;
                this.cNamewaring="必填";
                CanNot = false;
                return;
            }
            if (this.datas.cOrgType == "") {//机构类型为空时
                this.cOrgTypeShow = true;
                CanNot = false;
                return;
            }
            if (this.datas.isMgnStore === "") {//可含门店为空时
                this.isMgnStoreShow = true;
                CanNot = false;
                return;
            }
            if (!CanNot) {//不能提交
                return;
            }
            let data = {
                accessToken: this.$getCookie("accessToken"),
                "cAddr": this.datas.cAddr,
                "cCode": (this.datas.cParentCode==0?"":this.datas.cParentCode)+this.datas.cCode,
                "cCoor": this.datas.cCoor,
                "cLinkTel": this.datas.cLinkTel,
                "cLinkman": this.datas.cLinkman,
                "cLogo": this.imgurl,
                "cName": this.datas.cName,
                "cOrgType": parseInt(this.datas.cOrgType),
                "cParentCode": this.datas.cParentCode,
                "cShortName": this.datas.cShortName,
                "cWechat": this.datas.cWechat,
                "isMgnStore": parseInt(this.datas.isMgnStore)
            }
            if (update == "update") {
                data.id = this.$route.query.id;
                this.$post(this.$host+"/api/sysmgr/ccorp/update", data).then((d) => {
                    if (d.success) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!',
                            duration:"800",
                            onClose:()=>{
                                this.$router.push({
                                    path:"/NavDetail/Organization"
                                })
                            }
                        });
                    } 
                });
            }else{
                this.$post(this.$host+"/api/sysmgr/ccorp/add", data).then((d) => {
                    if (d.success) {
                        this.$message({
                            type: 'success',
                            message: '添加成功!',
                            duration:"800",
                            onClose:()=>{
                                this.$router.push({
                                    path:"/NavDetail/Organization"
                                })
                            }
                        });
                    } else {
                        // this.ReminderShowFunc(d.respMsg);
                    }
                })
            }
            
        },
    },
    mounted() {
        this.isHeight=(document.documentElement.clientHeight-this.$refs.p.offsetTop)+"px";
        let update = this.$route.query.update || "";
        if (update == "update") {
            this.readonlys=true;
            let id = this.$route.query.id;
            this.$post(this.$host+"/api/sysmgr/ccorp/getOne/" + id, { accessToken: this.$getCookie("accessToken") }).then(d => {
                if (d.success) {
                    this.datas = d.data;
                    this.imgurl=d.data.cLogo;
                    if(d.data.cParentCode==0){
                        this.cParentCodeSHOW=false;
                        this.cPCodeShow=false;
                    }else{
                        this.datas.cCode=this.datas.cCode.slice((this.datas.cCode.length-3),this.datas.length);
                    }
                    let that = this;
                    if(!this.corpsvuex){
                        this.$post(this.$host+"/api/sysmgr/ccorp/findAll", {}).then((data) => {
                            if (data.success) {
                                this.corpCodeArr=[that.datas.cParentCode];
                                this.list=data.data;
                                this.gui(that.datas.cParentCode);
                                this.setDatas({name:"corpsvuex",value:this.list})
                                console.log(this.corpCodeArr)
                            }
                        })
                    }else{
                        this.corpCodeArr=[that.datas.cParentCode];
                        this.list=this.corpsvuex;
                        this.gui(that.datas.cParentCode);
                    }
                    
                }
            })
        }else{
            if(!this.corpsvuex){
                this.$post(this.$host+"/api/sysmgr/ccorp/findAll", {}).then((data) => {
                    if (data.success) {
                        this.list=data.data;
                        console.log(this.list)
                        this.setDatas({name:"corpsvuex",value:this.list})
                    }
                })
            }else{
                this.list=this.corpsvuex;
            }
            
        }
    }
}
</script>
<style scoped>
    .righttag{
    padding: 12px 0;
    padding-left: 15px;
    min-height: 40px;
    width: 85%;
    background: #fff;
    border-left: 1px solid #efefef;
}
.righttag .imgurl{
    width: 60px;
    height: 60px;
    border: 1px solid #efefef;
    margin-bottom: 12px;
}
.righttag .imgurl img{
    width: 100%;
}
    .curor{
        cursor: pointer;
    }
    .SelectActive{
        border: 1px solid #82a9bf;
    }
.waring::before {
  content: "\e69b";
  color: #FF5500;
}
.warings.pleft{
    color: #FF5500;
}
.pleft{
    padding-left: 1rem;
    color:#999;
}
.AboutBranch {
  position: absolute;
  left: 0%;
  top: 2.333333rem;
  z-index: 1000;
  background: #fff;
}
.MTK{
        position:absolute;
        z-index:999;
        background:transparent;
        width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    }
.BG .StoreSelect {
  position: absolute;
  right:14px;
  top: .333333rem;
  width: 8px;
  height: 8px;
  border-right: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  transform: rotate(45deg);
  cursor: pointer;
  transition: all 0.2s linear;
  transform-origin: 75% 75%;
}
.BG .StoreSelect.Cliked {
  transform: rotate(-135deg);
}
select {
  width: 15rem;
  height: 2.5rem;
  border-radius: 0.333333rem;
  border: solid 1px #ccc;
  padding: 0 0.666667rem;
  font-size: 1.166667rem !important;
  color: #444;
}
.BG {
  background: #fff;
}
.Tbody {
}

.footer {
    padding-top: 40px;
    text-align: left;
    padding-left: 14rem;
}
.addContact {
}
.addContact > div {
}
.header {
  font-size: 2rem;
  text-align: center;
  color: #386b88;
  padding: 2rem 0;
}
.Logo {
  width: 100px;
  height: 50px;
}
input.file {
  width: 80px;
}

button {
  margin-left: 24px;
}
button:hover {
  background: #e6e6e6;
}
</style>