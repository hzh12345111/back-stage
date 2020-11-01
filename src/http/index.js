import axios from 'axios' //axios
import { Message } from 'element-ui'

var baseURL;
if (process.env.NODE_ENV === 'development') {          //自动切换接口地址 设置请求不同域名的接口
    baseURL = "http://localhost:8889/api/private/v1/"    //开发环境 dev
} else if (process.env.NODE_ENV === "production") {
    baseURL = "http://localhost:8888/api/private/v1/";   //上线环境  build
} else if (process.env.NODE_ENV === 'test') {
    baseURL = "http://localhost:8887/api/private/v1/";   //测试环境

}
const instance = axios.create({  //设置到实例上面
    // baseURL
    baseURL: process.env.VUE_APP_baseURL
})

const http = (url, data, method = 'GET') => {     //封装axios
    return new Promise((resolve, reject) => {
        instance({
            url,
            data,
            method
        }).then(res => {
            if ((res.status >= 200) & (res.status < 300) || res.status === 304) {
                //只是表示接口可以通了 //res.status===304 也成功 就是走缓存
                if (res.data.meta.status === 200) {
                    //证明用户名和密码是对的
                    resolve(res.data)
                } else {
                    //说明密码或用户名不对
                    Message({
                        message: res.data.meta.msg,
                        type: "error",
                    });
                    reject(res.data.meta.msg) //错误信息
                }
            } else {
                //说明接口不通
                Message({
                    message: res.statusText,
                    type: "error",
                });
                reject(res.data.meta.msg) //错误信息
            }
        }).catch(err => {
            console.log(err)
        })
    })

}

export default http  //es6导出