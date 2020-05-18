<template>
	<div class="welcome">		
		<div class="content">
			<div class="logo">
				<img src="../assets/logo.png" class="img-auto" />
			</div>
			<h4 class="title">一滴馨香入口&nbsp;&nbsp;却是人间百态</h4>
			<div class="goHome">
				<div class="fl">
					<img src="../assets/icon/coffee.png" class="img-auto" />
				</div>
				<div class="fl" @click="goregister('Home')">进去逛逛 &rsaquo;&rsaquo;</div>
			</div>
			<div class="btn-box">
				<van-button @click="goregister('Login')" class="fl btn" type="warning">登&nbsp;录</van-button>
				<van-button @click="goregister('Register')" class="fr btn" color="#833EFC" plain>注&nbsp;册</van-button>
			</div>
		</div>
		<div class="bgimage"></div>
	</div>
</template>

<script>
	
	export default {
		
		name: "Welcome",
		
		created(){
			localStorage.setItem('isLogin', false);
		},
		methods:{
			goregister(name){
				if(name == 'Home'){
					localStorage.setItem('isLogin', false);
					localStorage.removeItem('w_token')
				}
				this.$router.push({name: name});
			}
		}
		
	}
	
</script>

<style lang="less" scoped="scoped">

	.welcome{
		width: 100%;
		height: 100%;
	}
	
	.content{
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: rgba(22,22,44,0.5);
		z-index: 1;
	}
	
	.logo{
		width: 220px;
		margin: 40px auto 10px;
	}
	
	.title{
		width: 100%;
		text-align: center;
		height: 40px;
		line-height: 40px;
		font-size: 18px;
		color: white;
		font-weight: normal;
		margin: 25px auto;
	}
	
	.goHome{
		height: 28px;
		width: 123px;
		margin: 100px auto;
		div:first-child{
			width: 20px;
			margin-right: 10px;
		}
		div:last-child{
			color: white;
			font-size: 16px;
		}
		
	}
	
	.btn-box{
		width: 240px;
		margin: 75px auto 0;
		overflow: hidden;
		>.btn{
			width: 100px;
			border-radius: 8px;
			font-size: 16px;
		}
		>.btn:last-child{
			background-color: transparent;
			border: 2px solid #833EFC;
			font-weight: bold;
		}
	}

</style>