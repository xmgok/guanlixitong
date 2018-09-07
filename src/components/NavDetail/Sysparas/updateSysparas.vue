<template>
    <div class="addSysparas">
        <!-- <div>
            <span>参数编号:<input type="text" v-model="datas.paraNo"></span>
            <span>参数名称: <input type="text" v-model="datas.paraName"></span>
            <span>参数值: <input type="text" v-model="datas.paraValue"></span>
        </div>
        <div>
            <span>参数枚举编号: <input type="text" v-model="datas.paraEnum"></span>
            <span>有效机构: <input type="text" v-model="datas.belongOrg"></span>
            <span>参数备注: <input type="text" v-model="datas.paraMemo"></span>
        </div> -->
        <div class="update_sysparas_wrap">
            <header class="header">修改系统参数</header>
            <div class='update_sysparas'>
                <ul class="update_sysparas_content">
                    <li>
                        <span>参数编号:</span>
                        <Input :value="datas.paraNo" :widths='iptWidth' arguName="paraNo" @sonInput="upDatas" />
                    </li>
                    <li>
                        <span>参数名称:</span>
                        <Input :value="datas.paraName" :widths='iptWidth' arguName="paraName" @sonInput="upDatas" />
                    </li>
                    <li>
                        <span>参数值:</span>
                        <Input :value="datas.paraValue" :widths='iptWidth' arguName="paraValue" @sonInput="upDatas" />
                    </li>
                    <li>
                        <span>参数枚举编号:</span>
                        <Input :value="datas.paraEnum" :widths='iptWidth' arguName="paraEnum" @sonInput="upDatas" />
                    </li>
                    <li>
                        <span>有效机构:</span>
                        <Input :value="datas.belongOrg" :widths='iptWidth' arguName="belongOrg" @sonInput="upDatas" />
                    </li>
                    <li>
                        <span>参数备注:</span>
                        <Input :value="datas.paraMemo" :widths='iptWidth' arguName="paraMemo" @sonInput="upDatas" />
                    </li>
                </ul>
                <div class="footer">
                    <!-- <button @click="submit">提交</button>
                    <button @click="cancle">撤销</button> -->
                    <Button Name='提交' @click.native="submit"></Button>
                    <Button Name='取消' @click.native="cancle"></Button>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { Message } from "element-ui";
export default {
    components: { Input, Button },
    data() {
        return {

            iptWidth: "180px",
            datas: {
                paraNo: "",
                paraName: "",
                paraValue: "",
                paraEnum: "",
                belongOrg: "",
                paraMemo: ""
            }
        }
    },
    methods: {
        //input 数据
        upDatas(val, key) {
            this.datas[key] = val;
        },
        //修改
        submit() {
            this.datas.accessToken = this.$getCookie("accessToken");
            this.$post(this.$host+"/api/sysmgr/sysParas/update", this.datas).then(d => {
                if (d.success) {
                    Message({
                        message: '修改成功',
                        type: 'success'
                    });
                }
            })
        },
        //撤销
        cancle() {
            this.$router.push({
                path: "/NavDetail/Arg"
            })
        }
    },
    mounted() {
        let id = this.$route.query.id;
        let that = this;
        this.$post(this.$host+"/api/sysmgr/sysParas/getOne/" + id, { accessToken: this.$getCookie("accessToken") }).then(d => {
            if (d.success) {
                that.datas = d.parasDTO;
            }
        })
    }
}
</script>
<style scoped>
.footer {
  padding-top: 10px;
  text-align: center;
}
.footer button:first-child {
  margin-right: 52px;
}
.addSysparas {
  min-width: 800px;
  margin-top: 1.166667rem;
  border-radius: 4px;
  background-color: #fff;
  padding: 2rem;
}
.header {
  font-size: 20px;
  text-align: center;
  color: #386b88;
  margin-bottom: 14px;
}

/*  */
.update_sysparas {
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid #386b88;
}
.update_sysparas_wrap {
  display: inline-block;
}
.update_sysparas_content {
  margin: 40px;
  margin-right: 60px;
}
.update_sysparas_content span {
  font-size: 14px;
  display: inline-block;
  width: 100px;
}
.update_sysparas_content li {
  margin: 10px 0;
}
</style>