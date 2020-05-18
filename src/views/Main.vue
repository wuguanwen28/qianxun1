<template>
	<div class="main">

		<!-- 二级路由插座 -->
		<router-view></router-view>

		<!--底部导航栏-->
		<van-tabbar v-model="activeName" @change='changeTabbar' inactive-color="#fff" active-color="#9000FC">
			<van-tabbar-item :name="item.name" :icon="item.icon" v-for="(item, index) in tabbarData" :key="index">{{item.text}}</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
	export default {

		name: 'Main',

		data() {
			return {
				//底部导航索引
				activeName: 'Home'
			}
		},

		created() {
			let historyURL = this.$router.history.current.name;
			this.activeName = historyURL;
		},

		methods: {

			changeTabbar(name) {
				this.$router.push({
					name: name
				});
			}

		},

		computed: {
			tabbarData() {
				return this.$store.state.mainModule.tabbarData;
			}
		}

	}
</script>

<style lang="less" scoped="scoped">
	.main {
		width: 100%;
		height: 100%;
		/deep/.van-tabbar {
			background-color: #E5C474;
		}
	}
</style>