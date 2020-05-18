<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
	 body{
    margin: 0 auto;
  }
  
  html,body,#app{
  	width: 100%;
  	height: 100%;
  }
  
  ul{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .img-auto{
    width: 100%;
    display: block;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .clearfix::after{
    content: '';
    display: block;
    clear: both;
  }
  .bgimage{
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
		background-image: url(assets/bg1.jpg);
		background-size: cover;
		background-position: center center;
	}
	
	button{
		border: none;
		outline: none;
	}
</style>
