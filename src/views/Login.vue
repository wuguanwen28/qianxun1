<template>
	<div class="login">
		<div class="login-box">
			<div class="logo">
				<img class="img-auto" src="../assets/logo.png" alt="" />
			</div>
			<van-form @submit="login" class="form-box" label-width="70px">
				<van-field v-model="userInfo.phone" name="手机号" label="手机号" placeholder="请输入手机号" autocomplete="off" class="field-box" />
				<van-field v-model="userInfo.password" type="password" name="密码" label="密码" placeholder="密码(6-16个字符)" autocomplete="off" class="field-box" />
				<div class="forget" @click="goRegister('Email')">忘记密码？</div>
				<div class="btn-box">
					<van-button round block type="warning" native-type="submit">登&nbsp;录</van-button>
				</div>
			</van-form>
			<div class="goRegister">没有账号？<span @click="goRegister('Register')">去注册</span></div>
		</div>
		<div class="bgimage"></div>
	</div>
</template>

<script>
	//导入表单验证模块
	import { valid } from '../utils/valid'

	import { utils } from '../utils/utils'

	export default {
		name: "Login",

		computed: {
			userInfo() {
				return this.$store.state.loginModule.userInfo;
			}
		},

		created() {
			this.userInfo.password = '';
		},

		methods: {
			//登录
			login() {

				if(valid.validForm(this.userInfo, this)) {

					//加载提示
					this.$toast.loading({

						//是否禁止背景点击
						forbidClick: true,

						//禁止自动关闭
						duration: 0,

						message: '登录中...'

					})

					this.axios({
						method: 'POST',
						url: '/login',
						data: {
							appkey: this.appkey,
							phone: this.userInfo.phone,
							password: this.userInfo.password
						},

						transformRequest: utils.transformRequest
					}).then(result => {

						//关闭加载提示
						this.$toast.clear();

						//如果登录成功后, 将token保存在cookie中
						if(result.data.code == 200) {

							//将token分段存储
							//let tokenData = result.data.token.split('.');
							//cookie过期时间
							//let expires = 30 * 24 * 60 * 60;
							//tokenData.forEach((v, i) => {
								//v: 一个token分段
								//this.$cookies.set('t' + i, v, expires);
							//})						
							//this.$cookies.set('isLogin', true, expires);

							localStorage.setItem('w_token', result.data.token);
							localStorage.setItem('isLogin', true);

							//跳转页面
							this.$router.push({
								name: 'Home'
							})

						} else {
							this.$toast(result.data.msg);
						}

					}).catch(err => {
						this.$toast('登录出现了问题');
					})

				}

			},

			goRegister(name) {
				this.$router.push({
					name: name
				})
			}
		}
	};
</script>

<style lang="less" scoped>
	.login {
		height: 100%;
		width: 100%;
		>.login-box {
			position: absolute;
			width: 100%;
			height: 100%;
			min-height: 660px;
			background-color: rgba(22, 22, 44, .5);
		}
		.form-box {
			padding: 24px;
			>.field-box {
				margin-bottom: 10px;
				border-radius: 8px;
				height: 48px;
				font-size: 16px;
				color: white;
				background-color: transparent;
			}
			/deep/.van-field__control {
				color: #fff;
			}
			/deep/.van-field__control::-webkit-input-placeholder {
				color: #bbb;
			}
		}
		.btn-box {
			margin-top: 120px;
			padding: 0 10px;
		}
		.logo {
			width: 220px;
			margin: 40px auto 10px;
		}
		.goRegister {
			width: 150px;
			height: 30px;
			position: absolute;
			bottom: 30px;
			left: 36px;
			line-height: 30px;
			color: white;
			font-size: 16px;
			span {
				color: #FF976A;
			}
		}
		.forget{
			height: 20px;
			line-height: 20px;
			padding-left: 16px;
			color: #FF976A;
			font-size: 13px;
		}
	}
</style>