<template>
	<div class="like">
		<van-nav-bar title="我的收藏" :border="false" left-text="返回" left-arrow :fixed="true" @click-left="back" />
		<div class="empty" v-if="likeData.length == 0">
				<van-empty description="您还收藏商品">
					 <van-button round type="danger" @click="goHome" class="bottom-button">去收藏</van-button>
				</van-empty>
		</div>
		<div class="like-box clearfix">
			<div :class="[index % 2 == 0 ? 'a' : 'b']" v-for="(item, index) in likeData" :key="index" @click="goPage(item.pid)">
				<div>
					<img class="img-auto" :src="item.smallImg" alt="">
				</div>
				<div class="title">{{item.name}}
					<span class="fr delete" @click.stop="removeLike(item.pid, index)">
			        	<van-icon class="v-icon" name="star" />
			        </span>
				</div>

				<div class="price">￥{{item.price}}</div>

			</div>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { utils } from '../utils/utils'

	export default {
		name: 'Like',

		created() {
			this.getLikeData();
		},

		computed: {
			...mapState('likeModule', ['likeData'])
		},

		methods: {

			//返回上一级
			back() {
				this.$router.go(-1);
			},
			
			goHome(){
				this.$router.push({name: 'Home'});
			},

			//获取我的收藏商品数据
			getLikeData() {

				//加载提示
				this.$toast.loading({
					forbidClick: true,
					duration: 0,
					message: "加载中..."
				});

				let tokenString = utils.getToken(this);
				//初始化数据
				this.axios({
					method: 'GET',
					url: '/findAllLike',
					params: {
						appkey: this.appkey,
						tokenString
					}
				}).then(result => {
					this.$toast.clear()
					if(result.data.code == 2000) {
						this.$store.commit('likeModule/changeData', {
							key: 'likeData',
							value: result.data.result
						});
					}
				}).catch(err => {
					this.$toast.clear()

				})
			},

			//查看商品详情
			goPage(pid) {
				this.$router.push({
					name: 'Detail',
					params: {
						pid
					}
				})
			},

			//删除我的收藏商品
			removeLike(pid, index) {

				//加载提示
				this.$toast.loading({
					forbidClick: true,
					duration: 0,
					message: "正在取消收藏..."
				});

				let tokenString = utils.getToken(this);

				this.axios({
					method: 'POST',
					url: '/notlike',
					data: {
						appkey: this.appkey,
						tokenString,
						pid
					},
					transformRequest: utils.transformRequest
				}).then(result => {
					this.$toast.clear()
					//加载提示
					this.$toast.success({
						message: "已取消收藏"
					});
					this.$store.commit('likeModule/changeLikeData', index);
				}).catch(err => {
					this.$toast.clear()

				})

			}
		}
	}
</script>

<style lang="less" scoped>
	.like {
		padding-top: 46px;
		width: 100%;
		height: calc(~"100% - 46px");
		background-color: #FCFAF2;
		/deep/.van-nav-bar {
			background-color: #E5C474;
			/deep/.van-nav-bar__title,
			.van-nav-bar__text,
			.van-nav-bar__arrow {
				color: white !important;
			}
		}
		.like-box {
			margin-top: 10px;
			>div {
				float: left;
				width: calc(~"50% - 15px - 20px");
				background-color: #fff;
				padding: 10px;
				margin-bottom: 10px;
				position: relative;
				&.a {
					margin-right: 5px;
					margin-left: 10px;
				}
				&.b {
					margin-left: 5px;
					margin-right: 10px;
				}
			}
			.price {
				font-size: 14px;
				color: #fff;
				line-height: 24px;
				position: absolute;
				top: 10px;
				left: 10px;
				padding: 0 5px;
				background-color: #E5C474;
			}
			.title {
				padding: 5px 5px;
				color: #fff;
				font-size: 14px;
				position: absolute;
				bottom: 10px;
				left: 10px;
				width: calc(~"100% - 30px");
				background-color: rgba(22, 22, 22, .6);
			}
			.delete {
				height: 20px;
				width: 20px;
				.v-icon {
					font-size: 20px;
					color: red;
				}
			}
		}
		.bottom-button{
			width: 140px;
			background-color: #E5C474;
			border-color: #E5C474;
			font-size: 16px;
		}
	}
</style>