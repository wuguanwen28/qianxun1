# coffeshop

```txt
配置vant
npm i vant -S

自动按需引入组件 (推荐)
npm i babel-plugin-import -D

babel.config.js 中配置
module.exports = {
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
};

Rem 适配
npm i postcss-pxtorem lib-fleixble -D

再postcss.config.js写入以下代码
module.exports = {
  plugins: {
    'autoprefixer': {
      browsers: ['Android >= 4.0', 'iOS >= 8']
    },
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}

再main.js导入lib-flexible
import 'lib-flexible';

```

```txt
配置axios
npm i axios vue-axios --save

在main.js引入
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
```

```txt
局部配置携带cookie
withCredentials 表示跨域请求时是否需要使用凭证
withCredentials: false, // 默认的

配置请求基础路径
axios.defaults.baseURL = 'http://192.168.48.131:10002'

全局配置请求时携带cookie
axios.defaults.withCredentials = true

配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

```

```txt
vue-cookies

参考链接 https://www.jianshu.com/p/60c13168cc8f

安装
npm i vue-cookies --save

使用
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

设置cookie
过期时间以秒为单位
this.$cookies.set(键名, 值, 过期时间)
```

```txt

  注册接口
  请求地址：http://www.kangliuyong.com:10002/register
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    nickName: 昵称,
    password: 密码,
    phone: 手机号
  }

```

```txt

  登录接口
  请求地址：http://www.kangliuyong.com:10002/login
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    password: 密码,
    phone: 手机号
  }


  返回数据含有token
    token: 一个加密字符串
    token一般用于身份验证

    前端使用一个正确的账号和正确密码，向后台服务器换取一个合法token, 然后将token返回到前端，前端将token保存在cookie中，然后如果访问有关于用户个人信息的页面时，必须携带token到后台服务器验证，后台服务器验证通过，则放行，否则，则拦截操作
```

```txt

  banner接口
  请求地址：http://www.kangliuyong.com:10002/banner
  请求类型： GET
  请求参数： {
    appkey: 你的appkey
  }

```

```txt

  商品类型接口
  请求地址：http://www.kangliuyong.com:10002/type
  请求类型： GET
  请求参数： {
    appkey: 你的appkey
  }

```

```txt

  根据商品类型获取商品接口
  请求地址：http://www.kangliuyong.com:10002/typeProducts
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    key: '商品类型键名',
    value: '商品类型值'
  }

  例如查看最新推荐商品
    {
      appkey: 你的appkey,
      key: 'isHot',
      value: 1
    },

  例如查看咖啡类型商品
    {
      appkey: 你的appkey,
      key: 'type',
      value: 'coffee'
    }
```


我的appkey
U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=