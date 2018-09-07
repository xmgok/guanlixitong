<template>
    <div id='calendar'>

    </div>
</template>
<script>
import $ from 'jquery';
import fullcalendar from "fullcalendar";
import 'fullcalendar-scheduler';
import "fullcalendar/dist/fullcalendar.css";

export default {

    methods: {
        getCal(_that) {
            console.log('>>',_that.minTime)
            $('#calendar').fullCalendar({
                defaultView: 'agendaDay',
                header: {
                    left: 'title myCustomButton',            //上一页、下一页、今天  
                    center: ' prev,next today',     //居中：时间范围区间标题  
                    right: 'agendaDay'    //右边：显示哪些视图  
                },

                // lang: 'zh-cn',
                allDayText: '全天',
                slotDuration: "00:15:00",
                minTime: _that.minTime,           //周/日视图左边时间线显示的最小日期，默认00:00:00  
                maxTime: _that.maxTime,
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                today: ["今天"],
                // day: 'yyyy-MM-dd',
                firstDay: 1,
                timeFormat: 'HH:mm',
                // axisFormat: "24:00:00",
                buttonText: {
                    today: '当天',
                    month: '月',
                    week: '周',
                    day: '日',
                    prev: '上一天',
                    next: '下一天'
                },
                selectable: true,
                resources: _that.resources,
                eventColor: '#579EC8',
                columnHeaderFormat: 'dddd',
                // select: (startDate, endDate, allDay, jsEvent, view) => {
                //     console.log($.fullCalendar.formatDate(startDate, 'yyyy-MM-dd h:mm:ss'))
                //     console.log(startDate)
                // },
                // eventClick: (event) => {//查看事件
                //     console.log(event)
                //     var d = dialog({                        title: "查看教育场地申请", id: "prisonAnaly_detail_dialog", parent: $dialogParent(),
                //         content: '',//"url:${base}/education/eduSiteApply.do?detail&id=" + event.id,
                //         cancelVal: "关闭", cancel: true, width: "500px", height: "300px", lock: true
                //     });
                //     d.showModal();
                // },
                events: _that.events,
            });
        }

    },
    mounted() {
        let _that = this;

        let par = {
            dateDate: _that.$dateFormat('yy-MM-dd', new Date())
        }

        //财务信息
        _that.$post(_that.$host + "/api/cust/dateBill/dateBillKanban", par)        
            .then(d => {
                if (d.success) {
                    let val = d.data;
                    _that.minTime = val.shift.startTime + ':00';
                    _that.maxTime = val.shift.endTime + ":00";
                    _that.events = val.events;
                    _that.resources = val.resources;
                    this.getCal(this)
                }
            });



    },
    data() {
        return {
            minTime: '',
            maxTime: '',
            events: '',
            resources: "",
        }
    },




}








</script>
<style>
.fc-license-message {
  display: none;
}
</style>

