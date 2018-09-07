<template>
    <div class="searcg_user">
        <div>
            <ul>
                <li>
                    姓名：
                    <input type="text" placeholder="">
                </li>
                <li>
                    职位：
                    <input type="text" placeholder="">
                </li>
                <li>
                    部门或门店：
                    <select name="" id="">
                        <option value="0">门店</option>
                        <option value="1">部门</option>
                    </select>
                </li>
                <li>
                    <input type="text">
                </li>
            </ul>
        </div>
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
                        <td><input type="checkbox" name='userName' v-model='userName' :value="item.uName"></td>
                        <td>{{item.uName}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <div>
                <span> 这里显示已选姓名 </span>
                {{userName.join(";")}}</div>
            <div>
                <button @click="ensureBtn">确定</button>
                <button @click="goBack">返回</button>
            </div>
        </div>

    </div>
</template>
<script>

export default {
    data() {
        return {
            //
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
            userName: []
        }
    },

    methods: {
        //返回
        goBack() {
            history.go(-1)
        },

        //  确定按钮
        ensureBtn(){

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
                console.log(">>>>>", d)
                this.allUsers = d.pageData.content;
            }
        });


    },


}
</script>
<style scoped>
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

