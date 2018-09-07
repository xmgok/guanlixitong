<template>
    <div class="right_content_wrap recent_birthday">
        <div class="right_content">
            <div class="overall_balance">
                <ul class="tklist clearfix">
                    <li v-for="(item,index) in selectDatas" :class="{active:item.active}" @click="toggleSelect(item)">{{item.name}}
                        <i class="icon icongou" v-show="item.active"></i>
                    </li>
                </ul>
            </div>

            <div class="touch_balance">
                <div class="table-wrap">
                    <el-table :data="datas" border style="width: 100%" align='left'>
                        <el-table-column fixed='left' prop="psCode" label="姓名（编号）" width="180">
                            <template slot-scope="scope">
                                {{ scope.row.cName+"("+ scope.row.cCode+")"}}
                            </template>
                        </el-table-column>
                        <el-table-column fixed='left' prop="birthday" label="生日" width="140">
                        </el-table-column>
                        <el-table-column prop="cPhone" label="手机号" width="200">
                        </el-table-column>
                        <el-table-column prop="LevName" label="客户等级" width="140">
                        </el-table-column>

                        <el-table-column prop="sName" label="当前门店" width="140">
                        </el-table-column>
                        <el-table-column prop="validDate" label="当前技师" width="140">
                            <template slot-scope="scope">
                                <el-popover placement="top-start" title="当前技师" width="200" trigger="hover">
                                    <ul>
                                        <li v-for='item in scope.row.empList' :class="{isMain:item.isMain}">{{item.emp}}</li>
                                    </ul>
                                    <div slot="reference">
                                        <span v-for='item in scope.row.empName' :class="{isMain:item.isMain}">{{item.emp}}</span>
                                        <span v-if='scope.row.empList.length>1'>...</span>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remainingDays" label="当前顾问" width="150">
                            <template slot-scope="scope">
                                <el-popover placement="top-start" title="当前顾问" width="200" trigger="hover">
                                    <ul>
                                        <li v-for='item in scope.row.mgrList' :class="{isMain:item.isMain}">{{item.emp}}</li>
                                    </ul>
                                    <div slot="reference">
                                        <span v-for='item in scope.row.mgrName' :class="{isMain:item.isMain}">{{item.emp}}</span>
                                        <span v-if='scope.row.mgrList.length>1'>...</span>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column prop="consumerDays" label="最近消费日期" width="130">
                        </el-table-column>
                        <el-table-column prop="cCustStatus" label="状态" width="100">
                        </el-table-column>
                    </el-table>
                    <div class="pagingwidth">
                        <Paging :handleCurrentChange="getDatas" :total="total" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import Paging from "@/components/common/Paging";
import Button from "@/components/common/Button"
export default {
    components: {
        Button, Paging
    },
    data() {
        return {
            datas: [],
            total: 0,

            selectDatas: [
                {
                    name: '今日',
                    active: false,
                    day: 1,
                },
                {
                    name: '近两天',
                    active: false,
                    day: 2,
                },
                {
                    name: '七天内',
                    active: true,
                    day: 7,
                },
                {
                    name: '本月',
                    active: false,
                    day: 30,
                },
            ]

        }
    },

    methods: {
        toggleSelect(item) {
            this.selectDatas.map(el => {
                el.active = false;
            });
            item.active = true;
            this.getDatas(1, item.day)
        },

        getDatas(index, day) {
            let par = {
                pageNumber: parseInt(index),
                pageSize: 20,
                belongShop: this.$getCookie('belongShop'),
                dept: this.$getCookie('dept'),
                day: day || 7
            }

            this.$post(this.$host + "/api/cust/customer/birthdayPage", par).then(d => {
                if (d.success) {

                    d.data.content.map(el => {
                        if (el.cGbirthday === null && el.cBirthday) {
                            el.birthday = el.cBirthday + "(农历)"
                        } else if (el.cBirthday === null && el.cGbirthday) {
                            el.birthday = el.cGbirthday + "(公历)"
                        } else {
                            el.birthday = '--'
                        }

                        el.empList.length > 0 ? el.empName = [el.empList[0]] : el.empName = [];
                        el.mgrList.length > 0 ? el.mgrName = [el.mgrList[0]] : el.mgrName = [];
                        switch (el.cCustStatus) {
                            case 0: el.cCustStatus = '正常';
                                break;
                            case 1: el.cCustStatus = '休眠';
                                break;
                            case 2: el.cCustStatus = '冻结';
                                break;
                        }

                    });
                    this.datas = d.data.content;
                    this.total = d.data.total;
                }
            });
        },


    },
    mounted() {
        this.getDatas(1)
    }
}
</script>

<style  lang="css" scoped>
@import "../../../../../static/commonStyle.css";
.tklist {
    display: inline-block;
    margin-right: 12px;
}
.tklist li {
    float: left;
    border: 1px solid #efefef;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: relative;
    cursor: pointer;
}
.tklist li.active {
    border: 1px solid #2cbcc8;
    color: #2cbcc8;
}
.icongou::before {
    content: "\E650";
    position: absolute;
    font-size: 36px;
    right: -10px;
    bottom: -9px;
}
.isMain {
    color: red;
}
.overall_balance {
    margin-bottom: 12px;
}
</style>

