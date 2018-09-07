<template>
    <div class="search_user">
        <div class="content">
            <div>
                <table>
                    <thead>
                        <tr>
                            <td></td>
                            <td>姓名</td>
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
                            <td>{{item.uName}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <div>
                    <span> 这里显示已选姓名 </span>
                    <div>
                        {{selectedName.join(";")}}
                        <!-- <span v-for=' item in selectedName'>
                            {{item}};
                        </span> -->
                    </div>

                    <!-- {{roleName}} -->
                </div>
                <div>
                    <Button name="确定" @click.native="ensureBtn"></Button>
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
Vue.use(Dialog);
export default {
    components: {
        Button
    },
    props: ["visible",],
    data() {
        return {

            //判断 checked是否被选中


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
                        this.selectedNameData.splice(index, 1);
                    }
                })
            }
            this.backData = [];
            this.selectedName = [];
            this.selectedNameData.map((item, index) => {
                this.backData.push({
                    operatorId: "",
                    operator: "",
                });
                this.selectedName.push(this.selectedNameData[index].uName);
                this.backData[index].operator = this.selectedNameData[index].uName;
                this.backData[index].operatorId = this.selectedNameData[index].uCode;
            });
            this.$emit('listenGainBackData',this.backData);
        }
    },

    mounted() {
        //根据ID查询 流程节点
        let data = {
            accessToken: this.$getCookie("accessToken"),
            pageNumber: 1,
            pageSize: 10
        }
        this.$post(
            this.$host+"/api/sysmgr/user/query/page",
            data
        ).then(d => {
            if (d.success) {
                this.allUsers = d.pageData.content;
                // for(var i =0;i<this.allUsers.length;i++){}
                this.allUsers.map((i) => {
                    i.isChecked = false;
                })
            }
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
.content {
  width: 60%;
  padding: 30px;
  background-color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  box-shadow: 0 0 0 0 rgba(0,0,0,.3)
}
table {
  width: 100%;
}
thead {
  font-weight: bold;
}
td {
  border: 1px solid #888;
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

