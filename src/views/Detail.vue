<template>
	<div class="detail">
		<van-nav-bar title="商品详情" @click-left="returnBack" left-text="返回" :border="false" left-arrow :fixed="true" />

		<div class="detail-box">
			<div class="image">
				<img class="img-auto" :src="productDetailData.large_img" />
				<ul class="pro-box">
					<li class="pro-name">{{productDetailData.name}}</li>
					<li class="pro-name small">{{productDetailData.enname}}</li>
					<li class="pro-like" @click="like">
						<van-icon name="star" size="24px" :color=" isLike ? '#ff0000' : '#ffffff' " />
					</li>
				</ul>
			</div>

			<div class="rule-box">
				<!-- 商品规格 -->
				<div class="pro-rule">
					<div class="rule-item" v-for="(item, index) in rules" :key="index">
						<span class="fl rule-title">{{item.title}}</span>
						<ul class="fl rule-list">
							<li v-for="(value, i) in item.rule" :key="i" :class="{active: value.isActive}" @click="toggleRule(value, index)">{{value.text}}</li>
						</ul>
					</div>
				</div>

				<!-- 商品描述 -->
				<div class="pro-desc">
					<div class="desc-title">商品描述:</div>
					<div class="desc-info">
						<p v-for="(item, index) in desc" :key="index">{{item}}</p>
					</div>
				</div>

				<!-- 价格数量 -->
				<div class="pro-price-count">
					<div class="price fl">￥{{productDetailData.price}}</div>
					<div class="count fr">
						<van-stepper v-model="count" disable-input />
					</div>
				</div>
			</div>
		</div>

		<div class="action">
			<div class="fl cart">
				<van-goods-action-icon @click="goPage('Service')" icon="chat-o" color="#fff" text="客服" />
				<van-goods-action-icon @click="goPage('Shopcart')" icon="cart-o" color="#fff" :badge="shopcartTotal == 0 ? '' : shopcartTotal >= 100 ? '99+' : shopcartTotal" text="购物车" />
			</div>
			<div class="fr">
				<button class="fl" @click="addShopcart">加入购物车</button>
				<button class="fl" @click="commit">立即购买</button>
			</div>
		</div>

	</div>
</template>

<script>
	import { mapState } from 'vuex'

	import { utils } from '../utils/utils.js'

	export default {

		name: 'Detail',

		data() {
			return {
				//商品数量
				count: 1
			}
		},

		created() {

			//加载提示
			this.$toast.loading({
				forbidClick: true,
				duration: 0,
				message: "加载中..."
			});

			this.$store.commit('detailModule/emptyData');

			//截取路由参数
			let pid = this.$route.params.pid;

			pid = pid == undefined ? 'rena_ice002' : pid

			//获取商品详情信息
			this.axios({
				method: 'GET',
				url: '/productDetail',
				params: {
					appkey: this.appkey,
					pid
				}
			}).then(result => {
				if(result.data.code == 600) {
					this.$store.commit('detailModule/changeProductDetailData', result.data.result[0]);
					//关闭加载提示
					this.$toast.clear();

					//查看商品收藏
					this.findlike();
				}
			}).catch(err => {
				//关闭加载提示
				this.$toast.clear();
			})

			this.shopcartRows();

		},

		computed: {
			...mapState('detailModule', ['productDetailData', 'rules', 'desc', 'isLike', 'shopcartTotal'])
		},

		methods: {

			//切换商品规格
			toggleRule(item, index) {

				this.$store.commit('detailModule/toggleRule', {
					item: item,
					index: index
				});

			},

			//返回上一级
			returnBack() {
				this.$router.go(-1);
			},

			//查看当前商品是否被收藏
			findlike() {
				let tokenString = utils.getToken(this);

				if(this.$cookies.get('isLogin') == 'false') {

					return;
				}

				this.axios({
					method: "GET",
					url: "/findlike",
					params: {
						appkey: this.appkey,
						pid: this.productDetailData.pid,
						tokenString
					}
				}).then(result => {
					if(result.data.code == 1000) {
						//修改isLike
						this.$store.commit("detailModule/changeData", {
							key: "isLike",
							value: result.data.result.length > 0
						});
					}
				}).catch(err => {

				});
			},

			//收藏商品
			like() {

				let islogin = utils.isLogin('登录后才能收藏商品，是否登录？', this)
				if(!islogin) {
					return;
				}

				let tokenString = utils.getToken(this);

				let url = this.isLike ? "/notlike" : "/like";

				let icon = this.isLike ? 'star-o' : 'star';

				this.axios({
						method: "POST",
						url,
						data: {
							appkey: this.appkey,
							pid: this.productDetailData.pid,
							tokenString
						},

						transformRequest: utils.transformRequest
					})
					.then(result => {
						//关闭加载提示
						this.$toast.clear();

						//加载提示
						this.$toast({
							message: result.data.msg,
							icon
						});
						//修改isLike
						this.$store.commit("detailModule/changeData", {
							key: "isLike",
							value: !this.isLike
						});
					})
					.catch(err => {

						//关闭加载提示
						this.$toast.clear();
					});

			},

			//加入购物车
			addShopcart(type) {

				let str = type == 'buy' ? '立即购买' : '加入购物车';
				let islogin = utils.isLogin('登录后才能' + str + '，是否登录？', this)
				if(!islogin) {
					return;
				}

				//获取商品规格
				let ruleData = [];
				this.rules.forEach(v => {
					for(let i = 0; i < v.rule.length; i++) {
						if(v.rule[i].isActive) {
							ruleData.push(v.rule[i].text);
							break;
						}
					}
				});

				//获取用户token字段
				let tokenString = utils.getToken(this);

				//发送加入购物车请求
				this.axios({
					method: "POST",
					url: "/addShopcart",
					data: {
						appkey: this.appkey,
						pid: this.productDetailData.pid,
						count: this.count,
						rule: ruleData.join("/"),
						tokenString
					},
					transformRequest: utils.transformRequest
				}).then(result => {

					if(result.data.code == 3000) {
						//加载提示
						this.$toast.success({
							message: result.data.msg
						});
						if(result.data.status == 1) {
							//新增一条数据
							this.$store.commit("detailModule/changeData", {
								key: "shopcartTotal",
								value: this.shopcartTotal + 1
							});
						};

						//如果是立即购买，则跳转到结算页面，携带sid到立即结算页面
						if(type == 'buy') {
							this.$router.push({
								name: 'Pay',
								query: {
									sids: result.data.sid
								}
							});
						}
					}

				}).catch(err => {

				})

			},

			//获取购物车总商品数量
			shopcartRows() {
				let tokenString = utils.getToken(this);
				this.axios({
						method: "GET",
						url: "/shopcartRows",
						params: {
							appkey: this.appkey,
							tokenString
						}
					})
					.then(result => {
						if(result.data.code == 8000) {
							this.$store.commit("detailModule/changeData", {
								key: "shopcartTotal",
								value: result.data.result
							});
						}
					})
					.catch(err => {

					});
			},

			goPage(name) {

				if(name == 'Shopcart') {
					this.$router.push({
						name: name
					})
				}else{
					this.$toast('该功能尚未开放')
				}

			},

			//提交订单 
			commit() {
				this.addShopcart('buy')
			}

		}

	}
</script>

<style lang="less" scoped="scoped">
	.detail {
		background-color: #fff;
		/deep/.van-nav-bar {
			background-color: #CB9D58;
			/deep/.van-nav-bar__title,
			.van-nav-bar__text,
			.van-nav-bar__arrow {
				color: white !important;
			}
		}
		.detail-box {
			width: 100%;
			padding-bottom: 100px;
			padding-top: 46px;
			min-height: 521px;
			position: relative;
		}
		.rule-box {
			width: calc(100% - 20px);
			padding: 0 10px;
		}
		.image {
			width: 100%;
			position: relative;
			.pro-box {
				width: calc(100% - 30px);
				padding: 5px 15px;
				background-color: rgba(0, 0, 0, 0.6);
				position: absolute;
				bottom: 0;
				left: 0;
				overflow: hidden;
			}
			.pro-name {
				float: left;
				font-size: 16px;
				color: #fff;
				line-height: 24px;
				margin-right: 10px;
				&.small {
					font-size: 14px;
				}
			}
			.pro-like {
				float: right;
				width: 24px;
				height: 24px;
			}
		}
		.pro-rule {
			margin-top: 10px;
			padding: 10px;
		}
		.rule-item {
			height: 30px;
			padding: 10px 0;
		}
		.rule-list>li {
			float: left;
			width: 70px;
			height: 30px;
			line-height: 30px;
			color: #333;
			background-color: #F0F2F3;
			margin-right: 20px;
			border-radius: 20px;
			text-align: center;
			font-size: 14px;
			&.active {
				background-color: #CB9D58;
				color: #fff;
			}
		}
		.rule-title {
			line-height: 30px;
			width: 60px;
			font-size: 16px;
			color: #444;
		}
		.pro-desc {
			margin-top: 10px;
		}
		.desc-title {
			color: #444;
			font-size: 16px;
			margin-bottom: 6px;
			margin-left: 10px;
		}
		.desc-info {
			color: #666;
			font-size: 14px;
			padding: 5px 10px;
			border-radius: 8px;
			box-shadow: 2px 2px 3px 1px #CB9D58;
			>p {
				margin: 10px 0 0;
			}
			>p:first-child {
				margin: 0;
			}
		}
		.pro-price-count {
			width: calc(100% - 20px);
			padding: 0 10px;
			height: 50px;
			position: absolute;
			bottom: 50px;
			left: 0;
		}
		.price {
			color: #CB9D58;
			font-size: 18px;
			line-height: 50px;
		}
		.count {
			line-height: 50px;
		}
		.action {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 50px;
			background-color: #E5C474;
			/deep/.van-goods-action-icon {
				background-color: #E5C474;
				color: white;
				margin-right: 10px;
			}
			.cart {
				width: 151px;
				height: 50px;
				display: flex;
				justify-content: center;
			}
			button {
				height: 50px;
				padding: 0 20px;
				color: white;
				font-size: 16px;
				background-color: #D18E29;
			}
			button:last-child {
				background-color: #A55803;
			}
		}
		/deep/ .van-info {
			top: 5px;
			right: -5px;
			background-color: #A55803;
			padding-top: 2px;
		}
	}
</style>