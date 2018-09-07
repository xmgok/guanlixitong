<template>
    <div class="ProductServeAdd" :style="{minHeight:isHeight}" ref="p">
        <div class="ProductServeAddDetail">
            <div class="model tagClass serviceClass" v-show="tagShow">
                <header class="Header clearfix">
                    <div class="left">选择产品标签</div>
                    <div class="right"><i class="icon iconclose" @click="cancle"></i></div>
                </header>
                <div class="tagDetail">
                    <ul class="tagSelected clearfix">
                        <li v-for="(item,index) in tagSelected" @click="cancleSelected(item,index)">{{item.tagName+">"+item.value}}<i class="icon CloseIcon"></i></li>
                    </ul>
                    <div class="clearfix">
                        <div class="left">
                            <ul class="leftUl">
                                <li class="tagSort">标签类别<i></i></li>
                                <ul class="tableShow">
                                    <li v-for="(item,index) in tagDatas" @click="SelectTagSort(item,index)" ><i class="icon checkeddan" :class="{active:item.active}"></i>{{item.tagName}}</li>
                                    <li v-if="tagDatas.length<7" v-for="it in tagDatas.length>7?0:(7-tagDatas.length)"></li>
                                </ul>
                            </ul>
                        </div>
                        <div class="left right">
                            <ul class="leftUl" v-if="tagNewArr.length>0">
                                <li class="tagSort">标签值（{{tagNewArr[0].tagMode==1?"可多选":"单选"}}）<i></i></li>
                                <ul class="tableShow">
                                    <li v-for="(item,index) in tagNewArr" @click="SelectTagValue(item,index)" ><i class="icon" :class="[tagNewArr[0].tagMode==1?'checkedIcon':'checkeddan',item.active?'active':'']"></i>{{item.value}}</li>
                                    <li v-if="tagNewArr.length<7" v-for="it in tagNewArr.length>7?0:(7-tagNewArr.length)"></li>
                                </ul>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="tagFooter" >
                    <Button Name="取消" @click.native="cancle" buttonClass="None"/>
                    <Button Name="确定" @click.native="sureSelected"/>
                </div>
            </div>
            <div class="model serviceClass" v-show="serviceShow" v-if="!detail">
                <header class="Header clearfix">
                    <div class="left">选择适用服务</div>
                    <div class="right"><i class="icon iconclose" @click="cancleserviceProduct"></i></div>
                </header>
                <div class="tagDetail">
                    <ul class="tagSelected serviceSelected clearfix">
                        <li>
                            <ProductTag @sonProductSelect="SelectedProductService" :listdata="CategoryList"/>
                        </li>
                        <li>
                            <Input placeholder="请输入产品名称/编号" :value="codeOrName" arguName="codeOrName" @sonInput="upInput" :readonlys="readonly"/>
                        </li>
                        <li>
                            <Button Name="搜索" @click.native="gotoDetail"/>
                        </li>
                    </ul>
                    <div class="clearfix">
                        <div class="left">
                            <ul class="leftUl">
                                <li class="tagSort">可选单项服务（已选<i>{{SelectedServiceDatas.length}}</i>项）</li>
                                <ul class="tableShow" @scroll="scroll">
                                    <li v-for="(item,index) in canServiceDatas" @click="SelectService(item,index)" ><i class="icon checkedIcon" :class="{active:item.active}"></i>{{item.psName}}</li>
                                    <li v-if="canServiceDatas.length<7" v-for="it in canServiceDatas.length>7?0:(7-canServiceDatas.length)"></li>
                                </ul>
                                
                            </ul>
                            <div class="Bottom">
                                <Button Name="取消" @click.native="cancleserviceProduct" buttonClass="None"/>
                                <Button Name="确定" @click.native="sureSelectedService"/>
                            </div>
                        </div>
                        <div class="left right">
                            <ul class="leftUl" v-if="tagNewArr.length>0">
                                <li class="tagSort">已选单项服务（已选<i>{{SelectedServiceDatas.length}}</i>项）</li>
                                <ul class="tableShow">
                                    <li v-for="(item,index) in SelectedServiceDatas" @click="SelectServiceValue(item,index)" ><i class="icon checkedIcon" :class="{active:item.active}"></i>{{item.psName}}</li>
                                    <li v-if="SelectedServiceDatas.length<7" v-for="it in SelectedServiceDatas.length>7?0:(7-SelectedServiceDatas.length)"></li>
                                </ul>
                                
                            </ul>
                            <div class="Bottom">
                                <Button Name="全选" @click.native="SelectedAll" buttonClass="None"/>
                                <Button Name="移除" @click.native="deleteSelected"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="model serviceClass" v-show="presetserviceShow"  v-if="!detail">
                <header class="Header clearfix">
                    <div class="left">选择适用服务(赠送)</div>
                    <div class="right"><i class="icon iconclose" @click="cancleserviceProduct"></i></div>
                </header>
                <div class="tagDetail">
                    <ul class="tagSelected serviceSelected clearfix">
                        <li>
                            <ProductTag @sonProductSelect="SelectedProductService" :listdata="CategoryList"/>
                        </li>
                        <li>
                            <Input placeholder="请输入产品名称/编号" :value="codeOrName" arguName="codeOrName" @sonInput="upInput" :readonlys="readonly"/>
                        </li>
                        <li>
                            <Button Name="搜索" @click.native="gotoDetail"/>
                        </li>
                    </ul>
                    <div class="clearfix">
                        <div class="left">
                            <ul class="leftUl">
                                <li class="tagSort">可选单项服务（已选<i></i>条）</li>
                                <ul class="tableShow">
                                    <li v-for="(item,index) in presetcanServiceDatas" @click="presetSelectService(item,index)" ><i class="icon checkedIcon" :class="{active:item.active}"></i>{{item.psName}}</li>
                                    <li v-if="presetcanServiceDatas.length<7" v-for="it in presetcanServiceDatas.length>7?0:(7-presetcanServiceDatas.length)"></li>
                                </ul>
                                
                            </ul>
                            <div class="Bottom">
                                <Button Name="取消" @click.native="cancleserviceProduct" buttonClass="None"/>
                                <Button Name="确定" @click.native="presetsureSelectedService"/>
                            </div>
                        </div>
                        <div class="left right">
                            <ul class="leftUl" v-if="tagNewArr.length>0">
                                <li class="tagSort">已选单项服务（已选<i></i>条）</li>
                                <ul class="tableShow">
                                    <li v-for="(item,index) in presetSelectedServiceDatas" @click="presetSelectServiceValue(item,index)" ><i class="icon checkedIcon" :class="{active:item.active}"></i>{{item.psName}}</li>
                                    <li v-if="presetSelectedServiceDatas.length<7" v-for="it in presetSelectedServiceDatas.length>7?0:(7-presetSelectedServiceDatas.length)"></li>
                                </ul>
                            </ul>
                            <div class="Bottom">
                                <Button Name="全选" @click.native="presetSelectedAll" buttonClass="None"/>
                                <Button Name="移除" @click.native="presetdeleteSelected"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <MTK v-show="tagShow"/>
            <MTK v-show="serviceShow"/>
            <MTK v-show="presetserviceShow"/>
        </div>
        <ul class="Tbody">
            <li class="clearfix">
                <span class="left"><i class="waring icon"></i>产品名称：</span>
                <span>
                    <i v-if="readonly">{{psName}}</i>
                    <Input v-if="!readonly" placeholder="输入产品名称" :value="psName" arguName="psName" @sonInput="upInput" :readonlys="readonly" :blur="blur" :focus="focus" :class="{waringborder:psNameShow}"/>
                    <i class="warings" v-show="psNameShow">必填</i>
                </span>
            </li>
            <li class="clearfix">
                <span class="left"><i class="waring icon"></i>产品类型：</span>
                <span>
                    <el-radio-group v-model="radio" @change="changeRadio" :disabled="readonly">
                        <el-radio :label="1">有限次数</el-radio>
                        <el-radio :label="2">不限次数</el-radio>
                      </el-radio-group>
                </span>
            </li>
            <li class="clearfix tableH">
                <span class="left"><i class="waring icon" ></i>服务内容：</span>
                <div class="left righttag">
                    <span @click="ServiceShow" class="choose" v-show="!readonly">
                        <i class="icon AddIcon"></i>新增
                        <i class="warings" v-show="sureSelectedServiceDatasShow">必选</i>
                    </span>   
                    <el-table :data="sureSelectedServiceDatas" border style="width: 100%" >
                        <el-table-column  prop="psName" label="服务" width="200"></el-table-column>
                        <el-table-column  prop="psPrice" label="标准定价" width="120"></el-table-column>
                        <el-table-column  prop="pTimes" label="卡内次数" width="200">
                            <template slot-scope="scope">
                                <div v-if="radio==2">不限次数</div>
                                <div v-else>
                                限 
                                    <i v-if="readonly">{{scope.row.pTimes}}</i>
                                <el-input-number v-if="!readonly" v-model="scope.row.pTimes" :disabled="radio==2" size="mini" :min="1" :max="100"  @change="changeNum(scope.row.pTimes)"></el-input-number> 
                                次
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column  label="操作" width="120" v-if="!detail">
                            <template slot-scope="scope" class="" >
                                <div class="">
                                    <Button Name="删除" buttonClass="Btn"  @click.native="deletesureSelectedServiceDatas(scope.$index,scope.row)"/>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column></el-table-column>
                    </el-table>
                </div>
            </li>
            <li class="clearfix tableH">
                <span class="left">赠送服务：</span>
                <div class="left righttag">
                    <span @click="presetServiceShow" class="choose" v-show="!readonly">
                        <i class="icon AddIcon"></i>新增
                    </span>    
                    <el-table :data="presetsureSelectedServiceDatas" border >
                        <el-table-column  prop="psName" label="服务" width="200"></el-table-column>
                        <el-table-column  prop="psPrice" label="标准定价" width="120"></el-table-column>
                        <el-table-column  prop="pTimes" label="卡内次数" width="200">
                            <template slot-scope="scope">
                                限
                                <i v-if="readonly">{{scope.row.pTimes}}</i>
                                <el-input-number v-if="!readonly" v-model="scope.row.pTimes" size="mini" :min="1" :max="100"  @change="changeNum(scope.row.pTimes,scope.$index)"></el-input-number> 
                                次
                            </template>
                        </el-table-column>
                        <el-table-column  label="操作" width="120" v-if="!detail">
                            <template slot-scope="scope" class="" >
                                <div class="">
                                    <Button Name="删除" buttonClass="Btn"  @click.native="presetdeletesureSelectedServiceDatas(scope.$index,scope.row)"/>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column></el-table-column>
                    </el-table>
                </div>
            </li>
            <li class="clearfix">
                <span class="left"><i class="waring icon"></i>基础定价：</span>
                <span>
                    <i v-if="readonly">{{psPrice}}</i>
                    <Input v-if="!readonly" placeholder="￥100.00" :value="psPrice"  :onkeyup="onkeyup"  arguName="psPrice" @sonInput="upInput" :readonlys="readonly" :blur="blurpsPrice" :focus="focuspsPrice" :class="{waringborder:psPriceShow}"/>
                    <i class="warings" v-show="psPriceShow">必填</i>
                </span>
            </li>
            <li class="clearfix">
                <span class="left"><i class="waring icon"></i>护理时长：</span>
                <span>
                    <i v-if="readonly">{{psServTime}}</i>
                    <Input v-if="!readonly" placeholder="护理时长" :value="psServTime" :onkeyup="onkeyuptime" arguName="psServTime" @sonInput="upInput" :readonlys="readonly" :blur="blurpsServTime" :focus="focuspsServTime" :class="{waringborder:psServTimeShow}"/> 分钟
                    <i class="warings" v-show="psServTimeShow">必填</i>
                </span>
            </li>
            <li>
                <span class="left"><i class="waring icon"></i>产品分类：</span>
                <span>
                    <ProductTag @sonProductSelect="SelectedProduct" :listdata="CategoryList" :cateId="cateId" :disabled="readonly" :class="{waringborder:cateIdShow}"/>
                    <i class="warings" v-show="cateIdShow">必填</i>
                </span>
            </li>
            <li  class="clearfix">
                <span class="left" ><i class="waring icon"></i>产品标签：</span>
                <div class="left righttag" ref="tagh">
                    <span @click="TagShow" class="choose" v-show="!readonly">
                        <i class="icon SelectedIcon"></i>选择
                        <i class="warings" v-show="sureTagNewArrSHow">必选</i>
                    </span>    
                    <ul class="tag" v-show="sureTagNewArr.length>0">
                        <li class="tagdetail" v-for="item in sureTagNewArr">
                            <span class="tagDetailTitle">{{item.tagName}}：</span>
                            <ul>
                                <li v-for="items in item.detail" class="Elementtag" :class="{update:!readonly}"  @click="cancleSureSelected(items)">{{items.value}} <i class="icon CloseIcon bottom"  v-show="!readonly"></i></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </li>
            <li>
                <span class="left">上架日期：</span>
                <span>
                    <i v-if="readonly">{{psOnShelf}}</i>
                    <el-date-picker
                    v-if="!readonly"
                    v-model="psOnShelf"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :placeholder="psOnShelf?psOnShelf:'选择日期时间'"
                    :readonly="readonly">
                  </el-date-picker>
                    <!-- <TakeTimePiker v-if="!readonly" arguName="psOnShelf" @clickTakeTimePiker="upDatePiker" :value2="psOnShelf" :readonly="readonly"/> -->
                </span>
            </li>
            <li class="clearfix">
                <span class="left">下架日期：</span>
                <div class="left righttag">
                    <i v-if="readonly">{{psOffShelf}}</i>
                    <el-date-picker
                    v-if="!readonly"
                    v-model="psOffShelf"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :placeholder="psOffShelf?psOffShelf:'选择日期时间'"
                    :readonly="readonly">
                  </el-date-picker>
                    <!-- <TakeTimePiker v-if="!readonly" arguName="psOffShelf" @clickTakeTimePiker="upDatePiker" :value2="psOffShelf" :readonly="readonly"/> -->
                    <i class="pleft" v-if="!readonly">
                        注：若填写了上下架日期，系统将按设定日期自动上下架，上架后产品对客户和门店可见
                    </i>
                </div>
            </li>
            <li>
                <span class="left">生效日期：</span>
                <span>
                    <i v-if="readonly">{{psValidTime}}</i>
                    <el-date-picker
                    v-if="!readonly"
                    v-model="psValidTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :placeholder="psValidTime?psValidTime:'选择日期时间'"
                    :readonly="readonly">
                  </el-date-picker>
                    <!-- <TakeTimePiker v-if="!readonly" arguName="psValidTime" @clickTakeTimePiker="upDatePiker" :value2="psValidTime" :readonly="readonly"/> -->
                </span>
            </li>
            <li class="clearfix">
                <span class="left">停用日期：</span>
                <div class="left righttag">
                    <i v-if="readonly">{{psInvalidTime}}</i>
                    <el-date-picker
                    v-if="!readonly"
                    v-model="psInvalidTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :placeholder="psInvalidTime?psInvalidTime:'选择日期时间'"
                    :readonly="readonly">
                  </el-date-picker>
                    <!-- <TakeTimePiker  v-if="!readonly" arguName="psInvalidTime" @clickTakeTimePiker="upDatePiker" :value2="psInvalidTime" :readonly="readonly"/> -->
                    <p class="pleft" v-if="!readonly">
                        注：若填写了生效/停用日期，系统将按设定日期控制是否允许开单，生效日期必须≤上架日期≤下架日期必须≤停用日期
                    </p>
                </div>
            </li>
            <li  class="clearfix">
                <span class="left">展示图片：</span>
                <div class="left righttag">
                    <div class="imgurl"  v-if="readonly">
                        <img :src="psImg" alt="">
                    </div>
                    <div class="footer" v-if="!readonly">
                        <upload :url='psImg'  @sonInput='uploadimg'   />
                        <span>建议尺寸800*800px</span>
                    </div>
                </div>
            </li>
        </ul>
        <div class="Footer" v-show="!readonly">
            <Button Name="取消" buttonClass="None" @click.native="cancleReturn"/>
            <Button Name="保存" @click.native="submit"/>
        </div>
    </div>
</template>
<script>
    import Input from "../../../../common/Input"
    import upload from "../../../../common/upload"
    import Button from "../../../../common/Button"
    import Select from "../../../../common/Select"
    import MTK from "../../../../common/Mtk"
    import TakeTimePiker from "../../../../common/TakeTimePiker";
    import {mapMutations,mapState} from "vuex"
    export default {
        components: {
            Input,Select,TakeTimePiker,Button,MTK,ProductTag:resolve => {require(['../../../../common/ProductTag'], resolve)},upload
        },
        data(){
            return{
                radio:1,
                psNameShow:false,
                sureSelectedServiceDatasShow:false,
                psPriceShow:false,
                psServTimeShow:false,
                cateIdShow:false,
                sureTagNewArrSHow:false,
                isHeight:"100%",
                TagNames:"套卡新增",
                ProductShowService:false,
                serviceProductName:"",
                presetserviceProductName:"",
                serviceProductcateId:"",
                codeOrName:"",
                ProductName:"",
                ProductShow:false,
                CloseStatus:false,
                Cliked:false,
                CategoryList:[],//产品分类的数据
                detail:false,
                canServiceDatas:[],//可选单项服务的数据
                SelectedServiceDatas:[],//已选单项服务的数据
                sureSelectedServiceDatas:[],//确定已选单项服务的数据
                presetsureSelectedServiceDatas:[],//确定赠送的已选单项服务的数据
                psServSelect:1,//服务可选项(个数)
                psGiftSelect:1,//赠送服务可选项(个数)
                psTime:1,
                serviceShow:false,//服务弹框的显示
                presetserviceShow:false,
                presetcanServiceDatas:[],
                presetSelectedServiceDatas:[],
                readonly:false,
                tagShow:false,//标签模块的显示
                psName:"",//产品名称(必须)
                psPrice:"",//价格
                psServTime:"",//护理时长(单位分钟)
                cateId:"",//产品分类id
                taglist:"",//产品标签(数组)
                tagId:"",//标签id
                tagValue:"",//（标签选项,逗号分隔的字串）        
                psOffShelf:"",//下架时间
                psOnShelf:"",//上架时间
                psValidTime:"",//生效时间
                psInvalidTime:"",//停用时间
                psImg:"",//产品图片地址
                tagDatas:[],//获取的标签的总数据
                tagDatasValue:[],//
                tagNewArr:[],//标签值数据
                tagSelected:[],//预选中的产品标签
                sureTagNewArr:[],//确定选中的产品标签数据
                content:[],
                list:[],
                arrs:[],
            }
        },
        computed: {
            ...mapState(["productcate"]),
        },
        methods:{
            ...mapMutations(["setDatas"]),
            onkeyup(value){
                value.target.value = value.target.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符   
                value.target.value = value.target.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
                value.target.value = value.target.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
                value.target.value = value.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数   
                if(value.target.value.indexOf(".")< 0 && value.target.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
                    value.target.value= parseFloat(value.target.value);  
                }  
            },
            onkeyuptime(value){
                value.target.value = value.target.value.replace(/[^\d]/g,"");  //清除“数字”以外的字符   
                if(value.target.value.indexOf(".")< 0 && value.target.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
                    value.target.value= parseFloat(value.target.value);  
                } 
            },
            uploadimg(value){
                this.psImg=value;
            },
            changeRadio(value){
                console.log(value)
            },
            blur(){
                if(this.psName==""){
                    this.psNameShow=true;
                }
            },
            focus(){
                if(this.psNameShow){
                    this.psNameShow=false;
                }
            },
            blurpsPrice(){
                if(this.psPrice==""){
                    this.psPriceShow=true;
                }
            },
            focuspsPrice(){
                if(this.psPriceShow){
                    this.psPriceShow=false;
                }
            },
            blurpsServTime(){
                if(this.psServTime==""){
                    this.psServTimeShow=true;
                }
            },
            focuspsServTime(){
                if(this.psServTimeShow){
                    this.psServTimeShow=false;
                }
            },
            
            cancleReturn(){
                history.go(-1);
            },
            scroll(){
                console.log(1)
            },
            cancleserviceProduct(){
                this.serviceShow=false;
                this.presetserviceShow=false;
                this.SelectedServiceDatas=this.deepCopy(this.sureSelectedServiceDatas);
                this.SelectedServiceDatas.map(el=>{
                    el.active=false;
                });
                this.presetSelectedServiceDatas=this.deepCopy(this.presetsureSelectedServiceDatas);
                this.presetSelectedServiceDatas.map(el=>{
                    el.active=false;
                });
                this.canServiceDatas=this.deepCopy(this.content);
                this.canServiceDatas.map(el=>{
                    el.active=false;
                    this.SelectedServiceDatas.map(val=>{
                        if(el.id==val.id){
                            el.active=true;
                        }
                    })
                });
                this.presetcanServiceDatas=this.deepCopy(this.content);
                this.presetcanServiceDatas.map(el=>{
                    el.active=false;
                    this.presetSelectedServiceDatas.map(val=>{
                        if(el.id==val.id){
                            el.active=true;
                        }
                    })
                });
                this.codeOrName="";
                this.serviceProductName="";
            },
            // 搜索
            gotoDetail(){
                let data={
                    pageNumber:1,
                    pageSize:8,
                    codeOrName:this.codeOrName,
                    cateId:this.serviceProductcateId
                }
                this.$post(this.$host+"/api/prod/prtserv/page",data).then(d=>{
                    if(d.success){
                        let content=d.data.content;
                        content.map(el=>{
                            el.active=false;
                            el.actives=false;
                        })
                        this.canServiceDatas=this.deepCopy(content);
                        this.presetcanServiceDatas=this.deepCopy(content);
                        this.canServiceDatas.map(el=>{
                            el.active=false;
                            this.SelectedServiceDatas.map(val=>{
                                if(el.id==val.id){
                                    el.active=true;
                                }
                            })
                        })
                        this.presetcanServiceDatas.map(el=>{
                            el.active=false;
                            this.SelectedServiceDatas.map(val=>{
                                if(el.id==val.id){
                                    el.active=true;
                                }
                            })
                        })
                        console.log(this.canServiceDatas.length)
                    }
                })
            },
            showProductFuncService(){
                this.ProductShowService=!this.ProductShowService;
            },
            upClear(){
                this.ProductName="";
                this.cateId="";
            },
            upClearService(){
                this.serviceProductName="";
                this.serviceProductcateId="";
            },
            //选择产品分类
            SelectedProduct(item){
                this.cateId=item;
                this.cateIdShow=false;
                if(!item){
                    this.cateId="";
                    this.cateIdShow=true;
                }
            },
            SelectedProductService(id){
                // this.serviceProductName=item.cateName;
                this.serviceProductcateId=id;
                this.showProductFuncService();
            },
            showProductFunc(){
                this.Cliked=!this.Cliked;
                this.ProductShow=!this.ProductShow;
            },
            IconshowProductFunc(){
                if(this.CloseStatus){
                    this.ProductName="";
                    this.cateId="";
                    this.Cliked=false;
                    this.CloseStatus=false;
                    return;
                }
                this.showProductFunc();
            },
            // 获取产品分类的数据
            getCategoryList(){
                if(!this.productcate){
                    this.$post(this.$host+"/api/prod/productcate/tree",{}).then(d=>{
                        if(d.success){
                            this.CategoryList=d.list;
                            this.setDatas({name:"productcate",value:this.CategoryList});
                        }
                    })
                }else{
                    this.CategoryList=this.productcate;
                }
            },
            deepCopy(arr){
                let newArr=[];
                for(let i=0;i<arr.length;i++){
                    newArr.push(this.copy(arr[i]));
                }
                return newArr;
            },
            copy(obj){
                let newobj={};
                for(let attr in obj){
                    newobj[attr] = obj[attr];
                }
                return newobj;
            },
            //赠送弹框
            presetServiceShow(){
                this.presetserviceShow=true;
            },
            deletesureSelectedServiceDatas(index,item){
                let detail=this.$route.query.detail||"";
                if(detail=="detail"){
                    return;
                }
                this.sureSelectedServiceDatas.splice(index,1);
                this.SelectedServiceDatas.splice(index,1);
                this.canServiceDatas.map(v=>{
                    if(v.id==item.id){
                        v.active=false;
                    }
                });
                console.log(this.sureSelectedServiceDatas)
                if(this.sureSelectedServiceDatas.length==0){
                    this.sureSelectedServiceDatasShow=true;
                }else{
                    this.sureSelectedServiceDatasShow=false;
                }
            },
            presetdeletesureSelectedServiceDatas(index,item){
                let detail=this.$route.query.detail||"";
                if(detail=="detail"){
                    return;
                }
                this.presetsureSelectedServiceDatas.splice(index,1);
                this.presetSelectedServiceDatas.splice(index,1);
                this.presetcanServiceDatas.map(v=>{
                    if(v.id==item.id){
                        v.active=false;
                    }
                })
            },
            // 限定次数
            changeNum(value){
                console.log(value)
            },
            // 是否固定
            ClickFixation(status,item,index){
                let detail=this.$route.query.detail||"";
                if(detail=="detail"){
                    return;
                }
                if(status==1){
                    item.active=1;
                    item.pFix=1;
                    this.$set(this.sureSelectedServiceDatas,index,item)
                    
                }else{
                    item.active=0;
                    item.pFix=0;
                    this.$set(this.sureSelectedServiceDatas,index,item)
                    
                }
                console.log(this.sureSelectedServiceDatas)
                
            },
            // 确定选中的服务
            sureSelectedService(){
                this.SelectedServiceDatas.map(el=>{
                    el.pTimes=1;
                })
                this.sureSelectedServiceDatas=this.deepCopy(this.SelectedServiceDatas);
                this.canServiceDatas=this.deepCopy(this.content);
                this.canServiceDatas.map(el=>{
                    el.active=false;
                    this.sureSelectedServiceDatas.map(val=>{
                        if(el.id==val.id){
                            el.active=true;
                        }
                    })
                })
                this.serviceShow=false;
                this.codeOrName="";
                this.serviceProductName="";
                console.log(this.sureSelectedServiceDatas)
                if(this.sureSelectedServiceDatas.length==0){
                    this.sureSelectedServiceDatasShow=true;
                }else{
                    this.sureSelectedServiceDatasShow=false;
                }
            },
            // 确定选中的服务
            presetsureSelectedService(){
                this.presetSelectedServiceDatas.map(el=>{
                    el.pTimes=1;
                })
                this.presetsureSelectedServiceDatas=this.deepCopy(this.presetSelectedServiceDatas);
                this.presetserviceShow=false;
                this.codeOrName="";
                this.serviceProductName="";
                this.presetcanServiceDatas=this.deepCopy(this.content);
                this.presetcanServiceDatas.map(el=>{
                    el.active=false;
                    this.presetsureSelectedServiceDatas.map(val=>{
                        if(el.id==val.id){
                            el.active=true;
                        }
                    })
                })
                console.log(this.sureSelectedServiceDatas)
            },
            // 移除已选中的单项服务
            deleteSelected(){
                console.log(this.SelectedServiceDatas)
                // for(var i=0;i<this.SelectedServiceDatas.length;i++){
                //     if(this.SelectedServiceDatas[i].active){
                //         this.canServiceDatas.map((v,i)=>{
                //             if(v.id==this.SelectedServiceDatas[i].id){
                //                 v.active=false;
                //             }
                //         });
                //         this.SelectedServiceDatas.splice(i,1);
                //     }
                // }
                this.SelectedServiceDatas.map((el,index)=>{
                    if(el.active){
                        this.canServiceDatas.map((v,i)=>{
                            if(v.id==el.id){
                                v.active=false;
                            }
                        });
                        this.SelectedServiceDatas.splice(index,1);
                    }
                });
                this.SelectedServiceDatas.map((el,index)=>{
                    if(el.active){
                        this.canServiceDatas.map((v,i)=>{
                            if(v.id==el.id){
                                v.active=false;
                            }
                        });
                        this.SelectedServiceDatas.splice(index,1);
                    }
                });
                // if(this.SelectedServiceDatas[0].active){//最后一条也是选中的时
                //     this.canServiceDatas.map((v,i)=>{
                //         if(v.id==this.SelectedServiceDatas[0].id){
                //             v.active=false;
                //         }
                //     });
                //     this.SelectedServiceDatas=[];
                // }
                console.log(this.SelectedServiceDatas)
            },
            // 移除已选中的单项服务
            presetdeleteSelected(){
                console.log(this.presetSelectedServiceDatas)
                // for(var i=0;i<this.SelectedServiceDatas.length;i++){
                //     if(this.SelectedServiceDatas[i].active){
                //         this.canServiceDatas.map((v,i)=>{
                //             if(v.id==this.SelectedServiceDatas[i].id){
                //                 v.active=false;
                //             }
                //         });
                //         this.SelectedServiceDatas.splice(i,1);
                //     }
                // }
                this.presetSelectedServiceDatas.map((el,index)=>{
                    if(el.active){
                        this.presetcanServiceDatas.map((v,i)=>{
                            if(v.id==el.id){
                                v.active=false;
                            }
                        });
                        this.presetSelectedServiceDatas.splice(index,1);
                    }
                });
                this.presetSelectedServiceDatas.map((el,index)=>{
                    if(el.active){
                        this.presetcanServiceDatas.map((v,i)=>{
                            if(v.id==el.id){
                                v.active=false;
                            }
                        });
                        this.presetSelectedServiceDatas.splice(index,1);
                    }
                });
                // if(this.SelectedServiceDatas[0].active){//最后一条也是选中的时
                //     this.canServiceDatas.map((v,i)=>{
                //         if(v.id==this.SelectedServiceDatas[0].id){
                //             v.active=false;
                //         }
                //     });
                //     this.SelectedServiceDatas=[];
                // }
                console.log(this.presetSelectedServiceDatas)
            },
            // 全选已选服务事件
            SelectedAll(){
                this.SelectedServiceDatas.map(el=>{
                    el.active=true;
                })
            },
             // 全选已选服务事件
             presetSelectedAll(){
                this.presetSelectedServiceDatas.map(el=>{
                    el.active=true;
                })
            },
            // 全选已选服务事件
            presetSelectedAll(){
                this.presetSelectedServiceDatas.map(el=>{
                    el.active=true;
                })
            },
            // 选择已选服务事件
            SelectServiceValue(item,index){
                item.active=!item.active;
            },
             // 赠送选择已选服务事件
             presetSelectServiceValue(item,index){
                item.active=!item.active;
            },
            // 选择可选服务事件
            SelectService(item,index){
                if(item.active){//true为选过的，反选
                    item.active=false;
                    this.SelectedServiceDatas.map((el,index)=>{
                        if(el.id==item.id){
                            this.SelectedServiceDatas.splice(index,1);
                        }
                    })
                }else{//选中
                    let canPush=true;
                    this.SelectedServiceDatas.map(el=>{
                        if(el.id==item.id){
                            canPush=false;
                        }
                    })
                    if(canPush){
                        let newobj=new Object();
                        newobj.id=item.id;
                        newobj.psName=item.psName;
                        newobj.psPrice=item.psPrice;
                        newobj.active=false;
                        this.SelectedServiceDatas.push(newobj);
                    }
                    item.active=true;
                }
                
                console.log(this.SelectedServiceDatas)
            },
            // 赠送选择可选服务事件
            presetSelectService(item,index){
                if(item.active){//true为选过的，反选
                    item.active=false;
                    this.presetSelectedServiceDatas.map((el,index)=>{
                        if(el.id==item.id){
                            this.presetSelectedServiceDatas.splice(index,1);
                        }
                    })
                }else{//选中
                    let canPush=true;
                    this.presetSelectedServiceDatas.map(el=>{
                        if(el.id==item.id){
                            canPush=false;
                        }
                    })
                    if(canPush){
                        let newobj=new Object();
                        newobj.id=item.id;
                        newobj.psName=item.psName;
                        newobj.psPrice=item.psPrice;
                        newobj.active=false;
                        this.presetSelectedServiceDatas.push(newobj);
                    }
                    item.active=true;
                }
                
                console.log(this.presetSelectedServiceDatas)
            },
            // 获取可选单项服务的数据
            getcanServiceDatas(){
                let data={
                    pageNumber:1,
                    pageSize:100,
                    paValidStatus:1,
                    psStatus:1
                }
                this.$post(this.$host+"/api/prod/prtserv/page",data).then(d=>{
                    if(d.success){
                        let content=d.data.content;
                        content.map(el=>{
                            el.active=false;
                            el.actives=false;
                        });
                        this.content=content;
                        this.canServiceDatas=this.deepCopy(content);
                        this.presetcanServiceDatas=this.deepCopy(content);
                        console.log(this.canServiceDatas.length)
                    }
                })
            },
            // 服务弹框的显示
            ServiceShow(){
                this.serviceShow=true;
            },
            // 取消页面上确定选中的
            cancleSureSelected(items){
                if(this.readonly){
                    return;
                }
                this.sureTagNewArr.map((el,i)=>{
                    if(el.id==items.id){
                        el.detail.map((val,index)=>{
                            if(val.value==items.value){
                                el.detail.splice(index,1);
                            }
                        });
                        if(el.detail.length==0){
                            this.sureTagNewArr.splice(i,1);
                        }
                    }
                });
                this.tagSelected.map((v,i)=>{
                    if(v.id==items.id&&v.value==items.value){
                        this.tagSelected.splice(i,1);
                    }
                })
                // 默认第一个标签类别
                this.tagDatas.map((el,index)=>{
                    el.active=false;
                    if(index==0){
                        el.active=true;
                    }
                })
                this.tagDatasValue=this.tagDatas[0].tagValue.split(",");
                let newArr=[];
                this.tagDatasValue.map(el=>{
                    let newObj=new Object();
                    newObj.id=this.tagDatas[0].id;
                    newObj.active=false;
                    newObj.value=el;
                    this.tagSelected.map((v,i)=>{
                        if(v.id==newObj.id&&v.value==newObj.value){
                            newObj.active=true;
                        }
                    })
                    newObj.tagName=this.tagDatas[0].tagName;
                    newArr.push(newObj);
                });
                this.tagNewArr=newArr;
                this.tagNewArr.map((v,i)=>{
                    if(v.id==items.id&&v.value==items.value){
                        v.active=false;
                    }
                })
                if(this.sureTagNewArr.length==0){
                    this.sureTagNewArrSHow=true;
                }else{
                    this.sureTagNewArrSHow=false;
                }
                console.log("这是确认选中")
                console.log(this.sureTagNewArr)
                console.log("这是预选中")
                console.log(this.tagSelected)
                console.log("这是标签值数据")
                console.log(this.tagNewArr)
            },
            // 产品名称
            upInput(value,arguName){
                this[arguName]=value;
            },
            // 取消已选中的标签
            cancleSelected(item,index){
                this.tagNewArr.map(el=>{
                    if(el.id==item.id&&el.value==item.value){
                        el.active=false;
                    }
                });
                this.tagSelected.splice(index,1);
            },
            // 选中标签值
            SelectTagValue(item,index){
                if(item.tagMode==0){//单选
                    this.tagNewArr.map((v,i)=>{
                        v.active=false;
                        if(i==index){
                            v.active=true;
                        }
                    });
                    this.tagSelected.map((v,i)=>{
                        if(v.id==item.id){
                            this.tagSelected.splice(i,1);
                        }
                    })
                }else{
                    this.tagNewArr[index].active=true;
                }
                // this.tagNewArr[index].active=true;
                let Canpush=true;
                if(this.tagSelected.length>0){
                    this.tagSelected.map(el=>{
                        if(el.id==item.id&&el.value==item.value){
                            Canpush=false;
                        }
                    })
                }
                if(Canpush){
                    this.tagSelected.push(item);
                }
                // if(this.tagSelected.indexOf(item)<0){
                //     this.tagSelected.push(item);
                // }
            },
            // 选中标签类别 
            SelectTagSort(item,index){
                this.tagDatas.map((v,i)=>{
                    v.active=false;
                })
                this.tagDatas[index].active=true;
                this.tagDatasValue=this.tagDatas[index].tagValue.split(",");
                let newArr=[];
                this.tagDatasValue.map(el=>{
                    let newObj=new Object();
                    newObj.id=item.id;
                    newObj.active=false;
                    this.tagSelected.map((v,i)=>{
                        if(v.id==item.id&&v.value==el){
                            newObj.active=true;
                        }
                    });
                    newObj.value=el;
                    newObj.tagName=item.tagName;
                    newObj.tagMode=item.tagMode;
                    newArr.push(newObj);
                });
                this.tagNewArr=newArr;
            },
            // 显示标签弹框
            TagShow(){
                this.tagShow=true;
            },
            // 取消选择
            cancle(){
                this.tagShow=false;
                this.tagSelected=[];
                this.sureTagNewArr.map(el=>{
                    el.detail.map(val=>{
                        this.tagSelected.push(val);
                        this.tagNewArr.map(value=>{
                            if(val.id==value.id&&val.value==value.value){//第一个类别的标签值
                                value.active=true;
                            }
                        })
                    })
                });
                
            },
            // 确认选择
            sureSelected(){
                let datas=[];
                this.tagSelected.map((v,i)=>{
                    let newObj=new Object();
                    if(datas.length>0){
                        let canPush=true;
                        datas.map((value,index)=>{
                            if(value.id==v.id){
                                value.detail.push(v);
                                canPush=false;
                            }
                        })
                        if(canPush){//没有这个id
                            newObj.id=v.id;
                            newObj.tagName=v.tagName;
                            let newArr=[];
                            newArr.push(v);
                            this.tagDatas.map(val=>{
                                if(val.id==v.id){
                                    newObj.detailTotal=val.tagValue.split(",")
                                }
                            })
                            newObj.detail=newArr;
                            datas.push(newObj);
                        }
                    }else{
                        newObj.id=v.id;
                        newObj.tagName=v.tagName;
                        let newArr=[];
                        newArr.push(v);
                        this.tagDatas.map(val=>{
                            if(val.id==v.id){
                                newObj.detailTotal=val.tagValue.split(",")
                            }
                        });
                        newObj.detail=newArr;
                        datas.push(newObj);
                    }
                    
                });
                this.sureTagNewArr=datas;
                if(this.sureTagNewArr.length==0){
                    this.sureTagNewArrSHow=true;
                }else{
                    this.sureTagNewArrSHow=false;
                }
                this.tagShow=false;
            },
            // 选择时间日期
            upDatePiker(value,arguName){
                this[arguName]=value;
            },
            // 获取标签
            getTag(){
                let update=this.$route.query.update||"";
                if(update){//修改页面
                    this.getUpdate();
                }
                let detail=this.$route.query.detail||"";
                if(detail=="detail"){
                    this.getUpdate();
                    this.readonly=true;
                    return;
                }  
                let data={
                    pageNumber:1,
                    pageSize:100
                }
                this.$post(this.$host+"/api/prod/producttag/page",data).then(d=>{
                    if(d.success){
                        let content=d.data.content;
                        content.map((el,index)=>{
                            el.active=false;
                            if(index==0){
                                el.active=true;
                            }
                        })
                        this.tagDatas=content;
                        this.tagDatasValue=this.tagDatas[0].tagValue.split(",");
                        let newArr=[];
                        this.tagDatasValue.map(el=>{
                            let newObj=new Object();
                            newObj.id=this.tagDatas[0].id;
                            newObj.tagMode=this.tagDatas[0].tagMode;
                            newObj.active=false;
                            newObj.value=el;
                            newObj.tagName=this.tagDatas[0].tagName;
                            newArr.push(newObj);
                        });
                        this.tagNewArr=newArr;
                                  
                    }
                })
            },
            // 保存提交
            submit(){
                if(this.psName==""){
                    this.psNameShow=true;
                    return;
                }
                if(this.sureSelectedServiceDatas.length==0){
                    this.sureSelectedServiceDatasShow=true;
                    return;
                }
                if(this.psPrice==""){
                    this.psPriceShow=true;
                    return;
                }
                if(this.psServTime==""){
                    this.psServTimeShow=true;
                    return;
                }
                if(this.cateId==""){
                    this.cateIdShow=true;
                    return;
                }
                if(this.sureTagNewArr.length==0){
                    this.sureTagNewArrSHow=true;
                    return;
                }
                if(this.psValidTime){//有生效时间
                    if(this.psOnShelf){//有上架时间
                        if(this.psValidTime>this.psOnShelf){
                            this.$message({
                                type:"info",
                                showClose: true,
                                duration:0,
                                message:"生效时间必须小于上架时间"
                            });
                            return;
                        }
                    }
                    if(this.psOffShelf){//有下架时间
                        if(this.psValidTime>this.psOffShelf){
                            this.$message({
                                type:"info",
                                showClose: true,
                                duration:0,
                                message:"生效时间必须小于下架时间"
                            });
                            return;
                        }
                    }
                    if(this.psInvalidTime){//有失效时间
                        if(this.psValidTime>this.psInvalidTime){
                            this.$message({
                                type:"info",
                                showClose: true,
                                duration:0,
                                message:"生效时间必须小于停用时间"
                            });
                            return;
                        }
                    }
                }
                if(this.psOnShelf){//有上架时间
                    if(this.psOffShelf){//有下架时间
                        if(this.psOnShelf>this.psOffShelf){
                            this.$message({
                                type:"info",
                                showClose: true,
                                duration:0,
                                message:"上架时间必须小于下架时间"
                            });
                            return;
                        }
                    }
                    if(this.psInvalidTime){//有失效时间
                        if(this.psOnShelf>this.psInvalidTime){
                            this.$message({
                                type:"info",
                                showClose: true,
                                duration:0,
                                message:"上架时间必须小于停用时间"
                            });
                            return;
                        }
                    }
                }
                if(this.psOffShelf){//有下架时间
                    if(this.psInvalidTime){//有失效时间
                        if(this.psOffShelf>this.psInvalidTime){
                            this.$message({
                                type:"info",
                                showClose: true,
                                duration:0,
                                message:"下架时间必须小于停用时间"
                            });
                            return;
                        }
                    }
                }
                let newArr=[];
                this.sureTagNewArr.map(el=>{
                    let newObj=new Object();
                    let newStr="";
                    newObj.tagId=el.id;
                    if(el.detail.length<=1){
                        newStr+=el.detail[0].value;
                    }else{
                        el.detail.map(val=>{
                            newStr+=val.value+","
                        });
                    }
                    newObj.tagValue=newStr;
                    newArr.push(newObj);
                });
                this.taglist=newArr;
                console.log(this.sureSelectedServiceDatas)
                console.log(this.presetsureSelectedServiceDatas)
                this.sureSelectedServiceDatas.map(el=>{
                    el.pTimes=parseInt(el.pTimes);
                    if(!el.pServId){
                        el.pServId=el.id;
                    }
                    delete el.id;
                    delete el.active;
                    delete el.actives;
                    delete el.psName;
                    delete el.psPrice;
                    delete el.pFix;
                })
                this.presetsureSelectedServiceDatas.map(el=>{
                    el.pTimes=parseInt(el.pTimes);
                    if(!el.pServId){
                        el.pServId=el.id;
                    }
                    delete el.id;
                    delete el.active;
                    delete el.actives;
                    delete el.psName;
                    delete el.psPrice;
                    delete el.pFix;
                })
                if(this.radio==2){
                    this.sureSelectedServiceDatas.map(el=>{
                        el.pTimes=999;
                    })
                    // this.presetsureSelectedServiceDatas.map(el=>{
                    //     el.pTimes=999;
                    // })
                }
                let data={
                    psName:this.psName,//产品名称(必须)
                    psServSelect:this.psServSelect,//服务可选项(个数)
                    psGiftSelect:this.psGiftSelect,//赠送服务可选项(个数)
                    servlist:this.sureSelectedServiceDatas,
                    givelist:this.presetsureSelectedServiceDatas,
                    psPrice:this.psPrice,//价格
                    psServTime:this.psServTime,//护理时长(单位分钟)
                    cateId:this.cateId,//产品分类id
                    taglist:this.taglist,//产品标签(数组)
                    psOffShelf:this.psOffShelf,//下架时间
                    psOnShelf:this.psOnShelf,//上架时间
                    psValidTime:this.psValidTime,//生效时间
                    psInvalidTime:this.psInvalidTime,//失效时间
                    psImg:this.psImg//产品图片地
                }
                let update=this.$route.query.update||"";
                if(update){//修改修改
                    data.id=this.$route.query.id||"";
                    this.$post(this.$host+"/api/prod/prtcard/update",data).then(d=>{
                        if(d.success){
                            this.$message({
                                type:"success",
                                message:"修改成功",
                                duration:"800",
                                onClose:()=>{
                                    this.$router.push({
                                        path:"/NavDetail/ProductCardlist"
                                    })
                                }
                            })
                        }
                    })
                }else{
                    this.$post(this.$host+"/api/prod/prtcard/add",data).then(d=>{
                        if(d.success){
                            this.$message({
                                type:"success",
                                message:"新增成功",
                                duration:"800",
                                onClose:()=>{
                                    this.$router.push({
                                        path:"/NavDetail/ProductCardlist"
                                    })
                                }
                            })
                        }
                    })
                }
            },
            digui(data,id){
                data.map(el=>{
                    if(el.id==id){
                        this.arrs.unshift(el.id);
                        console.log(el.cateParent)
                        if(el.cateParent==0){
                            return;
                        }
                        this.gui(el.cateParent);
                    }
                })
            },
            gui(id){
                this.list.map(el=>{
                    if(el.id==id){
                        console.log(el.cateParent)
                        this.arrs.unshift(el.id);
                        if(el.cateParent==0){
                            return;
                        }
                    }
                    el.childs&&this.digui(el.childs,id)
                })
            },
            // 获取修改页面的详情
            getUpdate(){
                let datas={
                    id:this.$route.query.id||""
                }
                this.$post(this.$host+"/api/prod/prtcard/queryone",datas).then(d=>{
                    if(d.success){
                        this.psName=d.psName;
                        this.psPrice=d.psPrice;
                        this.psServTime=d.psServTime;
                        this.cateId=d.cateId;//产品分类id
                        // this.$post(this.$host+'/api/prod/productcate/tree',{}).then(d=>{
                        //     if(d.success){
                        //         this.list=d.list;
                        //         this.gui(this.cateId);
                        //     }
                        // })
                        this.psOnShelf=d.psOnShelf;
                        this.psOffShelf=d.psOffShelf;
                        this.psValidTime=d.psValidTime;
                        this.psInvalidTime=d.psInvalidTime;
                        // this.psOnShelf=this.$dateFormat("yy-MM-dd hh:mm:ss",d.psOnShelf);
                        // this.psOffShelf=this.$dateFormat("yy-MM-dd hh:mm:ss",d.psOffShelf);
                        // this.psValidTime=this.$dateFormat("yy-MM-dd hh:mm:ss",d.psValidTime);
                        // this.psInvalidTime=this.$dateFormat("yy-MM-dd hh:mm:ss",d.psInvalidTime);
                        this.sureSelectedServiceDatas=d.servlist;
                        // this.SelectedServiceDatas=d.servlist;
                        this.sureSelectedServiceDatas.map(el=>{
                            if(el.pFix=1){//固定
                                el.active=1;
                            }else{
                                el.active=0;
                            }
                            if(el.pTimes>0){
                                el.actives=4;
                            }else{
                                el.actives=3;
                            }
                        })
                        this.presetsureSelectedServiceDatas=d.givelist;
                        // this.presetSelectedServiceDatas=d.servlist;
                        this.presetsureSelectedServiceDatas.map(el=>{
                            if(el.pFix=1){//固定
                                el.active=1;
                            }else{
                                el.active=0;
                            }
                            if(el.pTimes>0){
                                el.actives=4;
                            }else{
                                el.actives=3;
                            }
                        })
                        if(this.sureSelectedServiceDatas[0].pTimes==999){
                            this.radio=2;
                            this.sureSelectedServiceDatas.map(el=>{
                                el.pTimes=1;
                            });
                            // this.presetsureSelectedServiceDatas.map(el=>{
                            //     el.pTimes=1;
                            // })
                        }
                        this.psImg=d.psImg;
                        let taglist=d.taglist;
                        let newArr=[];
                        taglist.map(el=>{
                            let newObj=new Object();
                            newObj.id=el.tagId;
                            newObj.tagName=el.tagName;
                            newObj.detail=[];
                            let newSmallArr=el.tagValue.split(",");
                            newSmallArr.map(val=>{
                                let newSmallObj=new Object();
                                newSmallObj.active=true;
                                newSmallObj.id=el.tagId;
                                newSmallObj.tagMode=el.tagMode;
                                newSmallObj.tagName=el.tagName;
                                newSmallObj.value=val;
                                val&&newObj.detail.push(newSmallObj);
                            });
                            newArr.push(newObj);
                        });
                        this.sureTagNewArr=newArr;//已确定选中的数据
                        this.tagSelected=[];//预选中的数据
                        taglist.map(el=>{
                            let newSmallArr=el.tagValue.split(",");
                            newSmallArr.map(val=>{
                                let newSmallObj=new Object();
                                newSmallObj.id=el.tagId;
                                newSmallObj.active=true;
                                newSmallObj.tagMode=el.tagMode;
                                newSmallObj.tagName=el.tagName;
                                newSmallObj.value=val;
                                val&&this.tagSelected.push(newSmallObj);
                            })
                        })
                        
                        // this.tagNewArr=[];
                        taglist.map(el=>{
                            let newSmallArr=el.tagValue.split(",");
                            newSmallArr.map(val=>{
                                let newSmallObj=new Object();
                                newSmallObj.active=true;
                                newSmallObj.id=el.tagId;
                                newSmallObj.tagName=el.tagName;
                                newSmallObj.value=val;
                                // val&&this.tagNewArr.push(newSmallObj)
                            })
                        })
                        this.tagNewArr.map(el=>{
                            taglist.map(val=>{
                                if(el.id==val.tagId){//第一个类别
                                    let newSmallArr=val.tagValue.split(",");
                                    newSmallArr.map(value=>{
                                        if(value==el.value){
                                            el.active=true;
                                        }
                                    })
                                }
                            })
                        });
                        console.log("tagNewArr");
                        console.log(this.tagNewArr);
                        // this.sureTagNewArr
                    }
                })
            }
        },
        mounted () {
            this.getTag()
            let detail=this.$route.query.detail||"";
            if(detail=="detail"){this.detail=true;this.TagNames="套卡详情"}else{
                this.getcanServiceDatas();
            }
            let update=this.$route.query.update||"";
            if(update=="update"){;this.TagNames="套卡修改"}
            this.getCategoryList();
            this.isHeight=(document.documentElement.clientHeight-this.$refs.p.offsetTop)+"px";

        }
    }
</script>
<style scoped>
    .uploaddiv{
        display:inline-block;
    }
    .ProductClass{
        position: absolute;
        left: 0;
        top: 2.666667rem;
        z-index: 3000;
        width: 20.833333rem;
        background: #ffffff;
        border-radius: .333333rem;
    }
    .ProductClassService{
        position: fixed;
        left: 0;
        top: 2.666667rem;
        z-index: 3000;
        width: 20.833333rem;
        background: #ffffff;
        border-radius: .333333rem;
    }
    .header{
        color: #2cbcc8;
    font-size: 1.333333rem;
    margin-bottom: 1rem;
    position: relative;
    }
    .headericon::before {
        content: "\E62D";
    }
    .header .right{
        float: right;
    }
    .AddIcon::before{
        content: "\e712";
        color: #4db0e8;
        font-size: 1.333333rem;
    }
    /* .tableShow::-webkit-scrollbar{
        width: 10px;
        border:1px solid #cccccc;
    }
    .tableShow::-webkit-scrollbar-button{
        background:#ccc;
        height: 0;
    }
    .tableShow::-webkit-scrollbar-track-piece{
        background:#eee;
    }
    .tableShow::-webkit-scrollbar-thumb{
        background:#ccc;
        border-radius: 4px;
    } */
    .CloseIcon::before{
        content: "\e61a";
    }
    .CloseIcon{
        padding-left: 7px;
        color: #4db0e8;
    }
    .CloseIcon.bottom{
        color: #ccc;
    }
    .timesInput{
        width: 20px;
        border-bottom: 1px solid #ccc;
        text-align: center;
    }
    .checkedIcon::before{
        content: "\e68c";
        color: #dcdfe6;
    }
    .righttag{
        padding:12px 0;
        padding-left: 15px;
        min-height: 40px;
        width: 85%;
        background: #fff;
        border-left: 1px solid #efefef;
    }
    .righttag .imgurl {
    width: 180px;
    height: 135px;
    border: 1px solid #efefef;
    margin-bottom: 12px;
}
.righttag .imgurl img {
    width: 100%;
}
    .checkedIcon,.checkeddan{
        margin-right: .25rem;
        font-size: 14px;
    }
    .checkeddan::before{
        content: "\e7d4";
        color: #dcdfe6;
    }
    .checkeddan.active::before{
        content: "\e65f";
        color: #2cbcc8;
    }
    .checkedIcon.active::before{
        content: "\e67e";
        color: #2cbcc8;
    }
    .cursor{
        cursor: pointer;
    }
    .delete{
        cursor: pointer;
        color: #4DB0E8;
    }
    .NoDatas{
        text-align: center;
        border: 1px solid #eee;
        border-top: none;
    }
    .AddIcon,.SelectedIcon{
        margin-right: 3px;
    }
    .ProductServeAdd .model.serviceClass{
        border-radius: .666667rem;
        border: 1px solid #cccccc;
    }
    .checkStatus {
        margin-right: .25rem;
    }
    .SelectedIcon::before{
        content: "\e6cf";
        color: #4db0e8;
        font-size: 1.333333rem;
    }
    .center{
        text-align:center;
        margin:0 5px;
    }
    .ProductServeAdd{
        background: #fff;
        padding-left: 1rem;
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
    .ProductServeAdd .Cell.TagsClass{
        height: 100%;
    }
    .ProductServeAdd .Cell.TagsClass table{
        border-left: 1px solid#ccc;
        border-top: 1px solid #cccccc;
    }
    .ProductServeAdd .Cell.TagsClass table th,.ProductServeAdd .Cell.TagsClass table td{
        font-size: 1rem;
        background: #fff;
        border-right: 1px solid #cccccc;
        border-bottom: 1px solid #cccccc;
        text-align: center;
        width: 8.333333rem;
        min-width: 6.666667rem;
        position: relative;
    }
    .ProductServeAdd .Cell.TagsClass table th{
        font-size: 1.166667rem;
        font-weight: normal;
        background: #efefef;
        height: 2.5rem;
        line-height: 2.5rem;
    }
    .ProductServeAdd .Cell.TagsClass table td .height{
        position: absolute;
        top: 1rem;
        width: 100%;
    }
    .pleft{
        padding-left: 1rem;
        color: #999;
        max-width: 66%;
        display: inline-block;
    }
    .ProductServeAdd .cancleSure{
        position: relative;
        left: 0;
        top: 0;
    }
    .ProductServeAdd .cancleSure>i{
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
    }
    .ProductServeAddDetail{
        width: 66.666667rem;
    }
    .warings{
        padding-left: 1rem;
        color: #FF5500;
    }
    .ProductServeAdd .tagDetailTitle{
        display: inline-block;
        width: 5rem;
        text-align: right;
    }
    .ProductServeAdd .Statusspan{
        text-align: left;
        padding-left: .833333rem;
    }
    .ProductServeAdd .Cell{
        margin-bottom: 1rem;
        height: 2.5rem;
        line-height: 2.5rem;
    }
    .ProductServeAdd .model{
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        background: #fff;
        z-index: 1000;
        width: 600px;
    }
    .ProductServeAdd .model header{
        margin-bottom: 0;
    }
    .ProductServeAdd .model header .left{
        float: left;
    }
    .ProductServeAdd .model header .right{
        float: right;
    }
    .ProductServeAdd .model .tagDetail{
        padding: 0 18px;
    }
    .ProductServeAdd .model .tagDetail .left{
        float: left;
        width: 48%;
        margin-top: 1rem;
        border-radius: .333333rem;
        
    }
    .ProductServeAdd .model .tagDetail .left.right{
        float: right;
    }
    .ProductServeAdd .model .tagDetail .left{
    float: left;
    width: 48%;
    margin-top: 1rem;
    border-radius: .333333rem;
    max-height: 25rem;
    overflow-y: auto;
}
.ProductServeAdd .model .tagDetail .left .leftUl{
    border: 1px solid #efefef;

}
    .ProductServeAdd .model .tagDetail .left .leftUl ul{
        max-height: 17.5rem;
        overflow-y: auto;
    }
    .ProductServeAdd .model .tagDetail .left .Bottom{
        margin: 1rem 0;
        text-align: right;
        padding-right: 1.666667rem;
    }
    .ProductServeAdd .model .tagDetail .left .Bottom button{
        margin-left: .833333rem;
    }
    .ProductServeAdd .model.tagClass .tagDetail .left{
        max-height: 25rem;
        overflow-y: auto;
    }
    .ProductServeAdd .model .tagDetail .left li{
        height: 2.5rem;
        line-height: 2.5rem;
        border-bottom: 1px solid #eee;
        padding-left: 1rem;
        cursor: pointer;
    }
    .ProductServeAdd .model .tagDetail .left li.active{
        background: #eee;
    }
    .ProductServeAdd .model .tagDetail .left li.tagSort{
        background: #fafafa;
    }
    .ProductServeAdd .model .tagDetail .left li.tagSort i{
        color: #386b88;
        margin:  0 3px;
    }
    .ProductServeAdd .model .tagDetail .left li:last-child{
        border-bottom: none;
    }
    .ProductServeAdd .model .tagDetail .left .right{
        float: right;
    }
    .ProductServeAdd .model .tagDetail .tagSelected{
        padding: 1rem 0;
        border-bottom: 1px dotted #cccccc;
    }
    .ProductServeAdd .model .tagDetail .tagSelected li{
        float: left;
        margin-right: .833333rem;
        border: 1px solid #4db0e8;
        padding: 3px 5px;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
    }
    .ProductServeAdd .model .tagDetail .tagSelected.serviceSelected li{
        border: none;
    }
    .ProductServeAdd .model .tagFooter{
        margin-top: 2rem;
        padding: 1rem;
        text-align: center;
    }
    .ProductServeAdd .model .tagFooter button:last-child{
        margin-left: 24px;
    }
    .ProductServeAdd .choose{
        cursor: pointer;
        color: #4db0e8;
    }
    .ProductServeAdd .Cell .left{
        float: left;
        width: 6rem;
        text-align: right;
        
    }
    .ProductServeAdd .Cell .right{
        float: left;
        position: relative;
    }
    .ProductServeAdd .Tbody  .tag .tagdetail{
        margin-top: 1rem;
    }
    .ProductServeAdd .Tbody  .tag .tagdetail ul{
        display: inline-flex;
    }
    .ProductServeAdd .Tbody  .tag .tagdetail ul li{
        float: left;
        padding: 0 5px;
        margin: 0;
        margin-left: .833333rem;
        text-align: center;
        height: 28px;
        line-height: 2.333333rem;
    }
    .ProductServeAdd .Tbody  .tag .tagdetail ul li:hover .CloseIcon{
        color: #4db0e8;
    }
    .ProductServeAdd .CellFour{
        position: relative;
        left: 0;
        top: 0;
        margin-bottom: 20px;
    }
    .ProductServeAdd .CellFour>li{
        float: left;width: 50%;
        margin-top: 1rem;
        margin-bottom: 1.5rem;
    }
    .ProductServeAdd .CellFour>li .left{
        float: left;
        height: 2.5rem;
        line-height: 2.5rem;
        position: relative;
    }
    .ProductServeAdd .CellFour>p.first{
        position: absolute;
        left: 5rem;
        bottom:48px;
    }
    .ProductServeAdd .CellFour>p.second{
        position: absolute;
        left: 5rem;
        bottom: -10px;
    }
    .ProductServeAdd .Cell .right .footer{
        margin-top: 1rem;
    }
    .ProductServeAdd .Cell .right .footer span{
        margin-left: 1rem;
    }
    .ProductServeAdd .Footer{
        text-align: center;
    padding: 24px 0;
    }
    .ProductServeAdd .Footer button:last-child {
    margin-left: 24px;
}
</style>