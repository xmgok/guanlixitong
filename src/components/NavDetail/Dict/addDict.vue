<template>
    <div class="NewDict">
        <h2>新增数据字典</h2>
        <form action="" class="NewDict_form">
            <table>
                <tr>
                    <td>字典编号:<input class="x_input" type="text" name="" placeholder="" v-model="datas.dCode" /></td>
                    <td>字典名称: <input class="x_input" type="text" name="" placeholder="" v-model="datas.dName" /></td>
                    <td>字典分类: <input class="x_input" type="text" name="" placeholder="" v-model="datas.dType" /></td>
                </tr>
                <tr>
                    <td>字典健:<input class="x_input" type="text" name="" placeholder="" v-model="datas.dKey" /></td>
                    <td>字典健名: <input class="x_input" type="text" name="" v-model="datas.dKeyname"></td>
                    <td>字典值: <input class="x_input" type="text" name="" v-model="datas.dValue"></td>
                </tr>
                <tr>
                    <td>是否固定:<input class="x_input" type="text" name="" placeholder="" v-model="datas.dIsFixed" /></td>
                    <td>上级字典编号: <input class="x_input" type="text" name="" v-model="datas.dParentCode"></td>
                </tr>
            </table>
        </form>
        <div>
            <a href="javacript:void(0);" class="sbm" @click="submit">提交</a>
            <a href="javacript:void(0);" class="sbm" @click="cancle">撤销</a>
        </div>
    </div>
</template>
      
      <script>
export default {
    data() {
        return {
            datas: {
                accessToken: this.$getCookie("accessToken"),
                dCode: "",
                dName: "",
                dType: "",
                dKey: "",
                dKeyname: "",
                dValue: "",
                dIsFixed: "",
                dParentCode: ""
            }
        }
    },
    methods: {
        //添加
        submit() {
            if (this.$stop()) { return }
            let that = this;
            this.datas.dIsFixed = parseInt(this.datas.dIsFixed);
            this.datas.dType = parseInt(this.datas.dType);
            this.$post(this.$host + "/api/sysmgr/dict/add", this.datas).then(d => {
                if (d.success) {
                    this.$message({
                        type: "success",
                        message: "新增成功",
                        duration: "800",
                        onClose: this.cancle()
                    })
                    that.cancle();
                } else {
                    alert(d.respMsg)
                }
            })
        },
        //撤销
        cancle() {
            this.$router.push({
                path: "/NavDetail/Base"
            })
        }
    },
    mounted() {

    }
}
</script>
      
      <style scoped>
.NewDict {
  width: 95%;
  margin-left: 5%;
}
.NewDict_form table {
  width: 80%;
  margin: 0 auto;
  font-size: 1rem;
}
.NewDict_form table tr {
  height: 2rem;
}
.NewDict_form table tr td {
  vertical-align: middle;
}
.NewDict_form table input {
  border: #ccc solid 1px;
  width: 10rem;
}
.NewDict_form table select {
  width: 10rem;
  height: 1.5rem;
}
.sbm {
  display: inline-block;
  margin-left: 1rem;
  border: #ccc 1px solid;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.5rem;
  color: #000;
  background-color: #ccc;
}
</style>
      