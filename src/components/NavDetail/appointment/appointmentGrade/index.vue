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

    },
    mounted() {

        let _that = this;
        let par = {
            dateDate: this.$dateFormat('yy-MM-dd', new Date())
        }

        //
        _that.$post(_that.$host + "/api/cust/dateBill/dateBillKanban", par)
            .then(d => {
                if (d.success) {
                    let val = d.data;
                    if (val.shift.startTime !== null) {

                        _that.minTime = val.shift.startTime


                    } else {
                        _that.minTime = "09:00"
                    }
                    if (val.shift.endTime !== null) {
                        let date = val.shift.endTime.split(":");
                        let con = Number(date[0]);
                        let num = Number(date[1]) + 15
                        if (num > 60) {
                            num = num - 60;
                            con + 1;
                            if (con > 23) {
                                con = "00"
                            }
                        }
                        _that.maxTime = con + ":" + num
                    } else {
                        _that.maxTime = "22:00"
                    }
                    let arr = ["#F8B651", "#57DBE0", "#F58068", "#88D389"]
                    // let val = d.data;
                    // _that.events = val.events;
                    val.events.map(el => {

                        let num = parseInt(Math.random() * 4, 10)
                        el.color = arr[num]
                    });
                    _that.events = val.events;
                    _that.resources = val.resources;
                    getCal(_that)
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

function formatTen(num) {

    return num > 9 ? num + "" : "0" + num;
}

function dateFormat(format, timestamp) {
    var date = null;
    if (!timestamp) {
        return;
    }
    if (!isNaN(timestamp)) {
        date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        return;
    }
    let Y = date.getFullYear(),
        M = formatTen((date.getMonth() + 1)),
        D = formatTen(date.getDate()),
        h = formatTen(date.getHours()),
        m = formatTen(date.getMinutes()),
        s = formatTen(date.getSeconds()),
        S = date.getMilliseconds()
    if (format == 'yy-MM-dd') {
        return Y + '-' + M + '-' + D
    }
    //   return Y + M + D + h + m + s;
}
let storageDate = dateFormat('yy-MM-dd', new Date());
let cal = $('#calendar').fullCalendar({
    defaultView: 'agendaDay',
    header: {
        left: 'title',            //居中：时间范围
        center: ' prev,next today',       //上一页、下一页、今天  
        right: ''    //右边：显示哪些视图  
    },
    title: 'yyyy-MM-dd',
    // Moment:ISO8601,
    // lang: 'zh-cn',
    allDaySlot: false,
    allDayText: '全天',
    // aspectRatio : 0.85,
    slotDuration: "00:15:00",
    minTime: _that.minTime,           //周/日视图左边时间线显示的最小日期，默认00:00:00  
    maxTime: _that.maxTime,
    monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    monthNamesShort: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    today: ["今天"],
    titleFormat: `YYYY-MM-DD`,
    month: 'MMMM yyyy',                             // September 2009
    week: "MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}",  // Sep 7 - 13 2009
    day: 'dddd, MMM d, yyyy',
    firstDay: 1,
    timeFormat: 'HH:mm',
    eventLimit: true,
    // axisFormat: "24:00:00",
    slotLabelFormat: "HH:mm",
    buttonText: {
        today: '当天',
        month: '月',
        week: '周',
        day: '日',
        prev: '上一天',
        next: '下一天'
    },
    selectable: true,
    handleWindowResize: true,
    refetchResourcesOnNavigate: true,
    events: (start, end, timezone, callback) => {
        let date = _that.$dateFormat('yy-MM-dd', start);
        if (storageDate == date && _that.events) {
            callback(_that.events);
        } else {
            let par = {
                dateDate: _that.$dateFormat('yy-MM-dd', start)
            }
            storageDate = par.dateDate;
            _that.$post(_that.$host + "/api/cust/dateBill/dateBillKanban", par)
                .then(d => {
                    if (d.success) {
                        let arr = ["#F8B651", "#57DBE0", "#F58068", "#88D389"]
                        let val = d.data;
                        val.events.map(el => {
                            let num = parseInt(Math.random() * 4, 10)
                            el.color = arr[num]
                        });
                        _that.events = val.events;
                        _that.resources = val.resources;
                        callback(_that.events);

                    }
                });
        }
    },
    resources: _that.resources,
    // function (callback, start, end, timezone) {
    //     let date = _that.$dateFormat('yy-MM-dd', start);
    //     if (_that.$dateFormat('yy-MM-dd', new Date()) == date && _that.events) {

    //         callback(_that.resources);
    //     } else {
    //         let par = {
    //             dateDate: _that.$dateFormat('yy-MM-dd', start)
    //         }
    //         storageDate = par.dateDate;
    //         _that.$post(_that.$host + "/api/cust/dateBill/dateBillKanban", par)
    //             .then(d => {
    //                 if (d.success) {
    //                     let val = d.data;
    //                     _that.resources = val.resources;
    //                     callback(_that.resources);
    //                 }
    //             });

    //     }
    //     callback(_that.resources);

    // },
    eventColor: '#579EC8',
    columnFormat: 'yyyy-MM-dd',
    columnHeaderFormat: 'dddd',
    select: function (start, end, jsEvent, view, resource) {
        // console.log("↓↓↓select↓↓↓");
        // console.log(jsEvent, resource)
        // console.log("start:" + start + "|end:" + end + "|jsEvent:" + jsEvent + "|view:" + view.title);
        // var title = prompt('Event Title:');
        var eventData;
        console.log(start, end, jsEvent, view, resource)
        // if (title) {
        //     eventData = {
        //         title: title,
        //         start: start,
        //         end: end
        //     };
        //     $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true  
        // }
        // $('#calendar').fullCalendar('unselect');
    }


});
</script>
<style>
.fc-license-message {
    display: none;
}
</style>

