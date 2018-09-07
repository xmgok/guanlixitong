<template>
    <div class="search_user">
        <div class="content_model">
            <div>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <td style='width:50px;'></td>
                            <td>角色</td>
                        </tr>
                    </thead>
                    <tbody>

                        <tr v-for="item in allUsers">
                            <td>
                                <!--  -->
                                <!--  -->
                                <!-- v-model='roleName' -->
                                <input type="checkbox" :checked='item.isChecked' @click="handlePush(item)" :value="item.id">
                            </td>
                            <td>{{item.rName}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <Paging :handleCurrentChange="gotoPage" :total="total" />
            </div>
            <div>
                <div>
                    <span> 这里显示已选姓名 </span>
                    <div>

                        <span v-for=' item in selectedName'>
                            {{item.rName}};
                        </span>
                    </div>

                    <!-- {{roleName}} -->
                </div>

                <div>
                    <Button name="确定" @click.native="ensureBtn"></Button>
                    <Button name="返回" @click.native="visible.isShow = false"></Button>
                    <!-- <button @click="goBack">返回</button> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
import Button from "@/components/common/Button";
import { Dialog } from "element-ui";
import Paging from "../../common/Paging";
Vue.use(Dialog);
export default {
    components: {
        Button, Paging
    },
    props: ["visible",],
    data() {
        return {

            //数据总页数
            total: 1,

            //
            // dialogUserVisible: this.isShow,

            //查询所有数据
            allUsers: [{
                id: null,
                uName: "",
                uCode: "",
                uSex: "",
                uTel: "",
                uEmail: "",
                uUpdateUser: "",
                uUpdateTime: ""
            }],

            //
            roleName: [],

            //选中 数据
            selectedNameData: [],

            //选中名
            selectedName: [],

            //后台传值
            backData: [],
        }
    },

    methods: {

        //跳转分页
        gotoPage(index) {
            let data = {
                "accessToken": this.$getCookie("accessToken"),
                "pageNumber": parseInt(index),
                "pageSize": 10
            }
            this.$post(this.$host+"/api/sysmgr/role/allridrname", data).then(d => {
                if (d.success) {
                    this.allUsers = d.data.content;
                    //for(var i =0;i<this.allUsers.length;i++)
                    this.allUsers.map((i) => {
                        i.isChecked = false;
                    })
                }

                for (var key in this.allUsers) {
                    for (var k in this.selectedName) {
                        if (this.selectedName[k].id == this.allUsers[key].id) {
                            this.allUsers[key].isChecked = true;
                            //
                        }
                    }
                }
            });


        },
        //  确定按钮
        ensureBtn() {
            this.visible.isShow = false;
        },

        //选中方法
        handlePush(val) {
            val.isChecked = !val.isChecked;

            if (val.isChecked == true) {
                this.selectedNameData.push(val);
            } else {
                this.selectedNameData.map((item, index) => {
                    if (item.id == val.id) {
                        this.selectedNameData.splice(index, 1)

                    }
                })
            }
            this.backData = []
            this.selectedName = [];
            let p = {

            }

            this.selectedNameData.map((item, index) => {
                this.backData.push({
                    operatorId: "",
                    operator: "",
                })
                p.rName = this.selectedNameData[index].rName;
                p.id = this.selectedNameData[index].id;
                // a.push(p)
                this.selectedName.push(p);
                this.backData[index].operator = this.selectedNameData[index].rName
                this.backData[index].operatorId = this.selectedNameData[index].id
            })


            this.$emit('listenGainBackData', this.backData);
        }
    },

    mounted() {
        let that = this;
        //根据ID查询 流程节点
        let data = {
            accessToken: this.$getCookie("accessToken"),
            pageNumber: 1,
            pageSize: 10
        }
        this.$post(
            this.$host+"/api/sysmgr/role/allridrname",
            data
        ).then(d => {
            if (d.success) {
                this.allUsers = d.data.content;
                this.total = d.data.total;
                console.log(this.total)
                //for(var i =0;i<this.allUsers.length;i++)
                this.allUsers.map((i) => {
                    i.isChecked = false;
                })
            }
            console.log("0000000", this.allUsers)
        });

    }


}
</script>
<style scoped>
.search_user {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}
.content_model {
  width: 60%;
  padding: 30px;
  background-color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
}
table {
  width: 100%;
}
thead {
  font-weight: bold;
}
td {
  border: 0.083333rem solid #888;
  padding: 10px;
}
ul::after {
  content: "";
  clear: both;
  display: block;
}
ul > li {
  float: left;
  margin: 10px;
}
ul > li input {
  border: 1px solid #888;
  padding: 5px;
}
</style>

