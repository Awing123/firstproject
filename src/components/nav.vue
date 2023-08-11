<!-- nav栏 -->

<template>
    <div class="nav">
      <router-link to="/"><span>推荐音乐</span></router-link> 
      <router-link to="/hotRank"><span>热歌榜</span></router-link>
      <router-link to="/search"><span>搜索</span></router-link>
    </div>
</template>

<style lang="scss" scoped>
.nav{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
    background: #fff;
    display: flex;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    box-sizing: border-box;

    //justify-content: space-evenly;
    a{
        flex:1;
        text-align: center;
        height:40px;
        line-height: 40px;
        font-size: 15px;
        color: #000;

        span{
            display: inline-block;
            height: 40px;
            line-height: 40px;
            box-sizing: border-box;
            padding: 0 5px ;
        }
        &.router-link-exact-active span {
            color:#DD001B;
            border-bottom:2px solid #DD001B;
            font-weight: bold;
       
       &::before{
            content:""; // ✿
            background-image: url(../assets/wyy.png);
            background-size:11px 11px;
            background-repeat: no-repeat;
            display: inline-block;
            width:13px;
            height:11px;                 
            margin-right: 10px;
        } 
      }
    }
}
</style>