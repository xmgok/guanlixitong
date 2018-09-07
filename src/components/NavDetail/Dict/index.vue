<template>
    <div class="Dict">
        <div class="search_wrap">
            <ul>
                <li>
                    字典名称:
                    <Input :value="searchData.dName" arguName="dName" @sonInput="upDatas" />
                </li>
                <li>
                    <Button Name="查询" @click.native="searchDataBtn" Search="true"></Button>
                    <Button Name="重置" @click.native="restDataBtn"  Reset="true"></Button>
                </li>
            </ul>
        </div>
        <div class="tableShow">
            <div class="btn_wrap">
                <Button Name="新增" buttonClass="purple" @click.native="addContact"></Button>
            </div>
            <div class="table_content">
                <el-table :data="datas" ref='eTable' border>
                    <el-table-column width='100' prop="dCode" label="字典编号" fixed="left">
                    </el-table-column>
                    <el-table-column width='220' prop="dName" label="字典名称">
                    </el-table-column>
                    <el-table-column width='140' prop="dValue" label="字典值">
                    </el-table-column>
                    <el-table-column width='100' prop="dKey" label="字典键">
                    </el-table-column>
                    <el-table-column width='230' prop="dKeyname" label="字典健名">
                    </el-table-column>
                    <el-table-column width='120' prop="dIsFixed" label="是否固定">
                        <template slot-scope="scope">
                            {{scope.row.dIsFixed===1?'是':'否'}}
                        </template>
                    </el-table-column>
                    <el-table-column width='140' prop="dParentCode" label="上级字典编号">
                    </el-table-column>
                    <el-table-column fixed='right' label='操作' width='80'>
                        <template slot-scope="scope">
                            <Button  :buttonClass="scope.row.dIsFixed===1?'Btndisabled':'Btn'" Name="修改" small="Btn small" @click.native="updateDict(scope.row,scope.$index)"></Button>
                            <!-- <Button v-else Name="不可修改" small="Btn small" @click.native="updateDict(scope.row,scope.$index)"></Button> -->
                        </template>
                    </el-table-column>
                    <el-table-column min-width='1' fixed='right'>
                    </el-table-column>
                </el-table>
                <div class="pagingwidth">
                    <Paging :handleCurrentChange="handleCurrentChange" :total="total" />
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import Paging from "../../common/Paging"
import { mapMutations, mapState } from "vuex"
import Table from "../../common/Table";
import Input from "../../common/Input";
import Button from "../../common/Button"
export default {
    components: {
        Paging, Table, Button, Input
    },
    data() {
        return {
            Lines: 10,
            pageNum: "",
            //搜索
            searchData: {
                dName: ""
            },
            //iptWidth
            iptWidth: '120px',
            datas: [],

            show: true,
            total: 1,

        }
    },
    methods: {
        selectTr(val) {
            val.isSelected = !val.isSelected;
        },
        //input 数据
        upDatas(val, key) {
            this.searchData[key] = val;
        },
        handleCurrentChange(index) {
            this.goto(index)
        },
        goto(index) {
            let data = {
                "accessToken": this.$getCookie("accessToken"),
                "pageNumber": parseInt(index),
                "pageSize": 20
            }
            this.$post(this.$host + "/api/sysmgr/dict/list", data).then(d => {
                if (d.success) {
                    this.datas = d.list.content;
                    this.total = d.list.total;
                    this.pagesNum = index;
                    if (index > 1) {
                        this.pageNum = index - 1;
                    } else {
                        this.pageNum = '';
                    }
                }
            })
        },
        //新增活动
        addSysparas() {
            this.$router.push({
                path: "/NavDetail/addDict"
            })
        },
        //修改
        updateDict(val) {
            // console.log(id)
            if (val.dIsFixed === 1) {
                this.$message({
                    type: 'warning',
                    duration: '800',
                    message: '字典已固定，禁止修改！'
                });
            } else {
                this.$router.push({
                    path: "/NavDetail/updateDict",
                    query: {
                        id: val.id,
                        update: "update"
                    }
                })
            }

        },
        addContact() {
            this.$router.push({
                path: "/NavDetail/updateDict",
            })
        },
        //删除
        DeleteItem(id, index) {
            this.$delete(this.$host + "/api/sysmgr/dict/delete/" + id, { accessToken: this.$getCookie("accessToken") }).then(d => {
                if (d.success) {
                    let data = {
                        "accessToken": this.$getCookie("accessToken"),
                        "pageNumber": 1,
                        "pageSize": 20
                    }

                    this.getData(data);
                }
            })
        },
        //搜索
        searchDataBtn() {
            let params = {
                accessToken: this.$getCookie("accessToken"),
                pageNumber: 1,
                pageSize: 20
            };
            let objLength = 0;
            let num = 0;
            for (var k in this.searchData) {
                objLength += 1;
                if (Number(this.searchData[k]) == 0) {
                    num += 1;
                } else {
                    params[k] = this.searchData[k];
                };
            }
            if (num == objLength) {
                this.$message.error('请填写搜索信息！');
                return;
            } else {

                this.getData(params);
            }
        },
        //重置按钮
        restDataBtn() {

            this.searchData = {
                dName: ""
            }
        },

        //获取列表
        getData(data) {
            this.$post(this.$host + "/api/sysmgr/dict/list", data).then(d => {
                if (d.success) {
                    d.list.content.map((item, index) => {
                        return item.isSelected = false;
                    })
                    this.datas = d.list.content;
                    this.total = d.list.total;
                }
            })
        },
    },
    mounted() {
        let data = {
            "pageNumber": 1,
            "pageSize": 20
        }

        this.getData(data);
    }
}
</script>
<style scoped>


.btn_wrap {
  margin-bottom: 12px;
}


.add {
  margin-bottom: 12px;
}

@import "../../../../static/commonStyle.css";
/* @import url("../../../assets/Sysparas/Sysparas.css"); */
</style>