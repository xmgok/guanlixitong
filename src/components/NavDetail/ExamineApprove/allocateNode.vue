<template>
    <div class="right_content_wrap">
        <div class="right_content">
            <div class="btn_wrap">
                <Button v-if='isSee' Name='添加' buttonClass='purple' @click.native="addAllocateNodeBtn()"></Button>
            </div>
            <div class="table_content">
                <el-table :data="allocateNodes" border align='left'>
                    <el-table-column prop="taskCode" label="节点编号" width="220" fixed="left">
                    </el-table-column>
                    <el-table-column prop="taskName" label="节点名称" width="120">
                    </el-table-column>
                    <el-table-column prop="isShop" label="是否门店审批" width="140">
                        <template slot-scope="scope">
                            {{scope.row.isShop==0&&scope.row.isShop!=null?"否":"是"}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="审批模式" width="120">
                        <template slot-scope="scope">
                            {{scope.row.type==1?"串行":"并行"}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="operator" label="审批人" width="120">
                    </el-table-column>
                    <el-table-column prop="sortNum" label="顺序号" width="100">
                    </el-table-column>
                    <el-table-column width="150" label='操作' v-if='isSee'>
                        <template slot-scope="scope">
                            <Button Name='修改' small="Btn small" @click.native="editAllocateNodeBtn(scope.row)"></Button>
                            <i class="cut_off_rule"></i>
                            <Button Name='删除' small="Btn small" @click.native="deleteAllocateNodeBtn(scope.$index,scope.row.id)"></Button>
                        </template>
                    </el-table-column>
                    <el-table-column min-width='1'>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import Button from "../../common/Button";
import Table from "../../common/Table";
import Input from "../../common/Input";
import Select from "../../common/Select";
export default {
    components: { Button, Table, Select, Input },
    data() {
        return {
            isSee: true,
            nowPage: 1,
            //分页总数
            totalPages: 1,

            //配置节点详情
            allocateNodes: [],

            //展示名字 存
            showNameData: [],
            showCodeData: [],

        }
    },

    methods: {
        selectTr(val) {
            val.isSelected = !val.isSelected;
        },
        //添加节点按钮>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        addAllocateNodeBtn() {
            this.$router.push({
                path: "/NavDetail/editNode",
                query: {
                    type: "_add",
                    flowConfigId: this.$route.query.flowConfigId
                }
            });
        },

        //修改 节点按钮
        editAllocateNodeBtn(val) {
            // console.log('>>',val.operatorCode)
            this.$router.push({
                path: "/NavDetail/editNode",
                query: {
                    type: '_update',
                    id: val.id,
                    name: JSON.stringify(val.operator),
                    code: JSON.stringify(val.operatorCode),
                    flowConfigId: this.$route.query.flowConfigId
                }
            });
        },

        //删除节点
        deleteAllocateNodeBtn(key, val) {
            this.$messagebox.confirm('此操作将永久删除该节点, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$delete(
                    this.$host + "/api/sysmgr/flowTaskConfig/delete/" + val,
                    { accessToken: this.$getCookie("accessToken") }
                ).then(d => {
                    if (d.success) {
                        this.$post(
                            this.$host + "/api/sysmgr/flowTaskConfig/list/" + this.$route.query.flowConfigId,
                            { accessToken: this.$getCookie("accessToken") }
                        ).then(d => {
                            if (d.success) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!',
                                    duration: "800",
                                    onClose: () => {
                                    }
                                });
                                this.allocateNodes = d.data;
                            }
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        //返回
        goBack() {
            history.go(-1)
        }

    },

    mounted() {
        if (this.$route.query.type === "_see") {
            this.isSee = false;
        }

        this.$post(
            this.$host + "/api/sysmgr/flowTaskConfig/list/" + this.$route.query.flowConfigId,
            { accessToken: this.$getCookie("accessToken") }
        ).then(d => {
            if (d.success) {

                d.data.map((item, index) => {
                    // let transferData = {}
                    this.showNameData = [];
                    this.showCodeData = []
                    let arr1 = item.operator.split(";");
                    arr1.splice(arr1.length - 1, 1);
                    arr1.map((item, i) => {
                        let arr2 = item.split(":");
                        this.showNameData.push(arr2[0]);
                        this.showCodeData.push(arr2[1]);
                    });
                    d.data[index].operator = this.showNameData.join("；");
                    d.data[index].operatorCode = this.showCodeData;
                    item.isSelected = false;
                });
                this.allocateNodes = d.data;
            }
        });
    },




}
</script>
<style scoped>
@import "../../../../static/commonStyle.css";
.btn_wrap {
    margin-bottom: 1.166667rem;
}
</style>

