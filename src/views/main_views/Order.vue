<template>
	<div class="order">
		<van-tabs v-model="activeName" :swipeable="true" :border="false" color="#E5C474" title-active-color="#E5C474" background="#FCFAF2" @change="toggleTab" title-inactive-color="#444" line-height="2px" sticky>
			<van-tab :title="item.title" :name="item.name" v-for="(item, index) in tabData" :key="index">
				<div v-show="isShow">
					<van-empty description="您还没有相关的订单">
					</van-empty>
				</div>
				<div class="top-padding"></div>
				<div class="orderContent">
					<!--每一个订单-->
					<div class="order-item" v-for="(item1, index1) in orderData" :key="index1">

						<div class="item">
							<van-cell :title="item1.oid" :value="item1.status == 1 ? '等待确认收货' : '交易成功'" />

							<!-- 订单的每一个商品数据 -->
							<div class="clearfix pro-item" @click="goDetail(item2)" v-for="(item2, index2) in item1.data" :key="index2">
								<div class="pro-img fl">
									<img class="img-auto" :src="item2.smallImg" alt="" />
								</div>
								<div class="pro-desc fl">
									<div class="pro-name">
										<div class="ch-name">{{item2.name}}</div>
										<div class="en-name">{{item2.enname}}</div>
									</div>
									<div class="pro-rule">{{item2.rule}}</div>
								</div>
								<div class="pro-info fr">
									<div class="pro-price">￥{{item2.price}}</div>
									<div class="pro-count">x{{item2.count}}</div>
								</div>
							</div>

						</div>

						<div class="item clearfix">
							<div class="fl order-text order-time">{{item1.orderTime}}</div>
							<div class="fr clearfix">
								<span class="fl text">共计 {{item1.count}} 件商品 合计：</span>
								<span class="fl price">￥{{item1.total}}</span>
							</div>
						</div>
						<div class="c-button">
							<button @click="removeOrder(item1.oid, index1)" v-if="item1.status != 1" class="b-left">删除订单</button>
							<button @click="confirmReceive(item1.oid, index1)" v-if="item1.status == 1" class="b-right">确认收货</button>
							<button @click="addShopcart(item1.data)" v-else class="b-add">加入购物车</button>
						</div>
					</div>

				</div>

			</van-tab>
		</van-tabs>

	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { utils } from '../../utils/utils'

	export default {
		name: "Order",
		created() {
			this.$store.commit('orderModule/emptyData')
			let islogin = utils.isLogin('请先登录', this)
			if(!islogin) {
				return;
			}
			this.getOrder(0)
		},
		data() {
			return {
				activeName: '0',
				isShow: false
			}
		},
		computed: {
			...mapState('orderModule', ['tabData', 'orderData'])
		},

		methods: {
			//获取订单数据
			getOrder(status) {

				let tokenString = utils.getToken(this);

				//加载提示
				this.$toast.loading({
					forbidClick: true,
					duration: 0,
					message: "加载中..."
				});

				this.axios({
					method: 'GET',
					url: '/findOrder',
					params: {
						appkey: this.appkey,
						tokenString,
						status
					}
				}).then(result => {
					this.$toast.clear();

					//获取所有订单号数据
					let orderData = [];
					//查询订单oid
					let orderNos = [];
					result.data.result.forEach(v => {
						if(orderNos.indexOf(v.oid) === -1) {
							orderNos.push(v.oid);
						}
					})

					orderNos.forEach(v => {

						//当前订单数据
						let currentOrderData = {
							oid: v,
							count: 0,
							total: 0,
							//当前订单的所有商品数据
							data: []
						};

						result.data.result.forEach(item => {

							if(item.oid == v) {
								currentOrderData.data.push(item);
								currentOrderData.count += item.count;
								currentOrderData.total += item.count * item.price;
							}

						})

						//订单时间
						currentOrderData.orderTime = utils.formatDate(new Date(currentOrderData.data[0].createdAt), 'yyyy-MM-dd hh:mm:ss');
						currentOrderData.status = currentOrderData.data[0].status;
						orderData.push(currentOrderData);

					})
					this.$store.commit('orderModule/changeData', {
						key: 'orderData',
						value: orderData
					})

					if(this.orderData.length == 0) {
						this.isShow = true
					} else {
						this.isShow = false
					}

				}).catch(err => {
					this.$toast.clear();

				})

			},

			//确认收货
			confirmReceive(oid, index) {

				let tokenString = utils.getToken(this);

				//加载提示
				this.$toast.loading({
					forbidClick: true,
					duration: 0,
					message: "加载中..."
				});

				this.axios({
					method: 'POST',
					url: '/receive',
					data: {
						appkey: this.appkey,
						tokenString,
						oid
					},
					transformRequest: utils.transformRequest
				}).then(result => {
					this.$toast.clear();
					//加载提示
					this.$toast.success({
						message: result.data.msg
					});
					this.orderData[index].status = 2;
					if(this.activeName == 1) {
						//删除orderData数组的元素
						this.$store.commit('orderModule/removeOrderData', index);
					}
					if(this.orderData.length == 0) {
						this.isShow = true
					} else {
						this.isShow = false
					}

				}).catch(err => {
					this.$toast.clear();

				})

			},

			//切换标签
			toggleTab(status) {
				if(localStorage.getItem('isLogin') == null || localStorage.getItem('isLogin') == 'false') {
					this.$toast('请先登录')
					return;
				}
				this.getOrder(status);
			},

			//删除订单
			removeOrder(oid, index) {

				let tokenString = utils.getToken(this);

				//加载提示
				this.$toast.loading({
					forbidClick: true,
					duration: 0,
					message: "加载中..."
				});

				this.axios({
					method: 'POST',
					url: '/removeOrder',
					data: {
						appkey: this.appkey,
						tokenString,
						oid
					},
					transformRequest: utils.transformRequest
				}).then(result => {
					this.$toast.clear();
					//加载提示
					this.$toast.success({
						message: result.data.msg
					});
					//删除orderData数组的元素
					this.$store.commit('orderModule/removeOrderData', index);
					if(this.orderData.length == 0) {
						this.isShow = true
					} else {
						this.isShow = false
					}
				}).catch(err => {
					this.$toast.clear();

				})
			},

			addShopcart(item) {

				item.forEach(v => {
					//获取用户token字段
					let tokenString = utils.getToken(this);

					//发送加入购物车请求
					this.axios({
						method: "POST",
						url: "/addShopcart",
						data: {
							appkey: this.appkey,
							pid: v.pid,
							count: v.count,
							rule: v.rule,
							tokenString
						},
						transformRequest: utils.transformRequest
					}).then(result => {

						if(result.data.code == 3000) {
							//加载提示
							this.$toast.success({
								message: result.data.msg
							});

						}

					}).catch(err => {

					})
				})

			},

			//查看商品详情
			goDetail(item) {
				this.$router.push({
					name: 'Detail',
					params: {
						pid: item.pid
					}
				})
			}

		}
	}
</script>

<style lang="less" scoped="scoped">
	.order {
		width: 100%;
		height: calc(~"100% - 50px");
		background-color: #FCFAF2;
		padding-bottom: 50px;
		overflow-y: auto;
		.top-padding {
			position: sticky;
			width: 100%;
			top: 44px;
			height: 10px;
			background-color: #FCFAF2;
			z-index: 10;
		}
		.pro-item {
			margin-top: 10px;
		}
		.order-time {
			line-height: 21px;
		}
		.order-no {
			font-size: 12px;
			color: #444;
		}
		.order-text {
			font: 16px;
			color: #a8a8a8;
		}
		.order-item {
			border-radius: 5px;
			overflow: hidden;
			width: calc(~"100% - 40px");
			padding: 0 10px;
			margin: 0 auto;
			margin-bottom: 10px;
			background-color: #fff;
			border-radius: 8px;
		}
		.item {
			margin-top: 5px;
		}
		.pro-img {
			width: 70px;
		}
		.pro-desc {
			margin-left: 10px;
		}
		.pro-name {
			height: 44px;
			margin-bottom: 10px;
		}
		.ch-name {
			font-size: 16px;
		}
		.en-name {
			font-size: 12px;
			color: #a8a8a8;
			line-height: 21px;
		}
		.pro-rule {
			height: 16px;
			line-height: 16px;
			font-size: 12px;
			color: #a8a8a8;
		}
		.pro-price {
			height: 44px;
			color: #444;
			font-size: 12px;
			line-height: 21px;
			margin-bottom: 10px;
		}
		.pro-count {
			font-size: 10px;
			color: #a8a8a8;
			height: 16px;
			line-height: 16px;
			text-align: right;
		}
		.text {
			color: #999;
			font-size: 10px;
			line-height: 21px;
		}
		.price {
			font-size: 16px;
			font-weight: bold;
			color: #444;
		}
		.bottom-item {
			margin: -5px 5px 0;
			padding: 0;
			height: 10px;
			position: relative;
			z-index: -1;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
			background-color: #fff;
		}
		.bottom-button {
			width: 160px;
			background-color: #E5C474;
			border-color: #E5C474;
		}
		/deep/.van-cell {
			padding: 0px 0px 5px;
			font-size: 13px;
		}
		/deep/.van-cell:not(:last-child)::after {
			border-color: #999;
			left: 0px;
		}
		.c-button {
			margin-top: 10px;
			margin-bottom: 10px;
			display: flex;
			justify-content: flex-end;
			>button {
				background-color: transparent;
				height: 30px;
				border-radius: 15px;
				padding: 0px 10px;
			}
			.b-left {
				border: 1px solid #999;
				color: #999;
				margin-right: 10px;
			}
			.b-right {
				border: 1px solid #9000fc;
				color: #9000fc;
			}
			.b-add {
				border: 1px solid #999;
				color: #999;
			}
		}
	}
</style>