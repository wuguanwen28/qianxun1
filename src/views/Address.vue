<template>
	<div class="address">
		<van-nav-bar title="地址管理" @click-left="returnBack" left-text="返回" :border="false" left-arrow :fixed="true" />
			<div class="empty" v-if="list.length == 0">
				<van-empty description="您还没有收货地址">
				</van-empty>
			</div>
		<div class="address-box">
			<van-address-list :list="list" default-tag-text="默认" @add="increaseAddress" @edit="editAddress" />
		</div>
	</div>
</template>

<script>
	import { utils } from '../utils/utils.js'
	import { mapState } from 'vuex'

	export default {
		name: 'Address',
		created() {

			let tokenString = utils.getToken(this);

			this.axios({
				method: 'GET',
				url: '/findAddress',
				params: {
					appkey: this.appkey,
					tokenString
				}
			}).then(result => {
				if(result.data.code == 20000) {

					//添加详细地址
					this.$store.commit('addressModule/changeData', {
						key: 'addressList',
						value: result.data.result
					})

					//添加展示地址
					let arr = []
					result.data.result.forEach(v => {
						let obj = {};
						obj.aid = v.aid;
						obj.name = v.name;
						obj.tel = v.tel;
						if(v.province == v.city) {
							obj.address = v.city + v.county + v.addressDetail;
						} else {
							obj.address = v.province + v.city + v.county + v.addressDetail;
						}
						obj.isDefault = Boolean(v.isDefault);
						arr.push(obj)
					})
					this.$store.commit('addressModule/changeData', {
						key: 'list',
						value: arr
					})
				}

			}).catch(err => {
				
			})
		},

		computed: {
			...mapState('addressModule', ['list', 'addressList'])
		},
		
		methods: {

			returnBack() {
				this.$router.go(-1)
			},

			increaseAddress() {
				this.$router.push({
					name: 'NewAddress',
					query: {
						isShow: false
					}
				});
			},

			editAddress(item, index) {

				this.$router.push({
					name: 'NewAddress',
					query: {
						aid: item.aid,
						isShow: true
					}
				})
			}

		}
	}
</script>

<style lang="less" scoped>
	.address {
		width: 100%;
		height: 100%;
		background-color: #FAFAFA;
		/deep/.van-nav-bar {
			background-color: #E5C474;
			/deep/.van-nav-bar__title,
			.van-nav-bar__text,
			.van-nav-bar__arrow {
				color: white !important;
			}
		}
		/deep/ .van-address-item .van-radio__icon--checked .van-icon,
		.van-button--danger {
			background-color: #E5C474;
			border-color: #E5C474;
		}
		/deep/ .van-tag--danger {
			background-color: #E5C474;
			padding-top: 3px;
			padding-bottom: 3px;
		}
		/deep/.van-address-list__bottom {
			padding-bottom: 20px;
			background-color: transparent;
		}
		
		/deep/.van-radio__icon{
			display: none;
		}
		.address-box {
			width: 100%;
			padding-top: 46px;
			height: calc(~"100% - 46px");
		}
		.empty{
			padding-top: 46px;
			position: absolute;
			width: 100%;
		}
	}
</style>