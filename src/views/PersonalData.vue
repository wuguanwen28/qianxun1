<template>
	<div class="personalData">
		<van-nav-bar title="个人信息" @click-left="returnBack" left-text="返回" :border="false" left-arrow :fixed="true" />
		<div class="list">

			<van-cell-group>
				<van-field size="large" class="avatar" center clearable label="头像" isLink readonly>
					<template #button>
						<div class="person-img">
							<img class="img-auto" :src="userInfo.userImg" alt="">
							<van-uploader class="v-uploader" :after-read="upload" />
						</div>
					</template>
				</van-field>
				<van-field size="large" label="千寻号" :value="userInfo.userId" input-align="right" readonly />
				<van-field size="large" label="手机号码" :value="userInfo.phone" input-align="right" readonly />
				<van-field @click="goSet('/updateNickName', 'nickName', userInfo.nickName)" input-align="right" :value="userInfo.nickName" label="昵称" isLink />
				<van-field @click="goSet('/updateDesc', 'desc', userInfo.desc)" readonly :value="userInfo.desc" input-align="right" rows="1" autosize type="textarea" label="个性签名" isLink/>
			</van-cell-group>
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

		created() {
			this.getUserInfo();
		},

		methods: {
			returnBack() {
				this.$router.go(-1);
			},

			//获取用户信息
			getUserInfo() {
				let tokenString = utils.getToken(this);

				//加载提示
				this.$toast.loading({
					forbidClick: true,
					duration: 0,
					message: "加载中..."
				});

				this.axios({
					method: 'GET',
					url: '/findAccountInfo',
					params: {
						appkey: this.appkey,
						tokenString
					}
				}).then(result => {
					this.$toast.clear();
					this.userInfo = result.data.result[0];
					this.userInfo.desc = this.userInfo.desc == '' ? '这个人很懒，什么都没有留下' : this.userInfo.desc;
				}).catch(err => {
					this.$toast.clear();
					
				})

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

			//上传头像
			upload(file) {

				//控制上传图片大小不能超过 300KB
				let imgSize = 300 * 1024;
				if(file.file.size > imgSize) {
					this.$toast('上传图片大小不能超过300KB');
					return;
				}

				let imgType = file.file.type.split('/')[1];

				let serverBase64Img = file.content.replace(/data:image\/[A-Za-z]+;base64,/, '');

				let tokenString = utils.getToken(this);

				//加载提示
				this.$toast.loading({
					forbidClick: true,
					duration: 0,
					message: "加载中..."
				});

				this.axios({
					method: 'POST',
					url: '/updateAvatar',
					data: {
						appkey: this.appkey,
						tokenString,
						imgType,
						serverBase64Img
					},
					transformRequest: utils.transformRequest
				}).then(result => {
					this.$toast.clear();
					this.userInfo.userImg = result.data.userImg;
				}).catch(err => {
					this.$toast.clear();
					
				})

			}

		}
	}
</script>

<style lang="less" scoped>
	.personalData {
		background-color: white;
		width: 100%;
		height: 100%;
		/deep/.van-nav-bar {
			background-color: #E5C474;
			/deep/.van-nav-bar__title,
			.van-nav-bar__text,
			.van-nav-bar__arrow {
				color: white !important;
			}
		}
		/deep/.van-field__control {
			color: #A8A8A8;
		}
		/deep/.van-cell--large .van-cell__title {
			font-size: 14px;
		}
		.list {
			margin-top: 46px;
		}
		.header {
			width: 40px;
		}
		.avatar {
			padding-top: 0;
			padding-bottom: 5px;
			line-height: 48px;
			.person-img {
				width: 40px;
				height: 40px;
				margin-top: 4px;
				position: relative;
			}
			.v-uploader {
				position: absolute;
				width: 40px;
				height: 40px;
				left: 0;
				top: 0;
				overflow: hidden;
				z-index: 2;
				opacity: 0;
			}
		}
	}
</style>