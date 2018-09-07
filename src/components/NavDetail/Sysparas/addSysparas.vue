<template>
        <div class="NewSysparas">
            <h2>新增系统参数</h2>
            <form action="" class="NewSysparas_form">
                <table>
                    <tr>
                        <td>参数编号:<input type="text" name="" placeholder="" v-model="datas.paraNo"/></td>
                        <td>参数名称: <input type="text" name=""  placeholder="" v-model="datas.paraName"/></td>
                        <td>参数值: <input type="text" name=""  placeholder="" v-model="datas.paraValue"/></td>
                    </tr>
                    <tr>
                        <td>参数枚举编号:<input type="text" name="" placeholder="" v-model="datas.paraEnum"/></td>
                        <td>有效机构: <input type="text" name=""  v-model="datas.belongOrg"></td>
                        <td>参数备注: <input type="text" name=""  v-model="datas.paraMemo"></td>
                    </tr>
                </table>
            </form>
            <div><a href="javacript:void(0);" class="sbm" @click="submit">提交</a><a href="javacript:void(0);" class="sbm" @click="cancle">撤销</a></div>
        </div>
      </template>
      
      <script>
      export default {
          data(){
              return{
                datas:{
                    accessToken:this.$getCookie("accessToken"),
                    paraNo:"",
                    paraName:"",
                    paraValue:"",
                    paraEnum:"",
                    belongOrg:"",
                    paraMemo:""
                }
              }
          },
          methods:{
              //添加
            submit(){
                let that=this;
                this.$post(this.$host+"/api/sysmgr/sysParas/add",this.datas).then(d=>{
                    if(d.success){
                        that.cancle();
                    }else{
                        alert(d.respMsg)
                    }
                })
            },
            //撤销
            cancle(){
                this.$router.push({
                    path:"/NavDetail/Arg"
                })
            }
          }
      }
      </script>
      
      <style scoped>
      .NewSysparas{
        width: 95%;
        margin-left: 5%;
      }
      .NewSysparas_form table{
          width: 80%;
          margin:0 auto;
          font-size: 1rem;
      }
      .NewSysparas_form table tr{
          height: 2rem;
      }
      .NewSysparas_form table tr td{
          vertical-align: middle;
      }
      .NewSysparas_form table input{
          border:#ccc solid 1px;
          width: 10rem;
      }
      .NewSysparas_form table select{
          width: 10rem;
          height: 1.5rem;    
      }
      .sbm{
        display: inline-block;
        margin-left:1rem;
        border:#ccc 1px solid;
        padding: .2rem .5rem;
        border-radius: .5rem;
        font-weight: 700;
        font-size: .5rem;
        color: #000;
        background-color: #ccc;
      }
      </style>
      