<template>
	<div class="home">
		<div class="title">众里寻他千百度</div>

		<!-- 轮播 -->
		<div class="swipe">
			<van-swipe :autoplay="3000" :loop="true" indicator-color="white">
				<van-swipe-item v-for="(item, index) in bannerData" :key="index">
					<img class="img-auto" :src="item.bannerImg" alt="">
				</van-swipe-item>
			</van-swipe>
		</div>

		<!--标签页-->
		<van-tabs v-model="activeName" @click="getProductsData" :border="false" color="#A55803" background="transparent" title-inactive-color="#666" title-active-color="#A55803">
			<van-tab :replace="true" v-for="(item, index) in typeData" :key="index" :title="item.typeDesc" :name="item.type">

			</van-tab>
		</van-tabs>

		<div class="content-box">
			<!--中间图片-->
			<div class="waiting">
				<div><img class="img-auto" src="../../assets/icon/text.png" /></div>
				<div><img class="img-auto" src="../../assets/icon/uugai.png" /></div>
				<van-divider class="divider" :style="{borderColor:'#fff'}">我们一直在这等你</van-divider>
			</div>

			<div class="content">
				<transition-group name="van-slide-left">
					<div class="content-item" @click="goDetail(item.pid)" v-for="(item, index) in pData" :key="index">
						<div class="pro-img">
							<img class="img-auto" :src="item.smallImg" alt="">
						</div>
						<div class="pro-desc">
							<div class="pro-name">
								<div class="ch-name">{{item.name}}</div>
								<div class="en-name">{{item.enname}}</div>
							</div>
							<div class="pro-price">￥{{item.price}}</div>
						</div>
						<div class="flower">
							<img src="../../assets/flower1.png" />
						</div>
					</div>
				</transition-group>
			</div>
		</div>

	</div>
</template>

<script>
	import { mapState } from 'vuex'

	export default {

		name: 'Home',

		created() {

			if(this.homeIsLoaded) {
				this.activeName = this.isActive
				this.transition();
				//如果请求过，不再请求
				return;
			}

			//初始化页面数据
			//获取banner图数据
			this.getBanner();

			this.getType();

			this.getProductsData('isHot');

			this.$store.commit('homeModule/changeData', {
				data: true,
				key: 'homeIsLoaded'
			})

		},
		data() {
			return {
				activeName: 'isHot',
				pData: []
			}

		},

		computed: {

			...mapState('homeModule', ['bannerData', 'typeData', 'ProductsData', 'ProductsDatas', 'homeIsLoaded', 'isActive'])

		},

		methods: {

			//获取轮播图
			getBanner() {
				this.axios({
					method: 'GET',
					url: '/banner',
					//get请求携带的参数
					params: {
						appkey: this.appkey
					}
				}).then(result => {

					if(result.data.code == 300) {

						this.$store.commit('homeModule/changeData', {
							data: result.data.result,
							key: 'bannerData'
						});
					}

				})
			},

			//获取商品类型
			getType() {
				this.axios({
					method: 'GET',
					url: '/type',

					//get请求携带的参数
					params: {
						appkey: this.appkey
					}
				}).then(result => {

					let types = result.data.result;

					types.unshift({
						id: 0,
						type: 'isHot',
						typeDesc: '最新热销'
					})

					if(result.data.code == 400) {
						this.$store.commit('homeModule/changeData', {
							data: types,
							key: 'typeData'
						});
					}

				}).catch(err => {

				})
			},

			//获取商品数据
			getProductsData(name) {

				//加载提示
				this.$toast.loading({
					forbidClick: true,
					duration: 0,
					message: '加载中...'
				})

				this.$store.commit('homeModule/changeData', {
					data: name,
					key: 'isActive'
				})

				if(this.ProductsDatas[name].length > 0) {
					this.$store.commit('homeModule/changeData', {
						data: this.ProductsDatas[name],
						key: 'ProductsData'
					});
					this.$toast.clear();

					this.transition();

					return;
				}

				this.axios({
					method: 'GET',
					url: '/typeProducts',
					params: {
						appkey: this.appkey,
						key: name == 'isHot' ? 'isHot' : 'type',
						value: name == 'isHot' ? 1 : name
					}
				}).then(result => {
					let types = result.data.result
					//加载提示
					this.$toast.clear();
					if(result.data.code == 500) {
						this.$store.commit('homeModule/changeData', {
							data: types,
							key: 'ProductsData'
						});
						this.$store.commit('homeModule/changeProductsDatas', {
							data: types,
							type: name
						});

					}
				}).catch(err => {
					this.$toast.clear();
				})

				this.transition();

			},

			//查看商品详情
			goDetail(pid) {
				this.$router.push({
					name: 'Detail',
					params: {
						pid: pid
					}
				})
			},

			//动画效果
			transition() {
				let i = 0
				this.pData = [];
				let times = setInterval(() => {
					if(this.ProductsData[i] == undefined) {
						clearInterval(times)
						return
					}
					this.pData.push(this.ProductsData[i])
					i++;
				}, 200)
				console.log('aaa=> ',this.pData)
			}

		}
	}
</script>

<style lang="less" scoped="scoped">
	.home {
		width: 100%;
		height: calc(100% - 49.98px);
		background-color: #FCFAF2;
		.title {
			width: 375px;
			background-color: #E5C474;
			height: 50px;
			line-height: 50px;
			color: white;
			text-align: center;
			font-size: 18px;
		}
		/deep/.van-tabs {
			margin-bottom: 8px;
			margin-top: 8px;
		}
		.waiting {
			display: flex;
			width: 355px;
			align-items: center;
			flex-direction: column;
			background-image: url(../../assets/m_bg.jpg);
			background-position: center center;
			background-size: cover;
			padding: 11px 0;
			margin: 0 auto;
			>div {
				width: 90px;
				color: white;
				font-size: 18px;
			}
			.divider {
				width: 260px;
				margin-top: 9px;
				margin-bottom: 9px;
			}
		}
		.content-box {
			width: 100%;
			height: 344px;
			overflow-y: auto;
		}
		.content {
			width: calc(100% - 20px);
			overflow-y: auto;
			padding: 10px;
			.content-item {
				height: 80px;
				padding: 10px;
				display: flex;
				margin-bottom: 10px;
				border: 1px dashed #A55803;
				position: relative;
			}
			>.content-item:last-child {
				margin-bottom: 0;
			}
			.flower {
				height: 100%;
				position: absolute;
				bottom: -5px;
				right: -5px;
				>img {
					height: 100%;
					display: block;
				}
			}
			.pro-img {
				width: 80px;
			}
			.pro-desc {
				width: calc(~"100% - 80px - 10px");
				margin-left: 10px;
			}
			.pro-name {
				height: 60px;
			}
			.pro-price {
				height: 20px;
				font-size: 15px;
				line-height: 20px;
				color: #A55803;
			}
			.ch-name {
				font-size: 18px;
				color: #333;
			}
			.en-name {
				font-size: 14px;
				color: #666;
			}
		}
	}
</style>