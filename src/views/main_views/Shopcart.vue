<template>
	<div class="shopcart">
		<template v-if="allShopcartData.length > 0">
			<van-nav-bar :fixed="true" :right-text="isEdit ? '完成' : '管理'" @click-right="manage" />
			<!--购物车列表-->
			<div class="list">
				<van-list finished-text="没有更多了" :immediate-check="false" :finished="isFinished" v-model="isLoading" @load="loadData">
					<van-swipe-cell :disabled="!isEdit" v-for="(item, index) in shopcartData" :key="index">
						<van-cell>
							<div class="v-cell">
								<div class="v-checkbox">
									<van-checkbox v-model="item.isChecked" @change="simpleSelect(item)" checked-color="#E5C474" shape="round"></van-checkbox>
								</div>
								<div class="pro-img">
									<img class="img-auto" :src="item.small_img" />
								</div>
								<div class="pro-info">
									<div class="pro-name">{{item.name}}<span>{{item.enname}}</span></div>
									<div class="rule">{{item.rule}}</div>
									<div class="clearfix ch-count" v-show="!isEdit">
										<span class="fl">￥{{item.price}}</span>
										<span class="fr"><van-stepper v-model="item.count" @change="changeCount(item)" /></span>
									</div>
								</div>
							</div>
						</van-cell>
						<template #right>
							<van-button @click="removeShopcart('one', item)" class="v-button" square color="linear-gradient(to right, #CBA25F, #D39027)" text="删除" />
						</template>
					</van-swipe-cell>
				</van-list>
			</div>

			<van-submit-bar v-show="!isEdit && shopcartData.length > 0" @submit="commit" :price="total" button-text="结 算" button-type="info" :safe-area-inset-bottom="true">
				<van-checkbox v-model="isAllChecked" checked-color="#E5C474" @click="allSelect">全选</van-checkbox>
			</van-submit-bar>

			<!-- 删除 -->
			<van-submit-bar v-show="isEdit && shopcartData.length > 0" class="v-submit" button-text="删 除" button-type="info" :safe-area-inset-bottom="true" @submit="removeShopcart('all')">
				<van-checkbox v-model="isAllChecked" checked-color="#E5C474" @click="allSelect">全选</van-checkbox>
			</van-submit-bar>
		</template>

		<template v-else>
			<div class="not-shopcart-box">
				<div class="not-shopcart">
					<div class="not-shopcart-icon">
						<van-icon name="shopping-cart" />
					</div>
					<div>{{isLogin ? '购物车竟然空空如也' : '登录后才能查看购物车'}}</div>
					<div class="last-item">再忙也要买一杯咖啡犒劳自己</div>
				</div>
				<div v-if="isLogin">
					<div>
						<van-divider :style="{ color: '#E5C474', borderColor: '#E5C474', padding: '0 16px' }">
							<van-icon name="like" />
							<div style="margin-left: 5px;">为您推荐</div>
						</van-divider>
					</div>
					<div class="like-box clearfix">
						<div :class="[index % 2 == 0 ? 'a' : 'b']" v-for="(item, index) in recommendData" :key="index" @click="goPage(item.pid)">
							<div>
								<img class="img-auto" :src="item.smallImg" alt="">
							</div>
							<div class="title">{{item.name}}
								<span class="fr delete">￥{{item.price}}</span>
							</div>
						</div>
					</div>
				</div>

			</div>
		</template>

	</div>
</template>

<script>
	//mapState辅助函数
	import { mapState, mapMutations } from 'vuex'

	import { utils } from '../../utils/utils.js'

	export default {

		name: 'Shopcart',

		data() {
			return {
				isLoading: false,
				isAllChecked: false,
				total: 0,
				isLogin: true
			}
		},

		created() {

			let islogin = utils.isLogin('登录后才查看购物车，是否登录？', this)

			if(!islogin) {
				this.isLogin = false
				return;
			}

			this.$store.commit('shopcartModule/emptyData');

			let tokenString = utils.getToken(this);

			this.axios({
				method: 'GET',
				url: '/findAllShopcart',
				params: {
					appkey: this.appkey,
					tokenString
				}
			}).then(result => {
				if(result.data.code == '5000') {
					let data = result.data.result;
					data.forEach(v => {
						v.isChecked = false;
					})
					this.$store.commit('shopcartModule/changeData', {
						key: 'allShopcartData',
						value: data
					});

					if(this.allShopcartData.length >= 6) {
						data = data.slice(0, 6);
					}
					this.$store.commit('shopcartModule/changeData', {
						key: 'shopcartData',
						value: data
					});

				}
			})
			this.getRecommendData()

		},

		computed: {

			...mapState('shopcartModule', ['isEdit', 'shopcartData', 'isFinished', 'allShopcartData', 'recommendData']),

		},

		methods: {

			loadData() {

				setTimeout(() => {

					this.isLoading = false;

					if(this.shopcartData.length >= this.allShopcartData.length) {
						//没有数据可加载
						this.$store.commit('shopcartModule/changeData', {
							key: 'isFinished',
							value: true
						});
					}

					this.$store.commit('shopcartModule/loadShopcartData', 6);

				}, 1000)

			},

			allSelect() {
				this.sum();
				this.$store.commit('shopcartModule/allSelect', this.isAllChecked);
			},

			simpleSelect(item) {
				this.sum();
				for(let i = 0; i < this.shopcartData.length; i++) {
					if(!this.shopcartData[i].isChecked) {
						this.isAllChecked = false;
						return;
					}
				}

				this.isAllChecked = true;

			},

			//计算订单总价
			sum() {
				this.total = 0;
				this.shopcartData.forEach(v => {
					if(v.isChecked) {
						this.total += v.price * v.count * 100;
					}
				})

			},

			//改变数量
			changeCount(item) {
				let tokenString = utils.getToken(this);
				this.axios({
					method: 'POST',
					url: '/modifyShopcartCount',
					data: {
						appkey: this.appkey,
						tokenString,
						sid: item.sid,
						count: item.count
					},
					transformRequest: utils.transformRequest
				}).then(result => {
					this.sum()
				}).catch(err => {

				})
			},

			//管理商品
			manage() {
				this.$store.commit('shopcartModule/manage')
			},

			//删除商品
			removeShopcart(isAll, item) {

				//加载提示
				this.$toast.loading({
					forbidClick: true,
					duration: 0,
					message: '处理中...'
				})

				let sidArr = []
				if(isAll == 'all') {
					this.shopcartData.forEach(v => {
						if(v.isChecked) {
							sidArr.push(v.sid)
						}
					})
				} else if(isAll = 'one') {
					sidArr.push(item.sid)
				}

				if(sidArr.length == 0) {
					this.$toast({
						message: '没有选择商品'
					})
					return;
				}

				let sids = JSON.stringify(sidArr);

				//获取token字符串
				let tokenString = utils.getToken(this);

				this.axios({
					method: 'POST',
					url: '/deleteShopcart',
					data: {
						appkey: this.appkey,
						tokenString,
						sids
					},
					transformRequest: utils.transformRequest
				}).then(result => {
					this.$toast.clear();
					//加载提示
					this.$toast.success({
						message: '成功删除商品'
					})
					this.$store.commit('shopcartModule/removeShopcartData', sidArr);
					this.sum();
					if(this.shopcartData.length == 0) {
						this.isAllChecked = false;
					}
				}).catch(err => {
					this.$toast.clear();

				})
			},

			//提交订单 
			commit() {

				// 获取勾选商品的购物车的sid
				let sids = []
				this.shopcartData.forEach(v => {
					if(v.isChecked) {
						sids.push(v.sid);
					}
				})

				if(sids.length == 0) {
					//加载提示
					this.$toast.fail({
						message: '请选择商品'
					})
					return;
				}

				this.$router.push({
					name: 'Pay',
					query: {
						sids: sids.join('-')
					}
				});
			},

			getRecommendData() {
				this.axios({
					method: 'GET',
					url: '/typeProducts',
					params: {
						appkey: this.appkey,
						key: 'isHot',
						value: 1
					}
				}).then(result => {
					let datas = result.data.result.splice(0, 4)
					if(result.data.code == 500) {
						this.$store.commit('shopcartModule/changeData', {
							key: 'recommendData',
							value: datas
						});
					}
				}).catch(err => {

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


		}

	}
</script>

<style lang="less" scoped="scoped">
	.shopcart {
		height: 100%;
		width: 100%;
		background-color: white;
		position: relative;
		.no-data {
			margin-top: 50px;
		}
		.v-submit {
			.van-checkbox {
				margin-right: auto;
			}
		}
		.list {
			position: fixed;
			top: 0px;
			width: 100%;
			padding-bottom: 100px;
			padding-top: 44px;
			height: 523px;
			overflow-y: auto;
			.v-cell {
				display: flex;
			}
			.v-checkbox {
				margin-top: 40px;
				margin-right: 16px;
			}
			.pro-info {
				width: calc(100% - 152px);
				margin-left: 16px;
			}
			.pro-img {
				width: 100px;
			}
			.pro-name {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				font-size: 15px;
				span {
					margin-left: 10px;
					font-size: 12px;
					color: #666;
				}
			}
			/deep/.van-button {
				height: 100%;
			}
			.rule {
				font-size: 13px;
				color: #333;
				line-height: 25px;
			}
			.v-submit-bar {
				bottom: 51px;
			}
			.v-check-box {
				margin-right: auto;
			}
			.ch-count {
				margin-top: 22px;
			}
		}
		.van-submit-bar {
			bottom: 49.98px;
			border-top: 1px solid #ededed;
		}
		.van-button--info {
			background-color: #E5C474;
		}
		/deep/.van-nav-bar__text,
		.van-submit-bar__price {
			color: #E5C474;
		}
		.not-shopcart {
			font-size: 18px;
			color: #A8A8A8;
			text-align: center;
			margin-bottom:25px;
			.last-item{
				font-size: 14px;
				margin-top: 10px;
			}
		}
		.not-shopcart-box {
			padding-top: 50px;
		}
		.not-shopcart-icon {
			font-size: 64px;
		}
		.login-text {
			color: #444;
		}
		.like-box {
			margin-top: 10px;
			>div {
				float: left;
				width: calc(~"50% - 15px - 20px");
				background-color: #F0F0F0;
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
				.v-icon {
					font-size: 20px;
					color: red;
				}
			}
		}
	}
</style>