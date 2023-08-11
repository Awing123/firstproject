<template>
  <div class="fullScreen" :style="{ backgroundImage: `url(${bgPicUrl})`,  marginTop: fullRemove > 50 ? fullRemove + 'px' : 0   }" > <!-- 动态绑定背景 -->  
    <!-- 覆盖层     若是唱片页面，添加BGfilter类 模糊背景-->
    <div class="cover" :class="{BGfilter: isRecord}">
      <div class="header">
        <div class="close-img" @click="close">
          <i class="close-icons"></i>
        </div>
        <!-- 歌曲名 -->
        <div class="title">
          <div class="music-name">{{currentMusic.name}}</div>
          <div class="artists">
            <em class="artist-name" v-for="(artist,i) in currentMusic.song.artists" :key="i">
              <span>
                {{artist.name}}
                <span v-if="i != currentMusic.song.artists.length -1">/</span>
              </span>
            </em>
          </div>
        </div>
        <!-- 分享 -->
        <div  class="send-img">
          <i class="iconfont icon-send1"></i>
        </div>
     </div>

     <!-- vip歌曲頁面 -->   
    <div v-if="isvipshow">

      <!-- 遮罩层 因为点击播放会警告-->
     <div class="vipcover"> </div>

      <div v-if="isvipboxshow">
        <div class="vip-box">
         <!-- 标题 -->
          <div class="vipboxname">
            <div>开通会员</div>
            <div class="img">
             <i class="icon-img" @click="closevip"></i>
            </div>
          </div>

         <!-- 内容 --> 
          <div class="vipcontainer">
            <p>该资源为VIP专享，开通VIP畅听无阻</p>
            <h3>VIP尊享</h3>
            <ul>
              <li>
                <img src="	https://p2.music.126.net/cYUpW4goSwbti3HrxnX15A==/109951163313887505.png">
                <p>VIP专享曲库</p>
              </li>
              <li>
                <img src="	https://p2.music.126.net/YHSR4veoeUsvGJTv_v-7Ng==/109951163338867812.png">
                <p>千万歌曲免费下载</p>
              </li>
              <li>
                <img src="https://p2.music.126.net/SU7SvJlQ05Letfh0lP3KLQ==/109951163338834323.png">
                <p>无损音质</p>
              </li>
            </ul>
            <div class="buyvip">
              <button>新客2.8元开通</button>
              <div>仅购买此曲
                 <img src="	https://p1.music.126.net/42cgIW12-bI1p6wSOuE6dw==/109951164007052346.png">
              </div> 
            </div>

            <div class="wait">
              即将自动播放下一首
            </div>
          </div>  
        </div>
      </div>
     
    </div>

    <div>
    <!-- 唱片 -->
    <div v-if="isRecord" class="record" @click="isRecord=false" >  
      <!--  给唱片区域添加监听器 ,监听触摸屏幕的开始、移动和结束操作-->
       <div  @touchstart="handleTouchStart"  @touchmove="handleTouchMove" @touchend="handleTouchEnd">
       <div class="cdbg">
       <div class="cd" :class="{cdRotate: playButton === 'none'}"  :style="{  marginLeft: cdRemove + 'px' }">
         <img :src="bgPicUrl+`?param=200y200`"/>
       </div></div>
       <!-- :style 用来判断起始位置 ，:class给动画 -->
       <div class="ab" style=" transform-origin: left top;" 
       :style="{transform: playButton === 'none' ? 'rotate(0deg)' : 'rotate(-30deg)'}"
       :class="{abPauseRotate: playButton === 'block', abPlayRotate: playButton !== 'block'}" > 
        <img src="../assets/needle-ab.png"/>
      </div> 
      </div>
    </div>
   
      <!-- 歌词 -->
      <div v-else class="lyric" @click="isRecord=true"> 
        <ul ref="lyricsContainer">
          <!-- 当索引等于高亮索引时，添加 highLighteline 高亮类名 -->
          <li v-for="(item,i) in lyricArray1" :key="i" :class="{ highLighteline: i === currentLine }">
            {{item.lyric}}</li>
        </ul>
      </div>
    </div>

     <!-- 选择模式 -->
    <div class="imgcounter" :style="{ display:  `${imgShow}` }">
    <div class="img1" @click="select_img1">
          <div class="icon">
             <i class="iconfont icon-shunxv"></i>
           </div>    
            <div class="title">顺序播放</div>
       </div>   
        <div class="img2" @click="select_img2">
          <div class="icon">
             <i class="iconfont icon-suiji"></i>
          </div>    
            <div class="title">随机播放</div>
       </div>  
        <div class="img3" @click="select_img3">
          <div class="icon">
            <i class="iconfont icon-xunhuan"></i>
          </div>    
            <div class="title">单曲循环</div>
       </div>          
          </div>  
          
            

      <!-- 操作页面 -->
      <div class="oper">
         <!-- 视频和铃声 -->
          <div class="mvicon">
            <i class="iconfont icon-mv"></i> 
            <i class="iconfont icon-chime"></i>
        </div>  

        <!-- 阿里图标，改大小用font-size -->
        <div class="oper-all1">
          <div class="love">
             <i  v-if="love" @click="love=false" class="iconfont icon-love"></i>
             <i v-else style="color:#e13c3c;" @click="love=true" class="iconfont icon-aixin"></i>
          </div>
          <div class="microphone">
            <i class="iconfont icon-microphone"></i>
          </div>
          <div class="down">
            <a :href="`https://music.163.com/song/media/outer/url?id=${currentMusic.id}.mp3`" 
            > 
            <i class="iconfont icon-down"></i></a>
          </div>
          <div class="comment">
            <span>{{total1}}</span>
            <i class="iconfont icon-comment" @click="clickComment"></i>
          </div>
          <div class="more">
            <i class="iconfont icon-more"></i>
          </div>
        </div>
        
        <!-- 进度条 -->
        <div class="inputRange">
          <span>{{startTime}}</span>
        <input type="range" min="0"  max="100"
        :value="progress" @input="rangeValue"  class="progress-bar" />
        <span>{{endTime}}</span>
        </div>


        <div class="oper-all2">
          <!-- 模式 -->
          <div class="select_play" @click="select_img">
            <div :style="{ display:  `${imgShow1}` }">
              <i class="iconfont icon-shunxv"></i>
            </div> 
            <div :style="{ display:  `${imgShow2}` }">
              <i class="iconfont icon-suiji"></i>
            </div> 
            <div :style="{ display:  `${imgShow3}` }">
              <i class="iconfont icon-xunhuan"></i>
            </div> 
          </div> 
        
        <!-- 上一首 -->
          <div class="go_up" >
             <i @click="previousSong" class="iconfont icon-go-up"></i> 
          </div>
          <!-- 播放暂停 -->
          <div class="p_or_s" @click="play"> 
            <div :style="{ display:  `${playButton}` }" class="icon-img">
              <i  class="iconfont icon-play"></i>
            </div>
            <div :style="{ display:  `${pauseButton}`}" class="icon-img_1">
              <i  class="iconfont icon-pause"></i>
            </div>
             </div>
             <!-- 下一首 -->
          <div class="go_down" >
             <i @click="nextSong" class="iconfont icon-go-down"></i>
           </div>
          <!-- 播放列表 -->         
          <div class="music_list" >  
            <i class="iconfont icon-musiclist" @click="showplayList" ></i> 
            <span class="list-text">{{playMusicList.length}}</span>
          </div>
          
        </div>
      </div>

    </div>

  <!-- 当前播放列表 -->
  <!-- 覆盖层 -->
  <div v-if="showList && playMusicList.length > 0 ">
    <!-- vue-touch 的下划 -->
  <v-touch v-on:swipedown="swipedown"   >
  <div class="cove" @click="colseList"></div> 
  </v-touch>
  <div class="tiltle">当前播放({{playMusicList.length}})
      <i @click="dingWei" class="iconfont icon-dingwei"></i>
      <i v-if="islove" @click="islove=false" class="iconfont icon-love"></i>
      <i v-else style="color:#e13c3c" @click="islove=true" class="iconfont icon-aixin"></i>
      <i class="iconfont icon-send"></i>
  </div>
  
  <div class="playList" >
    <div class="list" ref="SongsContainer">
      <music-list :musicList="playMusicList" :showNum="true"
       @play="$emit('aaa',$event)"
      @indexNum="$emit('indexNum',$event)"
       :activeIndex="playindex"/>
    </div>
  </div>
  
</div>

  </div>
 
</template>

<script>
import musicList from "./musicList.vue";
export default {
  nama: "fullScreen",
  data() {
    return {
      lyricArray: [ { lyric: "网 易 云 音 乐", time: 0 },
                     { lyric:"高音质，好品质", time: 100 },], // 存储歌词
      playNum1: Number,
      playButton1: "",
      currentLyricIndex: 0,//歌词索引
      imgShow: "none", // 选择模式面板
      imgShow1: "none", // 默认
      imgShow2: "none",
      imgShow3: "none",
      currentLine: 0, //当前需要高亮显示的歌词索引
      total: "",
      showList:false,//是否显示播放列表
      isvipboxshow:false,// vip box
      love:true ,// 默认未收藏
      isRecord: true,// 唱片默认出现
      islove:true,// 默认没收藏，播放列表里面的
      fullRemove: 0,//下划页面偏移量
      cdRemove:0,//唱片页面偏移量
    };
  },
  
  props: {
    currentMusic: {
      type: Object,
      default: {},   
    },

    playNum: Number ,// 接受传递过来的点击次数
    playButton: String,

    progress: Number, //播放进度比例 
    currentTime: Number, // 当前播放时间
    playMusicList: [], // 当前播放列表
    playindex: Number, // 当前播放歌曲的index
    xhNum:Number,//App.vue传递过来的播放模式状态码 ，默认是1，即显示顺序图标
  },

  components: {
    musicList
  },
  
  computed: {
    bgPicUrl() {
      if (this.currentMusic.picUrl == null) {
        // 数据形式不一样
        return this.currentMusic.al.picUrl;
      } else {
        return this.currentMusic.picUrl;
      }
    },

    pauseButton(){
      if(this.playButton== "none"){
        return "block";
      }else{
        return "none";
      }
    },

    startTime(){ // 进度条当前播放时间   
      let timeMinute = 0; 
      let timeSecond = Math.floor(this.currentTime); // 向下取整，保留整数部分

      if(timeSecond >=60){
         timeMinute = Math.floor(timeSecond / 60); //得到分钟数
         timeSecond = timeSecond % 60; //求余，秒数
      }
      // .padStart(2, '0') 的作用是在字符串的开头插入字符 '0'，直到字符串的长度达到 2。
      // 即如果原始字符串的长度已经大于等于 2，则不会进行任何插入操作
      return timeMinute.toString().padStart(2, '0') + ':' + timeSecond.toString().padStart(2, '0');
    },

    endTime(){ // 结束时间
       let timeSecond = Math.floor(this.currentTime / (this.progress / 100)); // 通过传过来的当前时间和比例算出总时间
       let timeMinute = Math.floor(timeSecond / 60); //分
       timeSecond = timeSecond % 60; //秒
       return timeMinute.toString().padStart(2, '0') + ':' + timeSecond.toString().padStart(2, '0');
    },

    total1(){ // 切歌更新评论
      this.getSongCommentTotal();
      return this.total
    },

    lyricArray1(){ // 切歌时更新歌词
      this.getLyricData();
      return this.lyricArray  
    },

    isvipshow(){//VIP歌曲开通会员页面
    
      if(this.currentMusic.fee === 1){
        this.isvipboxshow=true // 显示vip盒子

        this.playButton="block"  
        this.$emit("playButton1", this.playButton1);

        
       this.playtimer =  setTimeout(() => {// 延迟5秒后播放下一首歌曲 
           this.nextSong() 
           //console.log("下一首")
        }, 5000); 

        return true

      }else{
        clearTimeout( this.playtimer)// 取消自动播放定时器
         return false
      }
    }
    

  },

  mounted() { // 当组件的模板渲染完成并将其插入到页面中时，mounted函数会被触发。
    
    this.timer = setInterval(() => { // 创建定时器，半秒更新一次索引,索引改变就滚动高度
      this.updateCurrentLine();
      if(!this.isRecord){
        this.scrollToCurrentLine();
      }
      
    }, 300);

    this.$nextTick(() => {// 在组件挂载后注册键盘事件  (键盘快捷键)
      window.addEventListener('keydown', this.handleKeyDown);     
    });

  },

  beforeDestroy() { // 避免内存泄漏
    clearInterval(this.timer);// 组件销毁前清除计时器
    window.removeEventListener('keydown', this.handleKeyDown);// 在组件销毁前移除事件监听
 },
  
  created(){
    this.$nextTick(()=>{
      this.selectState(); // 播放模式状态
    })
  },

  methods: { 
    updateCurrentLine (){  // 更新 高亮索引
      this.lyricArray.forEach((item, index) => { //遍历歌词数组，得到每句歌词的开始时间，与传过来的当前播放时间比较，因为 currentTime 是浮点型，所以在误差范围内，两者若相等，将当前索引赋值给高亮索引
        const time = item.time;
        if (Math.abs(this.currentTime - time) <= 0.3) { // 设置一个误差范围，例如 0.3 秒，Math.abs()函数来计算它们之间的绝对值差。
            this.currentLine = index;
        }
      });
    },
    
    scrollToCurrentLine() { // 滚动高度
      const lyricsContainer = this.$refs.lyricsContainer; //获取到歌词容器的 DOM 元素
      const highlightedLine = lyricsContainer.getElementsByClassName('highLighteline')[0];// 获取具有 highLighteline 高亮类名的元素
     /* 这两个if效果一样的 */

     //  if (highlightedLine) { // 若高亮行元素存在
     //     const containerHeight = lyricsContainer.offsetHeight; // 获取歌词容器的高度 (370px)
     //     const lineHeight = highlightedLine.offsetHeight + 24; // 获取高亮行元素的高度 (23px, 24px是边距)
     //     const lineTop = highlightedLine.offsetTop; // 获取高亮行元素相对于歌词容器顶部的偏移量
     //     const scrollTop = (lineTop - containerHeight)+(containerHeight/2) -(lineHeight/2) -70; // 计算出需要滚动的距离 
     //     lyricsContainer.scrollTop = scrollTop; // 赋值给歌词容器的 scrollTop 属性 ，让它滚动  
     //   }
      
     if (highlightedLine) {   
        highlightedLine.scrollIntoView({ behavior: 'smooth', block: 'center'});
     }
      
    },

    closevip(){ // 关闭vip box
       this.isvipboxshow=false       
       clearTimeout( this.playtimer)// 取消自动播放定时器
    },

    handleKeyDown(event) { // 键盘快捷键
      const key = event.keyCode || event.which || event.charCode; //获取按下的键码，优先使用 keyCode，如果不存在则使用 which，最后使用 charCode。
      const ctrl = event.ctrlKey || event.metaKey; // 判断是否按下了 Ctrl 键或 Command 键（在 macOS 上）。
      
      if (ctrl && key === 37) {
        this.previousSong(); // Ctrl+左方向键 切换上一首歌
      }
      if (ctrl && key === 39) {
        this.nextSong(); // Ctrl+右方向键 切换下一首歌
      }
      if (key === 32 ) {
        this.play(); // 空格键 播放/暂停歌曲
      }
    },
  
    close() {  // 关闭歌词页
      this.$emit("togglefullScreen", false);
    },

    play() { // 暂停播放
      // 点击，通过 $emit 方法触发相对应的自定义事件，并传递参数 （1）

      this.playNum++;
      this.playNum1 = this.playNum;
      this.$emit("playNum1", this.playNum1);

      if (this.playNum % 2 === 0) { // 求余为0，为偶数，暂停播放
        this.$emit("pauseAudio");
        this.playButton1="block"
        this.$emit("playButton1", this.playButton1);

      //  console.log("暂停");
      } else {
        this.$emit("playAudio");
        this.playButton1="none"
        this.$emit("playButton1", this.playButton1);
      //  console.log("播放");

      }
    },

    rangeValue(event) { //处理滑块拖动
      const percent = event.target.value / 100 // 得到滑块的当前值，除以100，得到比例（播放进度）
      this.$emit('rangeValue', percent)
    },

    getLyricData() {//获取歌词
      this.$axios
        .get("https://apis.netstart.cn/music/lyric?id=" + this.currentMusic.id)
        .then(res => {
          var lyric = res.data.lrc.lyric;
          // 拆分为一条条歌词
          let str = lyric.split("\n");
          //console.log(str);
          //抽离时间和歌词
          var reg = /\[(\d+):(\d+\.\d+)\]([\s\S.]*)/;

          // 通过循环一个个处理
          let lyricArray = str.map((_, index) => {
            // 要时间 ，要对应的时间
            if (reg.test(_)) {
              // console.log(RegExp.$1);//分钟
              //  console.log(RegExp.$2);//秒
              //  console.log(RegExp.$3);//歌词
              return {
                time: parseInt(RegExp.$1 * 60) + parseFloat(RegExp.$2),
                lyric: RegExp.$3
              };
            } else {
              //如果没有数据
              return {
                lyric: str[index],
                time: 0
              };
            }
          });
          this.lyricArray = lyricArray;
        //    console.log(this.lyricArray);
        });   
    },

   select_img(){ // 选择面板
    this.imgShow = "block"
   },
   select_img1(){ // 顺序
    this.imgShow = "none"
    this.imgShow1 = "block"
    this.imgShow2 = "none"
    this.imgShow3 = "none"
    this.$emit("select", 1);
   },
   select_img2(){ // 随机
    this.imgShow = "none"
    this.imgShow1 = "none"
    this.imgShow2 = "block"
    this.imgShow3 = "none"
    this.$emit("select", 2);
   },
   select_img3(){ // 循环
    this.imgShow = "none"
    this.imgShow1 = "none"
    this.imgShow2 = "none"
    this.imgShow3 = "block"
    this.$emit("select", 3);
   },

   selectState(){ // 播放模式状态
    if(this.xhNum==1){
          this.imgShow1 = "block"
          this.imgShow2 = "none"
          this.imgShow3 = "none"
       }else if(this.xhNum==2){
          this.imgShow1 = "none"
          this.imgShow2 = "block"
          this.imgShow3 = "none"
       }else if(this.xhNum==3){
          this.imgShow1 = "none"
          this.imgShow2 = "none"
          this.imgShow3 = "block"
       }
   },

   clickComment(){ // 评论
      this.$emit("songCommentpage", true);
   },
 
    getSongCommentTotal() { //获取歌曲评论数目
      this.$axios
        .get("https://apis.netstart.cn/music/comment/music?id="+this.currentMusic.id)
        .then(res => {
          let num =res.data.total
          if(num>999 && num<10000){
             this.total="999+"
          }else if(num>=10000){
            this.total=Math.floor(num / 10000)+"w+"
          }
          else{
            this.total=num+""
          }
        });
       // console.log("index=>" ,this.playindex)
    },

    showplayList(){ // 显示当前播放列表
      this.showList = true
    },

    colseList(){ // 关闭当前播放列表
       this.showList = false
    },

    nextSong(){ // 播放下一首
      if(this.playindex !== this.playMusicList.length-1){// 判断是不是最后一首
        this.$emit("nextSong1")
      } else{
        this.$emit("nextSong2") // 回第一首
      }
    },

    previousSong(){// 播放上一首
     if(this.playindex !== 0){// 判断是不是第一首
        this.$emit("upSong1")
      } else{
        this.$emit("upSong2") // 回最后一首
      }
    },

    dingWei(){// 歌曲列表定位当前播放歌曲
      const SongsContainer = this.$refs.SongsContainer; //获取到列表容器的 DOM 元素
      const highlightedLine = SongsContainer.getElementsByClassName('active')[0];// 获取具有高亮类名的元素
     if (highlightedLine) {  // 滚动到可视区域
        highlightedLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
     }
    },

    swipedown(){// 当前歌曲列表页面下划
       this.colseList();
    },

    // 唱片区域划动 ，添加了一个状态标志来判断当前是否正在滑动，避免触摸事件与点击事件之间的冲突
    handleTouchStart(event) { // 当用户触摸屏幕时
      this.touchStartX = event.touches[0].clientX; // 表示触摸开始时用户第一个触点相对于浏览器视口的 X 坐标。
      this.touchStartY = event.touches[0].clientY;
      this.isSwiping = false; // 重置滑动标志
    },
    handleTouchMove(event) {// 当用户在屏幕上滑动时
      this.touchEndX = event.touches[0].clientX;// 表示用户当前滑动时第一个触点相对于浏览器视口的 X 坐标。
      this.touchEndY = event.touches[0].clientY;
      this.isSwiping = true; // 设置滑动标志为 true
      this.fullRemove = this.touchEndY - this.touchStartY;   
      this.cdRemove = this.touchEndX - this.touchStartX
    },
    handleTouchEnd() { // 当用户停止触摸屏幕时
      if (this.isSwiping) { // 只在滑动过程中执行切换歌曲的逻辑
        const x = this.touchEndX - this.touchStartX; // 滑动水平距离
        const y = this.touchEndY - this.touchStartY // 滑动垂直距离

        if (x > 180) {// 右滑上一首
           this.previousSong();
        } else if (x < -180) {// 左滑下一首
           this.nextSong();
        } else if(y > 180)  { // 下滑关闭歌词
          this.close();
        }
        this.isSwiping = false; // 重置滑动标志
      }
      this.fullRemove = 0; // 不管怎样，都要回位置
      this.cdRemove = 0 ;
    },

  },

};
</script>

<style lang="scss" scoped>
.fullScreen {
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #000000; 

//背景覆盖层
  .cover {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    -webkit-backdrop-filter: blur(5px) brightness(100%);
   
  }

  .BGfilter{
    backdrop-filter: blur(25px) brightness(100%); // 模糊5px 亮度100%
    -webkit-backdrop-filter: blur(25px) brightness(100%);    
  }

//头部
  .header {
    display: flex;
    justify-content: space-between;
    padding: 3px;

    .close-img {
      width: 30px;
      height: 30px;
    //   background: #0213ff;
      line-height: 30px;
      text-align: center;

      .close-icons {
        display: inline-block;
        width: 8px;
        height: 13px;
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAyNiI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI5YjliIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTIuOTM5IDIzLjkzOUwxMy44NzkgMTMgMi45MzkgMi4wNjEiLz48L3N2Zz4=)
          no-repeat;
        transform: rotate(90deg); /* 旋转角度为 90 度 */
      }
    }

    .title {
      margin-top: 10%;
      text-align: center;
      width: 80%;

      .music-name {
        font-size: 19px;
        margin-bottom: 5px;
        overflow: hidden;
        white-space: nowrap;
        //设成滚动
      }

      .artists {
        text-align: center;
        font-size: 3px;
        color: #8d8d8d;
        overflow: hidden;
        white-space: nowrap;
        //设成滚动
      }
    }

     //分享
    .send-img {
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      //  background: #00ccff;     
      i{
        font-size: 19px;
      }   
    }
  }

//歌词
  .lyric {
    ul {
      box-sizing: border-box;
      padding: 0 50px;
      height: 370px;
      margin: 20px auto 30px;
      padding-top: 150px; // 歌词初始位置
      overflow: auto; //滚动播放
      scrollbar-width: none; /* 取消滚动条宽度 */
     -ms-overflow-style: none; /* 禁用 IE 和 Edge 浏览器的滚动条 */
    //  scroll-behavior: smooth; // 再把定时器调快点，丝滑滚动，嘿嘿，

      li {
        font-family: 楷体;
        text-align: center;
        font-size: 15px;
        letter-spacing: 3px;
        word-spacing: -10px; //单词间距
        margin: 12px;
      }
      
      .highLighteline{ //歌词高亮
        color: #00ffcc;
        font-size: 18px;
        font-weight: bold;
      }
    }
    ul::-webkit-scrollbar{ /* 隐藏滚动条 */
       display: none; /* Chrome, Safari, and Opera */
    }
  }


//操作
 .oper{
  position: relative; 
  // 操作1
    .oper-all1{
      display: flex;
      width: 90%;
      margin:  0% 5%;
      height: 40px;
      justify-content: space-between;

      a{
        color: #ffffff;
      }

      i{
        font-size: 20px;
      }

      a:active, i:active{
        opacity: 0.5;
      }

      .comment{
        position: relative;
        span{
          position: absolute;
          font-size: 1px;
          left: 20px;
          top: -3px;
        }
      }
    }
    
  // 进度条
    .inputRange{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 3%;

       input{
        width: 75%;
        height: 1px;
     }
 
    }
  // 操作2
   .oper-all2{
     
      display: flex;
      width: 90%;
      margin:  2% 5%;
      height: 50px;
      justify-content: space-between;
    //  background: #04a8e9;

  // 选择播放模式
      .select_play{
        position: relative;       

        div{
          width: 20px;
          height:20px;         
          position: absolute;
          top: 15px;
          left: 0px;

          i{
            font-size: 20px;        
            line-height: 20px;
          }
        }
                 
      }

      .select_play:active{
        opacity: 0.5;
      }

  // 上一首
      .go_up{
        margin: 15px 0 0 0;
        text-align: center; 
        i{
          line-height: 20px;
          color: #ffffff;
          font-size: 20px;     
        }
      }
      
      .go_up:active{
        opacity: 0.5;
      }

  // 播放暂停
      .p_or_s{
        background: rgba($color: #ffffff, $alpha: 0.1);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        box-sizing: border-box;
        position: relative;
        margin-left: 4px;
        text-align: center;
        line-height: 50px;
        
        .icon-img{    
          width: 36px;
          height:36px;
          position: absolute;
          top: 0px;
          left: 10px;
        }
        i{
          color: #ffffff;
          font-size: 23px;        
         }     
      }

      .p_or_s:hover{ // pc端效果
        box-shadow: 0px 0px 5px 0px #ffffff;
      }

      .p_or_s:active{
        opacity: 0.5;
      }
  // 下一首  
      .go_down{
        margin: 15px 0 0 0;
        text-align: center;     
        i{
          line-height: 20px;
          color: #ffffff;
          font-size: 20px;
        }
      }

      .go_down:active{
        opacity: 0.5;
      }
  
  // 列表
      .music_list{
        position: relative;
        margin: 15px 0 0 0;  
        text-align: center;      
        i{
          color: #ffffff;
          font-size: 19px;
          line-height: 20px;      
        }
      }
      
      .list-text{
        position: absolute;
        left: 17px;
        bottom: 25px;
        font-size: 1px;
      }

      .music_list:active{
        opacity: 0.5;
      }


    }

  }

//mv 和 铃声
 .mvicon{
 // background: #00ccff;
  position: absolute;
  top: -70px;
  left: 5%;
  width: 90%;
  display: flex;
  justify-content: space-between;
  i:first-child{
    font-size: 15.5px;
  }
  i{
    font-size: 20px;
  }
  i:active{
        opacity: 0.5;
  }
 }


//选择模式
 .imgcounter{
  z-index: 2;
  position: absolute;
  top: 510px;
  left: 3%;
  width: 130px;
  height: 82px;
  border-radius: 5px;
  color: #000000;
  background: rgba($color: #ffffff, $alpha: 1.0);

  .img1{ //顺序
    display: flex;
    position: absolute;
    top:3px;
    left: 16px;  
  }

  .img2{ //随机
    display: flex;
    position: absolute;
    top: 28px;
    left: 16px;
  }

  .img3{ // 循环
    display: flex;
    position: absolute;
    top: 53px;
    left: 16px;  
  }
        
  .icon{ // 图标样式
      width: 20px;
      height: 20px;
      margin: 0 8px; 
    //  background: #00ccff;
     
    i{
      color: #000000;
      line-height: 20px;
      font-size: 20px;
    //  font-weight: bold;
    } 
  }
 
  .img1:active,
  .img2:active,
  .img3:active{
    opacity: 0.5;
  }
 }

//播放列表
 .cove{
   width: 100%;
   height: 100%;
  //  background: rgba(0, 0, 0, 0.5);
   -webkit-backdrop-filter: blur(5px) brightness(100%);
   backdrop-filter: blur(5px) brightness(100%);
   position: fixed;
   bottom: 0;
   left: 0;
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

//vip歌曲頁面
 .vipcover{ 
  position: fixed;
  width: 20%;
  height: 17%;
  bottom: 0;
  left: 40%;
  z-index: 50;
  //background: rgba($color: #a7a7a7, $alpha: 0.5);
 }

 .vip-box{
  position: absolute;
  background: #ffffff;
  color: #000000;
  width: 80%;
  left: 10%;
  top: 15%;
  z-index: 100;
 
  // 标题
  .vipboxname{
    padding: 0 3%;
    font-size: 16px;
    height: 30px;
    background: #333;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .img{    
     // background: #f30909;
    
     .icon-img{
      display: inline-block;
      width: 12px;
      height: 12px;
      background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjOTk5ODk5IiBkPSJNMTMuMzc5IDEybDEwLjMzOCAxMC4zMzdhLjk3NS45NzUgMCAxIDEtMS4zNzggMS4zNzlMMTIuMDAxIDEzLjM3OCAxLjY2MyAyMy43MTZhLjk3NC45NzQgMCAxIDEtMS4zNzgtMS4zNzlMMTAuNjIzIDEyIC4yODUgMS42NjJBLjk3NC45NzQgMCAxIDEgMS42NjMuMjg0bDEwLjMzOCAxMC4zMzhMMjIuMzM5LjI4NGEuOTc0Ljk3NCAwIDEgMSAxLjM3OCAxLjM3OEwxMy4zNzkgMTIiLz48L3N2Zz4=); 
     }
    }
  }

  // 内容
   .vipcontainer{
    margin: 30px 0 10px;

    p{
      text-align: center;
    }

    h3{
      font-weight: 500;
      text-align: center;
      margin: 20px 0;
      position: relative;
      font-size: 18px;

      &::before{
        content: "";
        position: absolute;
        width: 36px;
        top:50%;
        right: 65%;
        height: 1px;
        background-color: #e6e6e6;
      }

      &::after{
        content: "";
        position: absolute;
        width: 36px;
        top:50%;
        left: 65%;
        height: 1px;
        background-color: #e6e6e6;
     }
    }

    ul{
      margin: 0 5% 40px;
      font-size: 1px;
      display: flex;
      justify-content: space-between;

      li{
        text-align: center;
      }

    }

   .buyvip{
    text-align: center;

    button{
      background:linear-gradient(120deg,#fb5758,#ff8063) ;
      border:  none;
      outline: none;
      color: #fff;
      font-size: 16px;
      height: 40px;
      width: 170px;
      border-radius: 40px;
    }
    
    div{
      margin-top: 18px;
      font-size: 12px;
      color: #999;
      
      img{
        margin-left: 7px;
      }
    }
   }
   
   .wait{
    height: 36px;
    text-align: center;
    line-height: 36px;
    font-size: 1px;
    color: #00ccff;
   }


   }
 
 }

//唱片
  .record{
  box-sizing: border-box;
  width: 100%;
  height: 420px;
 //
  padding-top: 66px;
  position: relative;
  
  .cdbg{
     width: 247px;
     margin: 0 auto;
     border-radius: 50%;
     background: rgba($color: #686868, $alpha: 0.1);
 
  .cd{
    background: url("https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/4602256867/5855/63fb/325b/d7e4e3a244701ee85fecb5d4f6b5bd57.png?imageView=&quality=75&thumbnail=200y200") no-repeat;
    height: 247px;
    width: 247px; 
    background-size: 247px 247px;
    text-align: center;
    
    img{
      margin-top: 47.5px;
      border-radius: 50%;
      width: 62%;
    }
   }
  }

  .ab{
    width: 73px;
    height: 118px;
    position: absolute;
    top: 0px;
    left: 48%;
   
    img{
      width: 100%;
    }
  }
 }

//唱片动画
  //唱片旋转
 @keyframes cdRotate {
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
 }

 .cdRotate{
   animation: cdRotate 20s linear infinite;
 }
  // 暂停
 @keyframes abPauseRotate { 
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(-30deg);
  }
 }

 .abPauseRotate{
   transform-origin: left top; // 将旋转中心点设置为元素的左上角 
   animation: abPauseRotate 0.3s linear 1;
   transform: rotate(-30deg); // 图片最后定格位置
 }
  // 播放
 @keyframes abPlayRotate { 
  from{
    transform: rotate(-30deg);
  }
  to{
    transform: rotate(0deg);
  }
 }

 .abPlayRotate{ 
   transform-origin: left top; // 将旋转中心点设置为元素的左上角 
   animation: abPlayRotate 0.3s linear 1;
   transform: rotate(0deg); // 图片最后定格位置
 }


}
</style>
