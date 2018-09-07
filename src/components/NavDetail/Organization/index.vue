<template>
    <div class="structure" :style="{minHeight:isHeight}" ref="p">
        <div class="tableShow">
            <div class="add">
                <Button Name="新增" buttonClass="purple" @click.native="addContact" :iconadd="true"></Button>
            </div>
            <Table :datas='datas' :TabelHeader="TabelHeader" :update="update" :deleteItem="deleteItem" class="Tableswidth" />
        </div>
    </div>
</template>
<script>
import Button from "../../common/Button";
import Table from "../../common/TableSecond";
import Reminder from "../../common/Reminder";
import { mapMutations } from "vuex";
import Input from "../../common/Input";
export default {
    components: {
        Button, Table, Reminder, Input
    },
    data() {
        return {
            DeleteShow: false,
            datas: [],
            transitionName: 'expand',
            TabelHeader: [
                { detail: "部门编号", width: '300px' },
                { detail: "部门名称", width: '200px' },
                { detail: "操作", width: '200px' },
                { detail: "", width: '' }
            ],
            Tbody: ["cCode", "cName", "cShortName", "cAddr", "cLinkman", "cLinkTel"],
            cCode: "",
            index: "",
            child: "",
            cName: "",
            cLinkTel: "",
            DeletecCode: "",
            Deleteindex: "",
            Deletechild: "",
        }
    },
    computed: {
        isHeight(){
            return (document.documentElement.clientHeight-60)+"px"
        }
    },
    beforeRouteLeave(to, from, next) {//清空存储的部门数据
        this.setDatas({name:"corpsvuex",value:""})
        next();
    },
    methods: {
        ...mapMutations(["setDatas"]),
        ipInput(value) {

        },
        addContact() {
            this.$router.push({
                path: "/NavDetail/addContact"
            })
        },
        toggle(index) {
            this.datas[index].active = !this.datas[index].active;
        },
        update(id) {
            this.$router.push({
                path: "/NavDetail/addContact",
                query: {
                    id: id,
                    update: "update"
                }
            })
        },
        deleteItem(cCode, index, child) {
            let that = this;
            this.$messagebox.confirm('确定删除！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$delete(this.$host+"/api/sysmgr/ccorp/delete/" + cCode, { accessToken: this.$getCookie("accessToken") }).then((d) => {
                    if (d.success) {
                        that.datas.map((v, i) => {
                            if (v.cCode == cCode) {
                                that.datas.splice(i, 1);
                            }
                            that.diguiDelete(v, i)
                        });
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        diguiDelete(value, index) {
            this.$post(this.$host+"/api/sysmgr/ccorp/findAll", {}).then((d) => {
                if (d.success) {
                    let data = d.data;
                    data.map((v, i) => {
                        return v.active = false;
                    });
                    this.datas = data;
                }
            })
        }

    },
    mounted() {
        let that = this;
        this.$post(this.$host+"/api/sysmgr/ccorp/findAll", {}).then((d) => {
            if (d.success) {
                let data = d.data;
                data.map((v, i) => {
                    return v.active = false;
                });
                that.datas = data;
            }
        });
        // this.isHeight=(document.documentElement.clientHeight-this.$refs.p.offsetTop)+"px";
    }
}
</script>
<style scoped>
    .structure{
        /* height: 100%; */
        background: #ffffff;
    }
   .tableShow{
       overflow-x: auto;
   }
.query {
  font-size: 1.166667rem;
  background: #fff;
  height: 4.166667rem;
  line-height: 4.166667rem;
  margin-bottom: 0.833333rem;
  margin-top: 0.833333rem;
  border-radius: 0.25rem;
  padding-left: 1rem;
  display: none;
}
.query > span {
  margin-right: 0.833333rem;
}
.add {
  margin-bottom: 1rem;
}
</style>