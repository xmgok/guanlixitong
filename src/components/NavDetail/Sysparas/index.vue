<template>
    <div class="Sysparas">
        <div class="search_wrap">
            参数名称:
            <Input :value="searchParamsData.paraName" :widths='iptWidth' arguName="paraName" @sonInput="upDatas" />
            <Button Name='查询' buttonClass='purple' @click.native="searchParams"></Button>
            <Button Name='重置' buttonClass='purple' @click.native="cancleSearchParams"></Button>
            <!-- <Button Name='高级' buttonClass='purple'></Button> -->
            <!-- @click.native="queryFlow" -->
        </div>
        <div class="right_content">
            <div class="tableShow">
                <Table  :TabelHeader="TabelHeader" :Tbody="Tbody" :datas="datas" :update="update" :deleteItem="deleteItem" :NoDo="true" :widthValue="'60%'" :PageNum="PageNum" />
                <div class="pagingwidth">
                    <Paging :handleCurrentChange="handleCurrentChange" :total="total" />
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import "@/../static/commonStyle.css";
import Paging from "../../common/Paging"
import { mapMutations, mapState } from "vuex";
import Table from "../../common/Table";
import Button from "../../common/Button"
import Input from "@/components/common/Input";
export default {
    components: {
        Paging,
        Table,
        Button,
        Input
    },
    data() {
        return {
            TabelHeader: [
                { detail: "序号", width: "50px" },
                { detail: "参数编号", width: "6.67rem" },
                { detail: "参数名称", width: "" },
                { detail: "参数值", width: "5rem" },
                { detail: "参数枚举编号", width: "120px" },
                { detail: "有效机构", width: "8rem" },
                { detail: "", width: "8rem" }
            ],
            Tbody: ["paraNo", "paraName", "paraValue", "paraEnum", "updateTime"],
            datas: [],
            totalPages: 4,
            show: false,
            total: 1,
            PageNum: "",
            //搜索
            searchParamsData: {
                paraName: ''
            },
            iptWidth: '120px'
        }
    },
    methods: {
        handleCurrentChange(index) {
            this.goto(index);
        },
        ...mapMutations(["getSysparas"]),
        goto(index) {//分页的 跳转到那一页
            let data = {
                "accessToken": this.$getCookie("accessToken"),
                "pageNo": parseInt(index),
                "pageSize": 10
            }
            this.$post(this.$host+"/api/sysmgr/sysParas/list", data).then(d => {
                if (d.success) {
                    this.datas = d.list.content;
                    // 处理分页的序号问题
                    if (index > 1) {//第二页
                        this.PageNum = index - 1;
                    } else {//第一页
                        this.PageNum = "";
                    }
                }
            })
        },
        upDatas(val, key) {
            this.searchParamsData[key] = val;
        },
        //    修改
        update(id) {
            console.log(id)
            this.$router.push({
                path: "/NavDetail/updateSysparas",
                query: {
                    id: id.id
                }
            })
        },
        deleteItem(id, index) {
            let that = this;
            this.$delete(this.$host+"/api/sysmgr/sysParas/delete/" + id, {}).then((d) => {
                if (d.success) {
                    that.datas.splice(index, 1);
                }
            })
        },

        //搜索
        searchParams() {
            let params = {
                accessToken: this.$getCookie("accessToken"),
                pageNo: 1,
                pageSize: 10
            };
            let objLength = 0;
            let num = 0;
            for (var k in this.searchParamsData) {
                objLength += 1;
                if (Number(this.searchParamsData[k]) == 0) {
                    num += 1;
                } else {
                    params[k] = this.searchParamsData[k];
                };
            }
            if (num == objLength) {
                return;
            } else {
                this.$post(this.$host+"/api/sysmgr/sysParas/list", params).then(d => {
                    if (d.success) {
                        this.datas = d.list.content;
                        this.total = d.list.total;
                    }
                })
            }

        },
        //重置搜索
        cancleSearchParams() {
            let objLength = 0;
            let num = 0;
            for (var key in this.searchParamsData) {
                objLength += 1;
                if (Number(this.searchParamsData[key]) !== 0) {
                    num = 0;
                } else {
                    num += 1;
                }
            }
            if (num == objLength) {
                return;
            } else {
                this.searchParamsData = {
                    paraName: ''
                };
                let params = {
                    accessToken: this.$getCookie("accessToken"),
                    pageNo: 1,
                    pageSize: 10
                }
                //获取全部参数
                this.$post(this.$host+"/api/sysmgr/sysParas/list", params).then(d => {
                    if (d.success) {
                        this.datas = d.list.content;
                        this.total = d.list.total;
                    }
                })
            }
        },
    },
    mounted() {
        let that = this;
        let data = {
            "accessToken": this.$getCookie("accessToken"),
            "pageNo": 1,
            "pageSize": 10
        }
        this.$post(this.$host+"/api/sysmgr/sysParas/list", data).then(d => {
            if (d.success) {
                that.datas = d.list.content;
                that.total = d.list.total;
            }
        })
    }
}

</script>
<style scoped>
.query {
  font-size: 1.166667rem;
  background: #fff;
  height: 4.166667rem;
  line-height: 4.166667rem;
  margin-bottom: 0.833333rem;
  margin-top: 0.833333rem;
  border-radius: 0.25rem;
  padding-left: 1rem;
}
/* .tableShow{
        background: #ffffff;
        height: 100vh;
        padding:0 1rem;
        padding-top: 1.666667rem;
    } */
.pagingwidth {
  text-align: center;
  width: 60%;
}
</style>
