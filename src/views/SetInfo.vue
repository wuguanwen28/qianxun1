<template>
	<div class="account">
		<van-nav-bar :title="setType[index].title" @click-left="returnBack" :border="false" left-text="返回" left-arrow :fixed="true">
			<template #right>
				<van-button v-if="data.key != 'password'" :disabled="!isChange" @click="changeUserInfo" type="primary" color="#E5C474" size="small">保存</van-button>
				<van-button v-else :disabled="!isChange" @click="updatePassword" type="primary" color="#E5C474" size="small">完成</van-button>
			</template>
		</van-nav-bar>
		<div class="list">
			<template v-if="data.key == 'password'">
				<van-cell-group>
					<van-field v-model="password.old" type="password" name="旧密码" label="旧密码" placeholder="旧密码" :rules="[{ required: true, message: '请填写旧密码' }]" />
					<van-field @input="change" v-model="password.new" type="password" name="新密码" label="新密码" placeholder="新密码" :rules="[{ required: true, message: '请填写新密码' }]" />
				</van-cell-group>
				<div class="title">{{setType[index].placeholder}}</div>
				<div class="forget" @click="goPage">忘记旧密码？</div>
			</template>
			<template v-else>
				<van-cell-group>
					<van-field v-model="data.value" rows="1" autosize :autofocus="true" type="textarea" @input="change" />
				</van-cell-group>
				<div class="title">{{setType[index].placeholder}}</div>
			</template>
		</div>
	</div>
</template>

<script>
	import { utils } from '../utils/utils'
	import { valid } from '../utils/valid'
	export default {
		name: 'Account',
		created() {
			let query = this.$route.query;
			this.data = query;
			this.setType.forEach((v, i) => {
				if(v.key == query.key) {
					this.index = i;
				}
			})
		},
		data() {
			return {
				setType: [{
						key: 'nickName',
						title: '修改昵称',
						placeholder: '好听的名字可以让人更容易记住你。'
					},
					{
						key: 'desc',
						title: '个性签名',
						placeholder: '编辑个签，展示我的独特态度。'
					},
					{
						key: 'password',
						title: '修改密码',
						placeholder: '密码必须首个字符是字母且不能含有汉字(6~16位)'
					}
				],

				index: 0,

				data: {},

				isChange: false,

				password: {
					old: '',
					new: ''
				}
			}
		},
		methods: {
			returnBack() {
				this.$router.go(-1);
			},

			//修改昵称、简介
			changeUserInfo() {

				let tokenString = utils.getToken(this);

				//加载提示
				this.$toast.loading({
					forbidClick: true,
					duration: 0,
					message: "加载中..."
				});

				this.axios({
					method: 'POST',
					url: this.data.url,
					data: {
						appkey: this.appkey,
						tokenString,
						[this.data.key]: this.data.value
					},
					transformRequest: utils.transformRequest
				}).then(result => {
					this.$toast.clear();
					this.returnBack();
				}).catch(err => {
					this.$toast.clear();
					
				})
			},

			change() {
				this.isChange = true
			},

			updatePassword() {
				if(this.password.old == this.password.new) {
					//加载提示
					this.$toast({
						message: '新旧密码不能相同'
					});
					return;
				}

				if(valid.validForm({
						password: this.password.new
					}, this)) {
					let tokenString = utils.getToken(this);
					this.axios({
						method: 'POST',
						url: '/updatePassword',
						data: {
							appkey: this.appkey,
							tokenString,
							password: this.password.new,
							oldPassword: this.password.old
						},
						transformRequest: utils.transformRequest
					}).then(result => {
						if(result.data.code == 'E001') {
							//加载提示
							this.$toast.success({
								message: result.data.msg + '需要重新登录'
							});

							this.$router.push({
								name: 'Login'
							})

						} else {
							//加载提示
							this.$toast.fail({
								message: result.data.msg
							});
						}
					})
				}

			},
			
			goPage(){
				this.$router.push({name: 'Email'})
			}
			
		}
	}
</script>

<style lang="less" scoped>
	.account {
		background-color: white;
		width: 100%;
		height: 100%;
		/deep/.van-nav-bar {
			/deep/.van-nav-bar__title,
			.van-nav-bar__text,
			.van-nav-bar__arrow {
				color: #E5C474 !important;
			}
		}
		/deep/.van-field__control {
			color: #666666;
			font-size: 14px;
		}
		/deep/.van-cell__value {
			color: #333333;
			font-size: 16px;
		}
		/deep/.van-cell {
			padding-top: 20px;
		}
		.list {
			margin-top: 46px;
		}
		.title {
			font-size: 12px;
			color: #aaaaaa;
			padding: 5px 16px;
		}
		.forget {
			font-size: 12px;
			color: #E5C474;
			padding: 0px 16px;
		}
	}
</style>