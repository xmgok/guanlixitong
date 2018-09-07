<template>
    <div class="data_import">

        <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
            <el-tab-pane label="门店" name="first">
                <to-import v-model='storeData' apiName='store'></to-import>
                <a href="http://p9256foop.bkt.clouddn.com/%E9%97%A8%E5%BA%97%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx">
                    <Button :icondownload="true" Name="下载门店导入模板"></Button>
                </a>
                <div v-if='storeShow'>
                    <div class="warning_wrap">
                        本次共导入数据：
                        <span class="x_waring">{{storeData.totalSum}}条</span> 成功：
                        <span class="x_waring">{{storeData.successTot}}条</span> 失败：
                        <span class="x_waring">{{storeData.failedTot}}条</span>
                    </div>
                    <div>
                        <el-table :data="storeData.failedMsg" style="width: 100%" stripe>
                            <el-table-column prop="row" label="失败行" width="80">
                                <template slot-scope="scope">
                                    <span class="x_waring">{{scope.row.row}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="msg" label="失败原因" width="180">
                                <template slot-scope="scope">
                                    <span class="x_waring">{{scope.row.msg}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column min-width='1'>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="员工" name="second">
                <to-import v-model='employeeData' apiName='employee'></to-import>
                <a href="http://p9256foop.bkt.clouddn.com/%E5%91%98%E5%B7%A5%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx">
                    <Button :icondownload="true" Name="下载员工导入模板"></Button>
                </a>
                <div v-show='employeeShow'>
                    <div class="warning_wrap">
                        本次共导入数据：
                        <span class="x_waring">{{employeeData.totalSum}}条</span> 成功：
                        <span class="x_waring">{{employeeData.successTot}}条</span> 失败：
                        <span class="x_waring">{{employeeData.failedTot}}条</span>
                    </div>
                    <div>
                        <el-table :data="employeeData.failedMsg" style="width: 100%" stripe>
                            <el-table-column prop="row" label="失败行" width="80">
                                <template slot-scope="scope">
                                    <span class="x_waring">{{scope.row.row}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="msg" label="失败原因" width="180">
                                <template slot-scope="scope">
                                    <span class="x_waring">{{scope.row.msg}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column min-width='1'>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="会员" name="third">
                <to-import v-model='customerData' apiName='customer'></to-import>
                <a href="http://p9256foop.bkt.clouddn.com/%E5%AE%A2%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx">
                    <Button :icondownload="true" Name="下载会员导入模板"></Button>
                </a>
                <div v-show='customerShow'>
                    <div class="warning_wrap">
                        本次共导入数据：
                        <span class="x_waring">{{customerData.totalSum}}条</span> 成功：
                        <span class="x_waring">{{customerData.successTot}}条</span> 失败：
                        <span class="x_waring">{{customerData.failedTot}}条</span>
                    </div>
                    <div v-if='customerData.failedMsg.length>0'>
                        <el-table :data="customerData.failedMsg" style="width: 100%" stripe>
                            <el-table-column prop="row" label="失败行" width="80">
                                <template slot-scope="scope">
                                    <span class="x_waring">{{scope.row.row}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="msg" label="失败原因" width="180">
                                <template slot-scope="scope">
                                    <span class="x_waring">{{scope.row.msg}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column min-width='1'>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="产品" name="fourth">
                <to-import v-model='productData' apiName='serv'></to-import>
                <a href="http://p9256foop.bkt.clouddn.com/%E4%BA%A7%E5%93%81%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx">
                    <Button :icondownload="true" Name="下载产品导入模板"></Button>
                </a>
                <div v-if='productShow'>
                    <div class="warning_wrap">
                        本次共导入数据：
                        <span class="x_waring">{{productData.totalSum}}条</span> 成功：
                        <span class="x_waring">{{productData.successTot}}条</span> 失败：
                        <span class="x_waring">{{productData.failedTot}}条</span>
                    </div>
                    <div>
                        <el-table :data="productData.failedMsg" style="width: 100%" stripe>
                            <el-table-column prop="row" label="失败行" width="80">
                                <template slot-scope="scope">
                                    <span class="x_waring">{{scope.row.row}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="msg" label="失败原因" width="180">
                                <template slot-scope="scope">
                                    <span class="x_waring">{{scope.row.msg}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column min-width='1'>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import ToImport from "@/components/common/toImport";
import Button from "@/components/common/Button";
export default {
    components: { ToImport, Button },
    watch: {
        "customerData": 'getCustomerData',
        "employeeData": 'getEmployeeData',
        "productData": 'getProductData',
        "storeData": 'getStoreData',
    },
    computed: {

    },
    methods: {
        handleClick() {

        },
        msg() {
            this.$message({
                type: "warning",
                message: "失败详情已导出！"
            });
        },

        getEmployeeData(val) {
            if (this.employeeData.failedMsg.length > 0) {
                if (this.employeeData.failedMsg.length > 0) {
                    this.employeeData.failedMsg.map(el => {
                        el.row = "第" + el.row + "行"
                    })
                    this.expExl(this.employeeData.failedMsg, '员工导入失败列表');
                    this.msg()
                }
            }
            this.employeeShow = true;
        },
        getCustomerData() {
            if (this.customerData.failedMsg.length > 0) {
                this.customerData.failedMsg.map(el => {
                    el.row = "第" + el.row + "行"
                })
                this.expExl(this.customerData.failedMsg, '会员导入失败列表')
                this.msg()
            }
            this.customerShow = true;
        },
        getProductData() {
            if (this.productData.failedMsg.length > 0) {
                this.productData.failedMsg.map(el => {
                    el.row = "第" + el.row + "行"
                })
                this.expExl(this.productData.failedMsg, '产品导入失败列表')
                this.msg()
            }
            this.productShow = true;
        },
        getStoreData() {
            if (this.storeData.failedMsg.length > 0) {
                this.storeData.failedMsg.map(el => {
                    el.row = "第" + el.row + "行"
                });
                this.expExl(this.storeData.failedMsg, '门店导入失败列表');
                this.msg()
            }
            this.productShow = true;

        },
        expExl(val, name) {
            this.$exportExcel(this.arr1, this.arr2, val, name);
        },
    },
    mounted() {

    },
    data() {
        return {
            arr1: ['失败行', '失败原因',],
            arr2: ['row', 'msg',],
            activeTab: 'second',
            storeData: {
                failedMsg: [],
                failedTot: '',
                respCode: '',
                respMsg: '',
                success: '',
                successTot: '',
                totalSum: '',
            },
            employeeData: {
                failedMsg: [],
                failedTot: '',
                respCode: '',
                respMsg: '',
                success: '',
                successTot: '',
                totalSum: '',
            },
            customerData: {
                failedMsg: [],
                failedTot: '',
                respCode: '',
                respMsg: '',
                success: '',
                successTot: '',
                totalSum: '',
            },
            productData: {
                failedMsg: [],
                failedTot: '',
                respCode: '',
                respMsg: '',
                success: '',
                successTot: '',
                totalSum: '',
            },
            storeShow: false,
            employeeShow: false,
            customerShow: false,
            productShow: false,

        }
    },

}
</script>

<style scoped>
.warning_wrap .x_waring {
    display: inline-block;
    margin-right: 24px;
}
.warning_wrap {
    padding: 12px 0;
}
a {
    display: inline-block;
}
</style>
<style>
.data_import .el-tabs__item {
    height: 32px;
    line-height: 32px;
}
</style>


