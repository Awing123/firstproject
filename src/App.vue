<template>


  <div id="app">
    <nav-view />
    <router-view class="view" @aaa="bbb" @playTop="playTop1" @bofanlist="bofanlist111"  @indexNum="indexNum111" />

    <div class="play" style="z-index:99;" :style="{ bottom: `${playTop}`+'%' }">     
      <!--   autoplay 自动播放  ;  
      在元素上设置 ref 属性，可以在 Vue 组件中使用 $refs 来访问该元素的引用。
      @timeupdate 事件监听器：在音乐播放器的播放时间更新时触发-->
      <audio ref="audioPlayer" 
      v-if="currentMusic"
      class="play-ausio" 
      :src="`https://music.163.com/song/media/outer/url?id=${currentMusic.id}.mp3`"  
      controls
      autoplay
      @timeupdate="handleTimeUpdate"
      @ended="handleMusicEnd" 
      > </audio>   
      
      <div class="play-content"> 
      <div class="play-img">
          <img v-if=" Object.keys(this.currentMusic).length !== 0" :src="songUrl111+`?param=45y45`" :class="{ imgrotate: imgR === 1 }">
      </div>
       
       <!-- 监听触摸屏幕的开始、移动和结束操作 -->
      <div class="play-name"  @click.stop="togglefullScreen(true)"   @touchstart="handleTouchStart"  @touchmove="handleTouchMove" @touchend="handleTouchEnd"> 
       
        <div class="play-song-name">
          <span :style="{ marginLeft: nameRemove + 'px' }">{{ songName111 }}</span>
        </div>

          <div class="play-artists-name" v-if="Object.keys(this.currentMusic).length !== 0">
            <span :style="{ marginLeft: nameRemove + 'px' }">{{ currentMusic.song.artists[0].name }}</span>
          </div>
      </div>
     <!-- 播放暂停按钮 -->
      <div @click="playMusic" class="button1" v-if="isClickable"> 
        <div :style="{ display:  `${playButton}` }"  class="play-button1"> 
           <i class="iconfont icon-play"></i>
        </div> 
        <div :style="{ display:  `${pauseButton}` }" class="pause-button1">
          <i class="iconfont icon-pause"></i>
         </div> 
      </div>
      <!-- 下一首按钮 -->
      <div @click=" nextMusic" class="play-button2">
        <i class="iconfont icon-go-down"></i>
      </div>
      <!-- 列表按钮 -->
      <div @click="showplayList"  class="play-button3">
        <i class="iconfont icon-musiclist"></i>
      </div>
      </div>

    </div>
    
    <transition name="moveY">
      <!-- 通过Object.keys(currentMusic).length判断currentMusic对象的键的数量是否大于0来判断其是否为空。
          只有当currentMusic不为空时，才会渲染<fullScreen>组件并传递currentMusic属性 -->
   <!--  @playAudio="playAudio" @pauseAudio="pauseAudio"，监听子组件触发的事件，调用相对应方法(2) -->
  <fullScreen v-if="isFullScreen && Object.keys(currentMusic).length > 0" 
    style="z-index:100;" 
    @togglefullScreen="togglefullScreen" 
    @playAudio="playAudio" 
    @pauseAudio="pauseAudio"
    :currentMusic="currentMusic"
    :playNum="playNum" 
    @playNum1="playNum1"
    :playButton="playButton"
    @playButton1="playButton1"
    :progress="currentProgress"
    @rangeValue="rangeValue"
    :currentTime="currentTime"
    @select="select"
    @songCommentpage="songCommentpage"
    :playMusicList="playMusicList"
    @aaa="bbb"
    @indexNum="indexNum111"
    :playindex="playindex"
    @nextSong1="nextSong1" 
    @nextSong2="nextSong2" 
    @upSong1="upSong1"
    @upSong2="upSong2"
    :xhNum="xhNum"
    />

 </transition>

  <!-- 评论 -->
   <transition name="moveX">
    <songComment 
    v-if="issongComment && Object.keys(currentMusic).length > 0" 
    style="z-index:101;" 
    @songCommentpage="songCommentpage"
    :currentMusic="currentMusic"
      />
   </transition>

  <!-- 当前播放列表 -->
    <div v-if="showList && playMusicList.length > 0 ">
      <div class="cove" @click="colseList"></div>  <!-- 覆盖层 -->
      <div class="tiltle">当前播放({{playMusicList.length}})
         <i @click="dingWei" class="iconfont icon-dingwei"></i>
         <i v-if="islove" @click="islove=false" class="iconfont icon-love"></i>
         <i v-else style="color:#e13c3c" @click="islove=true" class="iconfont icon-aixin"></i>
         <i class="iconfont icon-send"></i>
      </div> 
      <div class="playList" >
         <div class="list" ref="SongsContainer">
            <music-list :musicList="playMusicList" :showNum="true" 
            @play="bbb" @indexNum="indexNum111"
            :activeIndex="playindex"/>
         </div>
      </div>
    </div>


  </div>
</template>

<script>
import navView from "./components/nav.vue";
import fullScreen from "./components/fullScreen.vue"
import songComment from "./components/songComment.vue"
import musicList from "./components/musicList.vue";
export default {
  data() {
    return {
      currentMusic: {}, //初始化为空对象 {}  ,空对象不等于 null
      playNum: 1 ,//点击播放按钮次数
      songName:"",  // 默认
      songUrl:"",
      isFullScreen:false,
      playButton: "block",
      imgR: 0,// 图片默认不旋转
      currentProgress: 0 ,//当前audio播放进度为0，（比例）
      currentTime :0,// 当前播放时间
      xhNum: 1 ,// 默认列表循环
      playTop:1,
      issongComment:false, // 是否显示歌取评论
      playMusicList: [], // 当前播放列表
      showList:false,//是否显示播放列表
      playindex: -1 , // 当前播放列表的歌曲index ，默认-1
      yuanlaiindex: 0, // 随机播放的上一次index
      touchStartX: 0,// 触摸开始时的 X 坐标
      touchEndX: 0,// 触摸结束时的 X 坐标
      isSwiping: false, // 是否正在滑动的标志
      nameRemove:0, // 播放器滑动偏移量
      islove:true,// 默认没收藏，播放列表里面的
    };
  },

  components: {////可以看到 components 是复数形式，说明我们可以在这里面定义多个组件
    navView,
    fullScreen,
    songComment,
    musicList
  },

  computed: {
    pauseButton(){
      if(this.playButton== "none"){
        this.imgR=1 // 图片旋转
        return "block";
      }else{
        this.imgR=0
        return "none";
      }
    },

    songUrl111(){ // 播放器图片
           this.songUrl = this.currentMusic.picUrl 
           if(this.songUrl == null) { // 数据形式不一样
            this.songUrl= this.currentMusic.al.picUrl
             }  
             return   this.songUrl
       
    },

    songName111(){
      
      if ( Object.keys(this.currentMusic).length !== 0 ) {
        this.songName = this.currentMusic.name
        return this.songName
      }else{
        return "网易云音乐"
      }
    },

    isClickable(){ // vip歌曲不显示播放暂停按钮
      if(Object.keys(this.currentMusic).length > 0 && this.currentMusic.fee === 1){ // vip歌曲
         this.isFullScreen=true;
         this.imgR=0
        return false
      }else{
        return true
      }
    },

  },

  methods: {
    bbb(music) {  
     //console.log(music)
     this.currentMusic = music
     this.playButton="none"
    },

    playTop1(val){  // 播放器高度
     //  console.log(val)
      this.playTop=val
    },

    bofanlist111(list){ // 当前播放列表
       this.playMusicList=list
     //  console.log(this.playMusicList)
    },

    showplayList(){ // 显示当前播放列表  
      if ( Object.keys(this.currentMusic).length !== 0 ) { // 检查 currentMusic 是否为空
          this.showList = true
      } else {
        console.log("没有音乐可播放3");
      }
    },

    indexNum111(index){ // 传递过来的index
     this.playindex=index
     // console.log(this.playindex)
    },

    nextSong1(){ // 下一首 
     if(this.xhNum === 2){ // 如果选择了随机播放模式
         this.yuanlaiindex=this.playindex // 上一次id
         let index = Math.floor(Math.random() * this.playMusicList.length); // 生成随机索引
         console.log("随机播放索引=>",index)
         this.currentMusic=this.playMusicList[index]
         this.playindex = index  
      }else{      
         this.currentMusic=this.playMusicList[this.playindex+1]
         this.playindex++;
         console.log(this.playindex)
      }
      this.playButton="none";
        this.playNum++;  
      
    },
    nextSong2(){ 
      this.currentMusic=this.playMusicList[0]
      this.playindex = 0
      console.log(this.playindex)
      this.playButton="none";
      this.playNum++;
    },
    upSong1(){ // 上一首
     if(this.xhNum === 2){ // 如果选择了随机播放模式{
        this.currentMusic=this.playMusicList[this.yuanlaiindex]
        this.playindex = this.yuanlaiindex  
        this.yuanlaiindex = Math.floor(Math.random() * this.playMusicList.length); // 当随机模式的上一次显示完后，随机生成索引
     }else{
      this.currentMusic=this.playMusicList[this.playindex-1]
      this.playindex--;
      console.log(this.playindex)
      }
      this.playButton="none";
      this.playNum++;
    },
    upSong2(){
      this.currentMusic=this.playMusicList[this.playMusicList.length-1]
      this.playindex = this.playMusicList.length-1
      console.log(this.playindex)
      this.playButton="none";
      this.playNum++;
    },
    
    // 滑动切歌 ，添加了一个状态标志来判断当前是否正在滑动，避免触摸事件与点击事件之间的冲突
    handleTouchStart(event) { //当用户触摸屏幕时
      this.touchStartX = event.touches[0].clientX;//  表示触摸开始时用户第一个触点相对于浏览器视口的 X 坐标。
      this.isSwiping = false; // 重置滑动标志
    },
    
    handleTouchMove(event) {// 当用户在屏幕上滑动时
      this.touchEndX = event.touches[0].clientX;// 表示用户当前滑动时第一个触点相对于浏览器视口的 X 坐标。
      this.isSwiping = true; // 设置滑动标志为 true
      this.nameRemove = this.touchEndX - this.touchStartX;    
    },

    handleTouchEnd() {   // 当用户停止触摸屏幕时
      if (this.isSwiping && Object.keys(this.currentMusic).length !== 0) { // 只在滑动过程中执行切换歌曲的逻辑
        const swipeDistance = this.touchEndX - this.touchStartX; // 滑动距离
        if (swipeDistance > 105) {// 向右滑动105px，切换到上一首歌曲
            if(this.playindex !== 0){// 判断是不是第一首
              this.upSong1(); 
            } else{
              this.upSong2();  // 回最后一首
            }
        } else if (swipeDistance < -105) {// 向左滑动105px，切换到下一首歌曲
            if(this.playindex !== this.playMusicList.length-1){// 判断是不是最后一首
              this.nextSong1(); 
            } else{
              this.nextSong2();  // 回第一首
            }    
        }    
        this.isSwiping = false; // 重置滑动标志
      }
      this.nameRemove = 0; // 不管怎样，名字都要回位置
    },

    colseList(){ // 关闭当前播放列表
       this.showList = false
    },

    playMusic(){ //播放按钮，控制音乐播放

      if ( Object.keys(this.currentMusic).length !== 0 ) { // 检查 currentMusic 是否为空
          this.playNum++; // 点击次数

            if (this.playNum % 2 === 0) { // 求余为0，为偶数，暂停播放
               this.$refs.audioPlayer.pause();
               this.playButton="block"
           //    console.log("暂停");
            } else {
               this.$refs.audioPlayer.play();
               this.playButton="none"
             //  console.log("播放");
            }         
      } else {
        console.log("没有音乐可播放1");
      }

    },

    nextMusic(){ // 下一首按钮
      if ( Object.keys(this.currentMusic).length !== 0 ) { // 检查 currentMusic 是否为空
          this.nextSong1(); // 下一首
      } else {
        console.log("没有音乐可播放2");
      }
    },
    
    togglefullScreen(val){ //关闭歌词
      this.isFullScreen=val;
    },

    playAudio() {  // 调用的播放方法(1)
      this.$refs.audioPlayer.play();
    },

    pauseAudio() { // 调用的暂停方法(1)
      this.$refs.audioPlayer.pause();
    },

    playNum1(num){  //接收子组件传递的点击次数
      this.playNum=num; // 更新点击次数
    },

    playButton1(playButton1){ // 接收子组件传递过来的按钮状态
      this.playButton=playButton1;
    },

    handleTimeUpdate(event) {   // 处理音乐播放器的时间更新事件
      const audio = event.target; //event.target 获取到音乐播放器的引用
      this.currentProgress = (audio.currentTime / audio.duration) * 100; // 计算出当前的播放进度（即音乐当前时间与总时长的比例）
     // console.log(this.currentProgress)

     this.currentTime = audio.currentTime ; // 获取当前播放时间传给父组件

     if(this.currentProgress == 100){ // 当歌曲放完时
        this.playButton="block";
        this.playNum++;
     }
    },

    rangeValue(percent) { // 通过传过来的滑块比例处理音乐播放进度
      const audio = this.$refs.audioPlayer
      audio.currentTime = audio.duration * percent // 计算点击位置对应的音乐播放时间 ，设置音乐的当前播放时间    
    },

    select(num){   // 判断子组件是否选择了单曲循环
      if(num===3){
        this.xhNum=3
      }else if(num == 2){
        this.xhNum=2
      }else{
        this.xhNum=1
      }
    },

    handleMusicEnd() {  // 当播完进度条 后干什么
      if(this.xhNum === 3){ // 循环播放
          setTimeout(() =>{
             this.$refs.audioPlayer.currentTime = 0;
             this.$refs.audioPlayer.play();
             this.playButton="none";
             this.playNum++;
          },1000)   
      }

      if(this.xhNum === 2){ // 随机播放
       setTimeout(() =>{
         this.yuanlaiindex=this.playindex
         let index = Math.floor(Math.random() * this.playMusicList.length); // 生成随机索引
         console.log("随机播放索引=>",index)
         this.currentMusic=this.playMusicList[index]
         this.playindex = index
         this.playButton="none";
         this.playNum++;
        },1000) 
      }

      if(this.xhNum === 1){ // 顺序播放 
      setTimeout(() =>{
        //  若索引为最后一个
         if(this.playindex === this.playMusicList.length-1){
            this.currentMusic=this.playMusicList[0]
            this.playindex = 0
         }else{
            this.currentMusic=this.playMusicList[this.playindex+1]
            this.playindex++;
         }
         this.playButton="none";
         this.playNum++;
        },1000) 
      }
    
    },

    songCommentpage(val){// 关闭页面      
      this.issongComment=val  
    },

    dingWei(){// 歌曲列表定位当前播放歌曲
      const SongsContainer = this.$refs.SongsContainer; //获取到列表容器的 DOM 元素
      const highlightedLine = SongsContainer.getElementsByClassName('active')[0];// 获取具有高亮类名的元素
     if (highlightedLine) {  // 滚动到可视区域
        highlightedLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
     }
    },
   

  },


};
</script>

<style lang="scss">
@keyframes rotation {
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
 }

.imgrotate{ //图片旋转
   animation: rotation 6s linear infinite;
 }

#app {
  
  font-family: Avenir, Helvetica, Arial, sans-serif;
 }
.view {
  margin-top: 40px;
 }

.play{
  background: rgba(0, 0, 0,0.5);
  // linear-gradient(to right, #00fbff , #0df983) 渐变不好看
  position: fixed;
  bottom: 1%;
  left: 3%;
  width: 94%;
 
  border-radius: 24px;
  
  .play-ausio{
    display: none; //隐藏audio控制面板
  }
   // .play-ausio::-webkit-media-controls-timeline {
   //     display: none;  //隐藏进度条
   // }
   // .play-ausio::-webkit-media-controls-play-button {
   //    display: none; //隐藏暂停按钮
   // }

  .play-content{
    display: flex;
    align-items: center;
    padding-right: 15px;
   

    .play-img{
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: 2px solid rgb(255, 255, 255);
      background: url(./assets/songimg.png) no-repeat;
      background-size: contain;
      overflow: hidden;
      margin: 1px 12px 1px 1px;
      box-sizing: border-box;

     
    }

    .play-name{
        flex: 1;
        letter-spacing: 1px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: normal;
        margin-right: 30px;

        .play-song-name{
          color: #fff;
          font-size: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: normal;
        }

        .play-artists-name{
          color: #c8c8c8;
          font-size: 11px;
        }
    }

    .button1{
      position: relative;
     
      .play-button1{      
        width: 32px;
        height: 32px;
        position: absolute;
        top: -14px;
        left: -29px;  
        text-align: center;
        i{
          color: #fff;
          font-size: 18px;
        }
     }

      .pause-button1{
        width: 32px;
        height: 32px;
        position: absolute;
        top: -16px;
        left: -29px;
        text-align: center;
        i{
          color: #fff;
          font-size: 18px;
          line-height: 32px;
        }
     }

    }

    .play-button2{
      margin: 0 4px;
      width: 24px;
      height: 24px;
      i{
        color: #ffffff;
        font-size: 23px;
        line-height: 26px;
      }
    }

    .play-button3{
      margin: 0 4px;
      width: 24px;
      height: 24px;

      i{
        color: #ffffff;
        font-size: 23px;
        line-height: 27px;
      }
    }
    
    .play-button1:active,
    .play-button2:active,
    .play-button3:active{
      opacity: 0.5;
    }
  }

 }

// 歌词
.moveY-enter-active,
.moveY-leave-active{
  transition: all 0.3s linear;
 }

.moveY-leave-to,
.moveY-enter{
  transform: translateY(100%);
 }

.moveY-leave,
.moveY-enter-to{
  transform: translateY(0);
 }

// 评论区
.moveX-enter-active,
.moveX-leave-active{
  transition: all 0.3s linear;
 }

.moveX-leave-to,
.moveX-enter{
  transform: translateX(100%);
 }

.moveX-leave,
.moveX-enter-to{
  transform: translateX(0);
 }

// 播放列表
.cove{
   width: 100%;
   height: 100%;
  // background: rgba(0, 0, 0, 0.5);
   -webkit-backdrop-filter: blur(5px) brightness(100%);
   backdrop-filter: blur(5px) brightness(100%);
   position: fixed;
   bottom: 0;
   left: 0;
   z-index: 99;
}
.tiltle{
   color: #d1d1d1;
    letter-spacing: 1px;
    position: fixed;
    bottom: 60%;
    left: 0;
    background: #000000;
    width: 100%;
    height: 30px;
    padding: 0 10px;
    z-index: 99;  

    i:first-child{ 
      margin-left: 45%;
      font-size: 20px;
    }

    i{
      font-size: 18px;
      margin: 0 8px;
    }
    i:active{
      opacity: 0.5;
    }

  }

.playList{
  width: 100%;
  height: 60%;
  background: #000000;
  color: #fff;
  position: fixed;
  bottom: 0px;
  left: 0;
  z-index: 120; 

 .list{
  height: 100%;
  overflow: auto;
  scrollbar-width: none; /* 取消滚动条宽度 */
  -ms-overflow-style: none; /* 禁用 IE 和 Edge 浏览器的滚动条 */
 }

  .list::-webkit-scrollbar{ /* 隐藏滚动条 */
       display: none; /* Chrome, Safari, and Opera */
  }

}



</style>
