<template>
    <div class="get_area" :style="{width:width}">
        <el-cascader :options="options" @change="handleItemChange" :props="props" change-on-select size="mini" :placeholder="defaultArea" clearable :value="values">
        </el-cascader>
    </div>
</template>

<script>
import {mapMutations,mapState} from "vuex"
export default {
    props: {
        defaultArea: {
            default: "请选择"
        },
        width: {
            default: "160px"
        },
        values:{
            type: Array,
            default: function () {
                return []
            }
        }

    },
    data() {
        return {
            aaa: "",
            options: [

            ],
            props: {
                value: 'aCode',
                label: 'aName',
                children: 'childrens'
            },
        }
    },
    computed: {
        ...mapState(["AreaParams"]),
    },
    methods: {
        ...mapMutations(["setDatas"]),
        handleItemChange(val) {
            setTimeout(_ => {
                let lastData = val[val.length - 1];//已选择地区的最后一位 的 code
                let dataParams = {
                    accessToken: this.$getCookie("accessToken"),
                    parentCode: lastData,
                    areaType: val.length
                };
                // if (lastData == 110000 || lastData == 120000 || lastData == 310000 || lastData == 820000 || lastData == 810000) {
                //     dataParams.areaType = 2;
                // }
                if (val.length == 1) {
                    this.options.map((item, index) => {
                        if (item.aCode == lastData && (item.childrens != undefined && item.childrens.length == 0)) {

                            this.$post(this.$host + "/api/sysmgr/getArea ", dataParams).then(d => {
                                if (d.success) {
                                    d.data.map((item) => {
                                        if (lastData != 110000 && lastData != 120000 && lastData != 310000 && lastData != 820000 && lastData != 810000) {
                                            // item.childrens = []
                                            return;
                                        }
                                    })
                                    item.childrens = d.data;
                                    return item;
                                }
                            })
                        }
                    })
                }
                // else {
                //     this.options.map((item) => {
                //         if (item.aCode == val[val.length - 2]) {
                //             item.childrens.map((item) => {
                //                 if (item.aCode == lastData && item.childrens !== undefined) {
                //                     this.$post(this.$host+"/api/sysmgr/getArea ", dataParams).then(d => {
                //                         if (d.success) {
                //                             item.childrens = d.data;
                //                             return item;
                //                         }
                //                     })

                //                 }
                //             })
                //         }
                //     })
                // }

            }, 200);

            //
            this.$emit("getAreaCode", val[val.length - 1])

        },
        rest() {

        }
    },
    mounted() {
        //查询区域 省
        if(!this.AreaParams){
            let getAreaParams = {
                accessToken: this.$getCookie("accessToken"),
                areaType: 0
            };
            this.$post(this.$host + "/api/sysmgr/getArea ", getAreaParams).then(d => {
                if (d.success) {
                    d.data.map((item) => {
                        if (item.aCode != 110000 && item.aCode != 120000 && item.aCode != 310000 && item.aCode != 820000 && item.aCode != 810000) {
                            item.childrens = [];
                        }
                        return item;
                    })
                    this.options = d.data;
                    this.setDatas({name:"AreaParams",value:this.options});
                }
            });
        }else{
            this.AreaParams.map((item) => {
                if (item.aCode != 110000 && item.aCode != 120000 && item.aCode != 310000 && item.aCode != 820000 && item.aCode != 810000) {
                    item.childrens = [];
                }
                return item;
            })
            this.options = this.AreaParams;
        }
    }
}
</script>

<style>
.get_area {
  display: inline-block;
  /* width: 160px;
  height: 26px;
  vertical-align: middle */
}

get_area .el-input .el-input__inner {
  height: 26px !important;
  line-height: 26px;
}

get_area .el-select *{
    vertical-align: top;
}
</style>

