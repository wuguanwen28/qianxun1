<template>
	<div class="new-addreess">
		<van-nav-bar :title="isDelete ? '编辑地址' : '新增地址'" left-text="返回" left-arrow :fixed="true" @click-left="back" />

		<van-address-edit :area-list="addressList" :address-info="addressInfo" :show-set-default="isDefault" :show-delete="isDelete" :show-postal="isPostal" save-button-text="保存地址" delete-button-text="删除地址" detail-rows="2" detail-maxlength="50" @save="saveAddress" @delete="deleteAddress" />
	</div>
</template>

<script>
	import addressList from '../data/addressList'

	import { utils } from '../utils/utils.js'

	export default {
		name: 'NewAddress',

		created() {
			let query = this.$route.query;
			this.isDelete = query.isShow;

			if(this.isDelete) {
				this.$toast.loading({
					forbidClick: true,
					duration: 0,
					message: "加载中..."
				});
				let tokenString = utils.getToken(this);
				this.axios({
					method: 'GET',
					url: '/findAddressByAid',
					params: {
						appkey: this.appkey,
						tokenString,
						aid: query.aid
					}
				}).then(result => {
					this.$toast.clear();
					this.addressInfo = result.data.result[0];
					this.addressInfo.isDefault = Boolean(this.addressInfo.isDefault)
				}).catch(err => {
					this.$toast.clear();
					
				})
			}

		},

		data() {
			return {

				//显示默认地址
				isDefault: true,

				//是否显示删除
				isDelete: true,

				//是否显示邮政编码
				isPostal: true,

				//地址选择数据
				addressList,

				//初始化组件地址内容，编辑地址需要用到
				addressInfo: {}

			};
		},

		methods: {
			//返回上一级
			back() {
				this.$router.go(-1);
			},

			//保存或编辑地址
			saveAddress(addressContent) {
				//addressContent: 地址内容
				addressContent.appkey = this.appkey;
				addressContent.tokenString = utils.getToken(this);
				delete addressContent.country;
				addressContent.isDefault = Number(addressContent.isDefault);
				if(this.isDelete) {
					addressContent.aid = this.addressInfo.aid
				}
				let url = this.isDelete ? '/editAddress' : '/addAddress';
				this.axios({
					method: 'POST',
					url: url,
					data: addressContent,
					transformRequest: utils.transformRequest
				}).then(result => {
					this.back();
				}).catch(err => {
					
				})
			},

			//删除地址
			deleteAddress(item) {
				let tokenString = utils.getToken(this);
				this.axios({
					method: 'POST',
					url: '/deleteAddress',
					data: {
						appkey: this.appkey,
						tokenString,
						aid: item.aid
					},
					transformRequest: utils.transformRequest
				}).then(result => {
					this.back();
				}).catch(err => {
					
				})
			}

		}
	}
</script>

<style lang="less" scoped>
	.new-addreess {
		padding-top: 46px;
		height: calc(~"100% - 46px");
		background-color: #fff;
		/deep/ .van-button--danger {
			background-color: #E5C474;
			border-color: #E5C474;
		}
		/deep/.van-switch--on {
			background-color: #E5C474;
		}
		/deep/.van-nav-bar {
			background-color: #E5C474;
			/deep/.van-nav-bar__title,
			.van-nav-bar__text,
			.van-nav-bar__arrow {
				color: white !important;
			}
		}
	}
</style>