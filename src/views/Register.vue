<template>
	<div class="register">
		<div class="content">
			<div class="logo">
				<img class="img-auto" src="../assets/logo.png" alt="" />
			</div>
			<van-form class="form-box" @submit="register" label-width="70px">
				<van-field v-model="userInfo.phone" name="手机号" label="手机号" placeholder="请输入手机号" autocomplete="off" class="field-box" />
				<van-field v-model="userInfo.nickName" name="昵称" label="昵称" placeholder="昵称" autocomplete="off" class="field-box" />
				<van-field v-model="userInfo.password" name="密码" label="密码" placeholder="密码(6~16位)" autocomplete="off" class="field-box" />
				<div class="btn-box">
					<van-button class="btn" round block type="info" native-type="submit">注&nbsp;册</van-button>
				</div>
			</van-form>
			<div class="goRegister">已有账号？<span @click="goLogin">去登录</span></div>
		</div>
		<div class="bgimage"></div>
	</div>
</template>

<script>
	//导入表单验证模块
	import { valid } from '../utils/valid'

	//导入公共方法
	import { utils } from '../utils/utils'

	import { mapState } from 'vuex'

	export default {
		name: "Register",

		computed: {

			...mapState('registerModule', ['userInfo'])

		},

		methods: {
			//注册
			register() {

				if(valid.validForm(this.userInfo, this)) {

					this.$toast.loading({
						//是否禁止背景点击
						forbidClick: true,

						//禁止自动关闭
						duration: 0,

						message: '注册中...'
					})

					//发起ajax请求
					this.axios({
						method: 'POST',
						url: '/register',
						//请求体参数
						data: {
							appkey: this.appkey,
							nickName: this.userInfo.nickName,
							phone: this.userInfo.phone,
							password: this.userInfo.password
						},

						//序列换请求体参数
						transformRequest: utils.transformRequest

					}).then(result => {

						this.$toast.clear()

						//如果注册成功
						if(result.data.code == 100) {
							//跳转登录组件
							this.$router.push({name: 'Login'});
							
						} else {
							this.$toast({
								message: result.data.msg
							})
						}

					}).catch(err => {

						cthis.$toast.clear();						
						this.$toast({message: '注册出错了'})
						
					})

				}

			},
			
			goLogin(){
				this.$router.push({name: 'Login'});
			}
		}
	};
</script>

<style lang="less" scoped>
	.register {
		width: 100%;
		height: 100%;
		position: relative;
		.content {
			width: 100%;
			height: 100%;
			min-height: 660px;
			position: absolute;
			background-color: rgba(22, 22, 44, 0.5);
			z-index: 2;
		}
		.form-box {
			padding: 24px;
			>.field-box {
				border-radius: 8px;
				margin-bottom: 8px;
				height: 48px;
				font-size: 16px;
				color: white;
				background-color: transparent;
			}
			/deep/.van-field__control {
				color: #fff;
				font-size: 14px;
			}
			/deep/.van-field__control::-webkit-input-placeholder {
				color: #bbb;
			}
		}
		.btn-box {
			margin-top: 97px;
			padding: 0 10px;
			>.btn {
				background-color: #7232DD;
				border: none;
			}
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
	}
</style>