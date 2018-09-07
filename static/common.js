import axios from "axios";
const $a={};
//post请求
$a.post = (url, data) => {
    return axios.post(url, data).then(res => {
        return res.data;
    });
};
//get请求
$a.get = (url,data) => {
    return axios.get(url,{params:data}).then(res => {
        return res.data;
    });
};
// $a.post=(url,postData)=>{
//   return  fetch(url,{
//         method:"POST",
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         credentials: 'include',//请求包含cookie
//         body: JSON.stringify(postData)
//     }).then((res)=>res.json())
// }
// $a.get=(url,getData={})=>{
//     return  fetch(url,{
//           method:"POST",
//           headers: {
//               'Accept': 'application/json',
//               'Content-Type': 'application/json'
//           },
//           credentials: 'include',//请求包含cookie
//           body: JSON.stringify(getData)
//       }).then((res)=>res.json())
//   }
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
$a.clearCookie=(name)=> {  
    $a.setCookie(name, "", -1);  
}
export default $a;