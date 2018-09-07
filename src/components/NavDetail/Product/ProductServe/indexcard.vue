<template>
    <div class="ProductServe">
        <!-- 查询头部 -->
        <header class="search-wraps">
            <ul>
                <li>
                    <span>输入搜索：</span>
                    <Input placeholder="产品编号/名称" :value="codeOrName" arguName="codeOrName" @sonInput="upInput" />
                </li>
                <li>
                    <span>产品分类：</span>
                    <ProductTag @sonSelectcode="upProductSelect" :values="tagArr" />
                </li>
                <li>
                    <span>护理时长：</span>
                    <Input placeholder="请输入" :value="psServTime" arguName="psServTime" @sonInput="upInput" />
                    <span> 分钟</span>
                </li>
                <li>
                    <span>上架状态：</span>
                    <Select :SelecttemData="SelecttemStatus" :values="psStatus" arguName="psStatus" :SelecttemDetail="['key','value']" @sonSelect="upSelect" :widths="'160px'" />
                </li>
                <li>
                    <span>有效状态：</span>
                    <Select :SelecttemData="paValidStatusData" :values="paValidStatus" arguName="paValidStatus" :SelecttemDetail="['key','value']" @sonSelect="upSelect" :widths="'160px'" />
                </li>
                <li>
                    <Button Name="查询" @click.native="demand(1)" buttonClass="header" Search="true" />
                    <Button Name="重置" @click.native="reset" buttonClass="header" Reset="true" />
                </li>
            </ul>
        </header>
        <div class="zhuti">
            <!-- 功能头部 -->
            <header class="funcHeader clearfix">
                <ul class="left">
                    <li @click="productAdd" v-if="addShow">
                        <Button Name="新增" :iconadd="true" />
                    </li>
                    <li class="marRight" v-if="tostoreShow" @click="gotoStore">产品适用门店</li>
                    <li class="marRight" v-if="toruleShow" @click="gotoRule">产品规则管理</li>
                    <li class="marRight" v-if="topriceShow" @click="gotoPrice">产品价格管理</li>

                </ul>
            </header>
            <!-- 列表详情List -->
            <el-table :data="datas" border style="width:100%" >
                <el-table-column fixed prop="psCode" label="编号" width="120"></el-table-column>
                <el-table-column prop="psName" label="产品名称" width="200"></el-table-column>
                <el-table-column prop="psPrice" label="价格(￥)" width="120"></el-table-column>
                <el-table-column prop="psServTime" label="护理时长(分钟)" width="150"></el-table-column>
                <el-table-column prop="psValidTime" label="生效日期" width="120"></el-table-column>
                <el-table-column prop="psInvalidTime" label="停用日期" width="120"></el-table-column>
                <el-table-column prop="psStatus" label="上架状态" width="120"></el-table-column>
                <el-table-column prop="paValidStatus" label="有效状态" width="120"></el-table-column>
                <el-table-column fixed="right" label="操作" width="250">
                    <template slot-scope="scope" class="">
                        <div class="rtext">
                            <Button Name="查看" buttonClass="Btn" @click.native="demandFuncId(scope.row,scope.$index)" />
                            <i class="borderLeft" v-show="editShow"></i>
                            <Button Name="修改" buttonClass="Btn" v-if="editShow" @click.native="update(scope.row,scope.$index)" />
                            <i class="borderLeft" v-if="scope.row.editShow&&toupdownShow"></i>
                            <Button :Name="scope.row.editName" buttonClass="Btn" v-if="scope.row.editShow&&toupdownShow" @click.native="editFunc(scope.row,scope.$index)" />
                            <i class="borderLeft" v-if="deleteShow"></i>
                            <Button Name="删除" buttonClass="Btn" @click.native="deleteItem(scope.row,scope.$index)" v-if="deleteShow" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" min-width='1'></el-table-column>
            </el-table>
            <Paging :handleCurrentChange="demand" :total="total" class="pagingwidth" />
            <div class="model" v-show="modelShow">
                <header class="Header clearfix">
                    <div class="left">重新上架</div>
                    <div class="right">
                        <i class="icon iconclose" @click="cancle"></i>
                    </div>
                </header>
                <div class="modeldetail">
                    该产品已下架，您确定要将它重新上架？ 您需要重新设定该产品的自动下架和停用日期 如若不填，则按空值处理
                    <div class="date">
                        下架日期：
                        <TakeTimePiker arguName="psOffShelf" @clickTakeTimePiker="upDatePiker" />
                    </div>
                </div>
                <div class="footer">
                    <Button Name="取消" @click.native="cancle" buttonClass="None" />
                    <Button Name="确定" @click.native="sureEditFunc" />
                </div>
            </div>
        </div>
        <MTK v-show="modelShow" />
    </div>
</template>
<script>
import Select from "../../../common/Select";
import Input from "../../../common/Input";
import Table from "../../../common/Table";
import Button from "../../../common/Button";
import Paging from "../../../common/Paging";
import TakeTimePiker from "../../../common/TakeTimePiker";
import MTK from "../../../common/Mtk";
// import ToImport from "@/components/common/ToImport";
export default {
    components: {
        Table, Input, Select, Button, Paging, TakeTimePiker, MTK, ProductTag: resolve => { require(['../../../common/ProductTag'], resolve) },
    },
    data() {
        return {
            tagArr: [],
            addShow: false,//新增权限
            editShow: false,//修改权限
            deleteShow: false,//删除权限
            toupdownShow: false,//上下架权限
            tostoreShow: false,//产品适用门店权限
            toruleShow: false,//产品规则管理权限
            topriceShow: false,//产品价格管理权限
            ProductName: "",
            ProductShow: false,
            CloseStatus: false,
            Cliked: false,
            CategoryList: [],//产品分类的数据
            modelShow: false,
            demandShow: true,
            widths: "120px",
            product: "",
            SelecttemType: [],//产品分类数据
            SelecttemDuration: [],//护理时长数据
            SelecttemStatus: [
                { key: 0, value: "未上架" },
                { key: 1, value: "已上架" },
                { key: 2, value: "已下架" }
            ],//状态数据
            TabelHeader: [
                { detail: "编号", width: "100px" },
                { detail: "产品名称", width: "250px" },
                { detail: "价格", width: "100px" },
                { detail: "护理时长", width: "100px" },
                { detail: "生效日期", width: "100px" },
                { detail: "停用日期", width: "100px" },
                { detail: "状态", width: "100px" },
                { detail: "", width: "250px" },
            ],
            Tbody: ["psCode", "psName", "psPrice", "psServTime", "psValidTime", "psInvalidTime", "psStatus"],
            datas: [],
            total: 0,
            codeOrName: "",//产品编号/名称
            cateId: "",//产品分类（产品类别id）
            psServTime: "",//护理时长
            psStatus: "",//上下架状态
            productId: "",//产品id
            index: "",//索引
            psOffShelf: "",//下架时间
            ThCheckAll: false,
            batchDatasId: [],
            batchDatas: [],
            paValidStatusData: [
                { key: 0, value: "未生效" },
                { key: 1, value: "已生效" },
                { key: 2, value: "已失效" }
            ],
            paValidStatus: "",
            pageNumber:1,
        }
    },
    methods: {
        // 产品套卡适用门店
        gotoStore() {
            this.$router.push({
                path: "/NavDetail/Fitstore",
                query:{prodClass:1},
            })
        },
        // 产品套卡规则管理
        gotoRule() {
            this.$router.push({
                path: "/NavDetail/productCard"
            })
        },
        // 产品套卡价格管理
        gotoPrice() {
            this.$router.push({
                path: "/NavDetail/priceControl",
                query: {
                    num: 1,
                }
            })
        },
        showHide(e) {
            console.log(e);
            // this.ProductShow=!this.ProductShow;
        },
        upClear() {
            this.ProductName = "";
            this.cateId = "";
        },
        //选择产品分类
        upProductSelect(id) {
            console.log(id)
            this.cateId = id;
            this.showProductFunc();
        },
        showProductFunc() {
            this.Cliked = !this.Cliked;
            this.ProductShow = !this.ProductShow;
        },
        IconshowProductFunc() {

            if (this.CloseStatus) {
                this.ProductName = "";
                this.cateId = "";
                this.Cliked = false;
                this.CloseStatus = false;
                return;
            }
            this.showProductFunc();
        },
        // 添加产品
        productAdd() {
            //添加产品套卡
            this.$router.push({
                path: "/NavDetail/ProductServe/ProductCardAdd"
            })

        },
        upDatePiker(value, arguName) {
            this[arguName] = value;
        },
        // 查看
        demandFuncId(item) {
            //查看产品套卡
            this.$router.push({
                path: "/NavDetail/ProductServe/ProductCardAdd",
                query: {
                    id: item.id,
                    detail: "detail"
                }
            })

        },
        // 上下架
        editFunc(item, index) {
            if (item.psStatus == "未上架") {//未上架的立即上架
                this.$post(this.$host + "/api/prod/prtcard/up", { id: item.id }).then(d => {
                    if (d.success) {
                        this.$message({
                            type: "success",
                            message: "该产品已上架成功"
                        });
                        this.datas[index].psStatus = "已上架";
                        this.datas[index].editName = "下架";
                    }
                })
            } else if (item.psStatus == "已上架") {//已上架的立即下架
                this.$post(this.$host + "/api/prod/prtcard/down", { id: item.id }).then(d => {
                    if (d.success) {
                        if (d.success) {
                            this.$message({
                                type: "success",
                                message: "该产品已下架成功"
                            });
                            this.datas[index].psStatus = "已下架";
                            this.datas[index].editName = "上架";
                        }
                    }
                })
            } else {//已下架的上架操作（弹框）
                this.modelShow = true;
                this.productId = item.id;
                this.index = index;

            }
        },
        //已下架的重新上架（确定）
        sureEditFunc() {
            let data = {
                id: this.productId,
                psOffShelf: this.psOffShelf ? (this.psOffShelf + " 00:00:00") : this.psOffShelf
            }
            this.$post(this.$host + "/api/prod/prtcard/up", data).then(d => {
                if (d.success) {
                    this.psOffShelf = "";
                    this.$message({
                        type: "success",
                        message: "该产品已上架成功"
                    });
                    this.datas[this.index].psStatus = "已上架";
                    this.datas[this.index].editName = "下架";
                    this.cancle();
                }
            })
        },
        // 取消上架
        cancle() {
            this.modelShow = false;
            this.productId = "";
            this.index = "";
        },
        upInput(value, arguName) {
            this[arguName] = value;
        },
        upSelect(value, arguName) {
            this[arguName] = value;
            console.log(value)
        },
        // 修改
        update(item) {
            //修改产品套卡
            this.$router.push({
                path: "/NavDetail/ProductServe/ProductCardAdd",
                query: {
                    id: item.id,
                    update: "update"
                }
            })
        },
        // 删除
        deleteItem(item, index) {
            if(item.psStatus=='已上架'){
                 this.$message({
                    type: 'info',
                    message: '请先下架产品，再进行删除操作!',
                });
                return
            }
            this.$messagebox.confirm('确定删除' + item.psCode + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$post(this.$host + "/api/prod/prtserv/delete", { id: item.id }).then(d => {
                    if (d.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                            duration: "800",
                            onClose: () => {
                                if(this.datas.length==1){//当前页就一条数据
                                    if(this.pageNumber==1){//当前页就是第一页
                                        this.datas.splice(index,1)
                                        this.total--;
                                    }else{
                                        this.pageNumber--;
                                        this.demandAll(this.pageNumber);
                                    }
                                }else{
                                    this.demandAll(this.pageNumber);
                                }
                            }
                        })
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 重置
        reset() {
            this.codeOrName = "";
            this.cateId = "";
            this.psServTime = "";
            this.psStatus = "";
            this.ProductName = "";
            this.paValidStatus = "";
            this.tagArr = [];
        },
        demand(index){
            this.pageNumber=index;
            this.demandAll(index)
        },
        demandAll(index) {
            //套卡
            let data = {
                pageNumber: index||1,
                pageSize: 20,
                codeOrName: this.codeOrName,//产品编号/名称
                cateId: this.cateId,//产品分类（产品类别id）
                psServTime: this.psServTime,//护理时长
                psStatus: this.psStatus,//上下架状态
                paValidStatus: this.paValidStatus,//有效状态
            }
            this.$post(this.$host + "/api/prod/prtcard/page", data).then(d => {
                if (d.success) {
                    let content = d.data.content;
                    content.map(el => {
                        switch (el.psStatus) {
                            case 0: el.psStatus = "未上架"; el.editName = "上架"; break;
                            case 1: el.psStatus = "已上架"; el.editName = "下架"; break;
                            case 2: el.psStatus = "已下架"; el.editName = "上架"; break;
                        };
                        switch (el.paValidStatus) {
                            case 0: el.paValidStatus = "未生效"; el.editShow = false; break;
                            case 1: el.paValidStatus = "已生效"; el.editShow = true; break;
                            case 2: el.paValidStatus = "已失效"; el.editShow = false; break;
                            default: el.paValidStatus = "已生效"; el.editShow = true; break;
                        };
                        el.checked = false;
                        el.psValidTime = this.$dateFormat("yy-MM-dd", el.psValidTime);//生效日期
                        el.psInvalidTime = this.$dateFormat("yy-MM-dd", el.psInvalidTime);//失效日期
                    });
                    this.datas = content;
                    this.total = d.data.total;
                }
            })
        },
        // 获取产品分类的数据
        getCategoryList() {
            this.$post(this.$host + "/api/prod/productcate/tree", {}).then(d => {
                if (d.success) {
                    this.CategoryList = d.list;
                }
            })
        }
    },
    mounted() {
        this.demandAll();
        // this.getCategoryList();
        let auths = JSON.parse(this.$getSession("auths"));
        auths.map(el => {
            if (el.fParentCode == "F023") {//产品服务的权限
                if (el.fUrl == "add") {
                    this.addShow = true;
                }
                if (el.fUrl == "edit") {
                    this.editShow = true;
                }
                if (el.fUrl == "delete") {
                    this.deleteShow = true;
                }
                if (el.fUrl == "toupdown") {
                    this.toupdownShow = true;
                }
                if (el.fUrl == "tostore") {
                    this.tostoreShow = true;
                }
                if (el.fUrl == "torule") {
                    this.toruleShow = true;
                }
                if (el.fUrl == "toprice") {
                    this.topriceShow = true;
                }

            }
        })
    }
}
</script>
<style scoped>
.zhuti {
}
.overflower {
    overflow: auto;
}
.ProductClass {
    position: absolute;
    left: 5.583333rem;
    top: 2.666667rem;
    z-index: 3000;
    width: 20.833333rem;
    background: #ffffff;
    border-radius: 0.333333rem;
}
.ProductSelect {
    position: absolute;
    right: 1.2rem;
    top: 0.75rem;
    width: 8px;
    height: 8px;
    border-right: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
    transform: rotate(45deg);
    cursor: pointer;
    transition: all 0.2s linear;
    transform-origin: 75% 75%;
}
.ProductSelect.Cliked {
    transform: rotate(-135deg);
}
.ProductSelect.CloseStatus {
    position: absolute;
    right: 1.2rem;
    top: 0.416667rem;
    width: 8px;
    height: 8px;
    cursor: pointer;
    border-right: none;
    border-bottom: none;
    transform: rotate(0deg);
}
.ProductSelect.CloseStatus::before {
    content: "\e613";
}
.curor {
    cursor: pointer;
}

.ProductServe .demandHeader .Cell {
    float: left;
    margin-right: 1rem;
    vertical-align: middle;
    position: relative;
    height: 2.5rem;
    line-height: 2.5rem;
}
.ProductServe .demandHeader .Cell button {
    margin-left: 1rem;
}
.ProductServe .model {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 0.333333rem;
    width: 33.333333rem;
    z-index: 1000;
}
.ProductServe .model header {
}
.ProductServe .model {
}
.ProductServe .model .modeldetail {
    width: 300px;
    margin: 0 auto;
    padding: 1rem 0;
}
.ProductServe .model .modeldetail .date {
    margin-top: 1rem;
}
.ProductServe .model .footer {
    text-align: center;
    padding: 1.166667rem;
}
.ProductServe .model .footer button:last-child {
    margin-left: 24px;
}
.ProductServe .funcHeader {
    padding: 1rem 0px;
}
.ProductServe .funcHeader .left {
    float: left;
}
.ProductServe .funcHeader .right {
    float: right;
}
.ProductServe .funcHeader .left li {
    float: left;
    margin-right: 1rem;
    cursor: pointer;
    color: #1dade2;
    font-size: 1.166667rem;
}
.ProductServe .funcHeader .left li.marRight {
    margin-right: 1rem;
    height: 2.166667rem;
    line-height: 2.166667rem;
}
</style>