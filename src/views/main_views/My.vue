<template>
	<div class="my">
		<div class="header">
			<div class="header-bg" @click="isShowloader" :style="{backgroundImage: 'url(' + userInfo.userBg + ')'}"></div>
			<div class="header-img">
				<div><img @click="isShowloader" class="img-auto" :src="userInfo.userImg" /></div>
			</div>
			<div class="username">{{userInfo.nickName}}</div>
			<div class="desc">{{userInfo.desc}}</div>
		</div>
		<van-cell-group>
			<van-cell :icon="item.icon" v-for="(item, index) in cellData" :key="index" :title="item.title" size="large" @click="goPage(item.name)" is-link />
		</van-cell-group>

		<van-action-sheet @select="select" v-model="isShow" :actions="actions" cancel-text="取消">
			<van-uploader name="/updateAvatar" :after-read="upload">
				<div class="upload">更换头像</div>
			</van-uploader>
			<van-uploader name="/updateUserBg" :after-read="upload">
				<div class="upload">更换背景图</div>
			</van-uploader>
		</van-action-sheet>

	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { ImagePreview } from 'vant'
	import { utils } from '../../utils/utils'

	export default {
		name: 'My',
		created() {
			
			this.$store.commit('myModule/changeData', {key: 'userInfo', value: {}});
			let islogin = utils.isLogin('请先登录', this)
			if(!islogin) {
				return;
			}
			//加载提示
			this.$toast.loading({
				forbidClick: true,
				duration: 0,
				message: "加载中..."
			});

			let tokenString = utils.getToken(this);
			this.axios({
				method: 'GET',
				url: '/findMy',
				params: {
					appkey: this.appkey,
					tokenString
				}
			}).then(result => {

				this.$store.commit('myModule/changeData', {
					key: 'userInfo',
					value: result.data.result[0]
				})

				if(localStorage.getItem('isLogin') == 'true') {
					this.userInfo.desc = this.userInfo.desc == '' ? '这个人很懒，什么都没有留下' : this.userInfo.desc;
				}

				this.$toast.clear();

			}).catch(err => {
				this.$toast.clear();

			})
		},
		computed: {
			...mapState('myModule', ['cellData', 'userInfo', 'actions'])
		},
		data() {
			return {
				isShow: false,
			}
		},
		methods: {
			goPage(name) {
				let islogin = utils.isLogin('请先登录', this)
				if(!islogin) {
					return;
				}
				this.$router.push({
					name
				});
			},

			select(action, index) {
				if(index == '0') {
					ImagePreview({
						images: [
							this.userInfo.userImg,
						],
						showIndex: false,
					})
				} else if(index == '1') {
					ImagePreview({
						images: [
							this.userInfo.userBg,
						],
						showIndex: false,
					})
				}
				this.isShow = false;
			},

			isShowloader() {
				let islogin = utils.isLogin('请先登录', this)
				if(!islogin) {
					return;
				}
				this.isShow = true;
			},

			//上传头像
			upload(file, detail) {

				this.isShow = false;
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
					url: detail.name,
					data: {
						appkey: this.appkey,
						tokenString,
						imgType,
						serverBase64Img
					},
					transformRequest: utils.transformRequest
				}).then(result => {
					this.$toast.clear();

					if(result.data.code == 'H001') {
						this.userInfo.userImg = result.data.userImg;
					} else if(result.data.code == 'I001') {
						this.userInfo.userBg = result.data.userBg;
					}

				}).catch(err => {
					this.$toast.clear();

				})

			}

		}
	}
</script>

<style lang="less" scoped="scoped">
	.my {
		width: 100%;
		height: 100%;
		background: #fff;
		.header {
			width: 100%;
			height: 225px;
			position: relative;
			overflow: hidden;
			.headerIcon {
				position: absolute;
				bottom: 10px;
				right: 10px;
				z-index: 5;
			}
			.header-bg {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 0;
				background-color: #f5f5f5;
				background-position: center center;
				background-size: cover;
				filter: blur(4px);
			}
			.header-img {
				width: 80px;
				height: 80px;
				border-radius: 50%;
				position: absolute;
				border: 2px solid #fff;
				padding: 5px;
				top: 50px;
				left: 0;
				right: 0;
				margin: auto;
				div {
					width: 80px;
					height: 80px;
					border-radius: 50%;
					overflow: hidden;
					background-color: #fafafa;
				}
			}
			.username {
				width: 100%;
				color: #FFFFFF;
				position: absolute;
				bottom: 50px;
				text-align: center;
				height: 28px;
				line-height: 28px;
				font-size: 16px;
			}
			.desc {
				width: 100%;
				color: #FFFFFF;
				position: absolute;
				bottom: 22px;
				text-align: center;
				height: 28px;
				line-height: 28px;
				font-size: 16px;
			}
		}
		/deep/.upload {
			width: 375px;
			height: 50px;
			line-height: 50px;
			text-align: center;
			font-size: 14px;
			border-top: 0.5px solid #f5f5f5;
		}
	}
</style>