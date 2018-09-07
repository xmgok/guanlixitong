import axios from "axios";
import router from '../router/index';
import store from "../store/store";
import Vue from 'vue'
import {
  MessageBox,
  Message,
  Loading,
  Alert
} from 'element-ui';
const $a = {};
axios.defaults.timeout = 10000;
axios.defaults.baseURL = "";
console.log(process.env)
// var this.$host='';
// if(process.env.NODE_ENV=="development"){
//   this.$host = "http://192.168.31.146:8080";
// }else if(process.env.NODE_ENV=="production"){
//   this.$host = "http://192.168.31.156:80";
// }
// http request 拦截器
axios.interceptors.request.use(
  config => {
    const token = $a.getCookie('accessToken'); //注意使用的时候需要引入cookie方法，推荐js-cookie
    config.headers = {
      'Content-Type': 'application/json;charset=UTF-8'
      // 'Content-Type': 'application/x-www-form-urlencoded'
    }
    store.commit("MTKshow");
    // 加载中
    // let loadingInstance=Loading.service({
    //   lock: true,
    //   text: 'Loading',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.8)'
    // });
    // setTimeout(() => {
    //   loadingInstance.close();
    // }, 800);
    if (token) {
      config.data.accessToken = token;
    } else {
      //去登录
      //   router.replace({
      //       path:"/aa"
      //   })
    }
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {
    // let loadingInstance = Loading.service();
    // Vue.nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
    //   loadingInstance.close();
    // });
    store.commit("MTKhide");
    let data = response.data;
    switch (data.respCode) {
      case "M0002":
      case "E0006":
      case "1000":
        $a.clearCookie("accessToken");
        // $a.clearCookie("auths");
        router.replace({
          path: "/"
        });
        break;
      case "0001": //数据库处理失败
        // console.log("网络异常");
        Message({
          type: "error",
          message: data.respMsg
        })
        break;
      default: //其他弹出提示部分
        if (data.respCode) {
          if (data.respCode.slice(0, 1) == "E") {
            // store.commit("ReminderShowFunc",data.respMsg);
            // $a.alertF(data.respMsg, "")
            Message({
              type: "error",
              message: data.respMsg
            })
            break;
          } else {
            break;
          }
        }


    }
    return response;
  },
  err => {
    store.commit("MTKhide");
    //网络异常/服务器宕机
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break

      case 401:
        err.message = '未授权，请登录'
        break

      case 403:
        err.message = '拒绝访问'
        break

      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break

      case 408:
        err.message = '请求超时'
        break

      case 500:
        err.message = '服务器内部错误'
        break

      case 501:
        err.message = '服务未实现'
        break

      case 502:
        err.message = '网关错误'
        break

      case 503:
        err.message = '服务不可用'
        break

      case 504:
        err.message = '网关超时'
        break

      case 505:
        err.message = 'HTTP版本不受支持'
        break
      default:
        break
    }
    return Promise.reject(err)
  }
)
$a.logOut = (that) =>{//退出登录
    if(that.$getCookie("accessToken")){
        that.$post(that.$host+"/api/sysmgr/logout",{}).then((d)=>{
            if(d.success){
                sessionStorage.clear();
                let arrS=["corpsvuex","storesvuex","statposttree","Postionvuex","allstatusvuex","typeDatavuex","roleallvuex","functreevuex","employee","employeetotal","productcate","payTypevuex",
                "isShopemployee","isShopemployeetotal"];
                arrS.map(el=>{
                    let  newobj = new Object();
                    newobj.name=el;
                    newobj.value="";
                    that.setDatas(newobj);
                })
                that.$router.replace({
                    path:"/"
                })
            }
        })
    }
};
// post请求
$a.post = (url, data,config) => {
  return axios.post(url, data,config).then(res => {
    return res.data;
  });
};
//get请求
$a.get = (url, data) => {
  return axios.get(url, {
    params: data
  }).then(res => {
    return res.data;
  });
};
$a.delete = (url, data) => {
  return axios({
    method: "delete",
    url: url,
    data: data
  }).then(res => {
    return res.data;
  });
};
$a.getCookie = name => {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(name + "=");
    if (c_start != -1) {
      c_start = c_start + name.length + 1;
      let c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
};
$a.setCookie = (name, value, minute) => {
  let Minute = minute || 43200; //相当于30天
  let exp = new Date();
  exp.setTime(exp.getTime() + Minute * 60 * 1000);
  document.cookie =
    name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
};
$a.clearCookie = (name) => {
  $a.setCookie(name, "", -1);
}
$a.setSession = (name, value) => {
  localStorage.setItem(name, value)
}
$a.getSession = (name) => {
  return localStorage.getItem(name)
}
// $a.clearCookie = (name) => {
//   sessionStorage.removeItem(name)
// }
// 校验手机号
$a.checkMobile = (str) => {
  if (str == "") {
    // Message.error('手机号不能为空！')
    // this.$message.error('手机号不能为空！');
    return false;
  } else {
    var re = /^1[3|4|5|7|8]\d{9}$/;
    if (!re.test(str) || str.length != 11) {
      Message.error('手机号格式错误！')
      // this.$message.error('手机号格式错误！');
      return false;
    }
    return true;
  }
}
// 校验邮箱
$a.checkEmail = (str) => {
  if (str == "") {
    Message.error('邮箱不能为空！')
    // this.$message.error('手机号不能为空！');
    return false;
  } else {
    var re = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!re.test(str)) {
      Message.error('邮箱格式错误！')
      // this.$message.error('手机号格式错误！');
      return false;
    }
    return true;
  }
}
let dblTimes = 1;
$a.stop = () => {
  if (dblTimes == 2) {
    return true;
  }
  dblTimes = 2;
  setTimeout(() => {
    dblTimes = 1;
  }, 250);
  return false;
}
$a.alertF = (text, ltext, rcallback, needtitle) => {
  // if ($.isNull(text)) return;
  // if ($.isNull(needtitle)) {
  //     needtitle = false;
  // }
  var ha = [];
  if (needtitle) {
    ha.push('<h3 class="text-center" style="padding-top:2.5rem">提示</h3>');
  }
  ha.push('<p class="detail">');
  ha.push(text);
  ha.push('</p><div class="sure sureClose">');
  ha.push(ltext ? ltext : '确定');
  ha.push('</div>');
  var html = ha.join('');
  document.getElementById("showMTK").innerHTML = html;
  store.commit("updateMTKshow");
  console.log(
    document.getElementsByClassName("col-g")[0]
  )
  document.getElementsByClassName("sureClose")[0].addEventListener(
    "click",
    function () {
      store.commit("updateMTKshow");
      if (rcallback && rcallback instanceof Function) {
        rcallback();
      }
    }
  );
}
$a.uploadimg = (value, imgtype) => {
  let aa = "#FFFFFF";
  let color = $a.base64encode(aa)
  let font = $a.base64encode("黑体")
  let result = $a.base64encode("小强哥");
  if (imgtype == "logo") {
    return (value + "?imageView2/1/w/60/h/60|watermark/2/text/" + result + "/fill/" + color + "/font/" + font)
  } else {
    return (value + "?imageView2/1/w/180/h/135|watermark/2/text/" + result + "/fill/" + color + "/font/" + font)
  }
}
// 日期 format
$a.formatTen = (num) => {

  return num > 9 ? num + "" : "0" + num;
}

$a.dateFormat = (format, timestamp) => {
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
    M = $a.formatTen((date.getMonth() + 1)),
    D = $a.formatTen(date.getDate()),
    h = $a.formatTen(date.getHours()),
    m = $a.formatTen(date.getMinutes()),
    s = $a.formatTen(date.getSeconds()),
    S = date.getMilliseconds()
  if (format == 'yy-MM-dd hh:mm:ss') {
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
  } else if (format == 'yy-MM-dd') {
    return Y + '-' + M + '-' + D
  } else if (format == 'hh:mm:ss') {
    return h + ':' + m + ':' + s
  } else if (format == 'hh:mm') {
    return h + ':' + m
  } else if (format == 'yyMMddhhmmss') {
    return Y + M + D + h + m + s
  } else if (format == 'yyMMddhhmmssSS') {
    return Y + M + D + h + m + s + S
  }else if(format == 'yy-MM'){
    return Y + '-' + M 
  }
  //   return Y + M + D + h + m + s;
}

$a.formatJson = (filterVal, jsonData) => {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

//导出
$a.exportExcel = (Header, TableKey, tempData, textName) => {
  require.ensure([], () => {
    const {
      export_json_to_excel
    } = require('../vendor/Export2Excel');
    const data = $a.formatJson(TableKey, tempData);
    export_json_to_excel(Header, data, textName);
  })
}

//base64编码

$a.base64encode = (str) => {
  var _out, _i, _len, _c;　　
  _out = "";　　
  _len = str.length;　　
  for (_i = 0; _i < _len; _i++) {
    _c = str.charCodeAt(_i);
    if ((_c >= 0x0001) && (_c <= 0x007F)) {　　
      out += str.charAt(_i);
    } else if (_c > 0x07FF) {　　
      _out += String.fromCharCode(0xE0 | ((_c >> 12) & 0x0F));　　
      _out += String.fromCharCode(0x80 | ((_c >> 　6) & 0x3F));　　
      _out += String.fromCharCode(0x80 | ((_c >> 　0) & 0x3F));
    } else {　　
      _out += String.fromCharCode(0xC0 | ((_c >> 　6) & 0x1F));　　
      _out += String.fromCharCode(0x80 | ((_c >> 　0) & 0x3F));
    }　　
  }　　
  let base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";　　
  var out, i, len;　　
  var c1, c2, c3;　　
  len = _out.length;　　
  i = 0;　　
  out = "";　　
  while (i < len) {
    c1 = _out.charCodeAt(i++) & 0xff;
    if (i == len) {　　
      out += base64EncodeChars.charAt(c1 >> 2);　　
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);　　
      out += "==";　　
      break;
    }
    c2 = _out.charCodeAt(i++);
    if (i == len) {　　
      out += base64EncodeChars.charAt(c1 >> 2);　　
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));　　
      out += base64EncodeChars.charAt((c2 & 0xF) << 2);　　
      out += "=";　　
      break;
    }
    c3 = _out.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3F);　　
  }　　
  return out;
}




export default $a;
