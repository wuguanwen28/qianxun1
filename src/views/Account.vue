<template>
	<div class="personalData">
		<van-nav-bar title="帐号管理" @click-left="returnBack" left-text="返回" :border="false" left-arrow :fixed="true" />
		<div class="list">

			<van-cell-group>

				<van-field @click="goSet('/updatePassword', 'password', '')" size="large" type="password" value="123445" label="修改密码" input-align="right" isLink />

				<van-field @click="goRegister" size="large" readonly label="注册新帐号" input-align="right" isLink />

			</van-cell-group>
			<div class="btn">
				<div>
					<van-button type="default" @click="logout('/destroyAccount')" size="large" color="#fff">注销账号</van-button>
				</div>
				<div>
					<van-button type="default" @click="logout('/logout')" size="large" color="#fff">退出登录</van-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { utils } from '../utils/utils'
	export default {
		name: 'Account',

		data() {
			return {
				userInfo: {
					userImg: '',
					phone: '',
					userId: '',
					nickName: '',
					desc: ''
				}

			};
		},

		methods: {
			returnBack() {
				this.$router.go(-1);
			},

			goSet(url, key, value) {

				this.$router.push({
					name: 'SetInfo',
					query: {
						url,
						key,
						value
					}
				})
			},

			goRegister() {
				this.$router.push({
					name: 'Register'
				})
			},

			logout(type) {

				let msg = type == '/logout' ? '是否退出登录？' : '帐号注销后无法找回，是否注销？';

				this.$dialog.confirm({
					message: msg
				}).then(() => {

						//执行注销
						let tokenString = utils.getToken();

						//加载提示
						this.$toast.loading({
							forbidClick: true,
							duration: 0,
							message: "加载中..."
						});

						this.axios({
							method: 'POST',
							url: type,
							data: {
								appkey: this.appkey,
								tokenString
							},
							transformRequest: utils.transformRequest
						}).then(result => {
							this.$toast.clear();
							this.$router.push({
								name: 'Welcome'
							});
						}).catch(err => {
							this.$toast.clear();
						})
				}).catch(() => {});
			}

		}
	}
</script>

<style lang="less" scoped>
	.personalData {
		background-color: #FAFAFA;
		width: 100%;
		height: calc(~"100% - 46px");
		padding-top: 46px;
		/deep/.van-nav-bar {
			background-color: #E5C474;
			/deep/.van-nav-bar__title,
			.van-nav-bar__text,
			.van-nav-bar__arrow {
				color: white !important;
			}
		}
		.btn {
			margin-top: 10px;
			>div {
				margin-bottom: 10px;
			}
		}
		/deep/.van-button__text {
			color: #333;
		}
	}
</style>