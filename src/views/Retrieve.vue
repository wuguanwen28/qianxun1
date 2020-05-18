<template>
  <div class="retrieve">
    <van-nav-bar title="找回密码" left-text="返回" left-arrow :fixed="true" @click-left="back" />

    <van-form @submit="commit">
      <van-field
        v-model="userInfo.phone"
        name="手机号"
        label="手机号"
        placeholder="11位手机号"
        autocomplete="off"
      />
      <van-field
        v-model="userInfo.password"
        type="text"
        name="新密码"
        label="新密码"
        placeholder="密码(6-16个字符)"
        autocomplete="off"
        size="large"
        class="password"
      />
      <div class="btn-box">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>

  </div>
</template>

<script>

  //导入表单验证模块
  import {valid} from '../utils/valid'

  import { utils } from '../utils/utils'

  export default {
    name: 'Retrieve',

    data() {
      return {
        userInfo: {
          phone: '',
          password: ''
        }
      }
    },

    methods: {
      back() {
        this.$router.go(-1);
      },

      commit() {

        //表单验证
        if (valid.validForm(this.userInfo, this)) {
          //验证通过

          //加载提示
          this.$toast.loading({
            forbidClick: true,
            duration: 0,
            message: "加载中..."
          });

          this.axios({
            method: 'POST',
            url: '/retrievePassword',
            data: {
              appkey: this.appkey,
              phone: this.userInfo.phone,
              password: this.userInfo.password
            },
            transformRequest: utils.transformRequest
          }).then(result => {
            this.$toast.clear();
            
            if (result.data.code == 'L001') {
              this.$router.push({name: 'Login'});
            } else {
              this.$toast(result.data.msg);
            }
            
          }).catch(err => {
            this.$toast.clear();
            
          })

        }

      }
    }
  }
</script>

<style lang="less" scoped>
  .retrieve{
    padding-top: 46px;
    .btn-box{
      margin-top: 16px;
      padding: 0 10px;
    }
    /deep/.van-nav-bar {
			background-color: #E5C474;
			/deep/.van-nav-bar__title,
			.van-nav-bar__text,
			.van-nav-bar__arrow {
				color: white !important;
			}
		}
		/deep/.van-button--info{
			background-color: #E5C474;
			border-color: #E5C474;
		}
		.password{
			height: 50px;
		}
  }
</style>