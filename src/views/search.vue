<template>
 <div class="srch">
   <!-- 搜索栏 -->
    <div class="srch-box">   
      <div class="search-icon">
         <i class="icon-img"></i>
       </div>
      <div class="srch-search">
        <!-- 输入框的 input 事件中调用 getSuggest 搜索建议 方法 ; 输入框添加一个ref属性，用于引用它; @focus 焦点监听器 -->
        <input @input="getSuggest"  ref="myInput"  @focus="onInputFocus"  class="search" type="text" v-model="keywords" placeholder="搜索歌曲、歌手、专辑"  @keydown.enter="showResult"/>  
      </div> 
      <div class="close">
         <i v-if="closeShow" @click="colseSearch" class="close-img"></i>
       </div>
    </div>

   <!-- 热门搜索  -->
     <!-- vue-touch 的左滑右滑 -->
     <v-touch v-on:swipeleft="swiperleft"  v-on:swiperight="swiperright" >
    <div  v-if="historyShow">
      <div class="hot-search">
        <h3>热门搜索</h3>
        <div class="hots"> 
            <div class="hot" v-for="(hotsong,index) in hotList.hots " :key="index">
              <div  @click="srch(hotsong.first)" >{{hotsong.first}}</div>
            </div>
        </div>
      </div>

   <!-- 历史记录 -->
     <div style="min-height: 260px;">
      <div class="history"  v-for="(local, index) in descHistory" :Key="index">
           <div class="history-icon"> <i class="icon-img"></i> </div>
           <div @click="srch(local)" class="history-srch"> {{local}} </div>
           <div @click="delect(index)" class="del"><i class="icon-img"></i></div>          
          <div  ref="loading"></div>   <!-- 没有这个会报错 -->
      </div>
     </div>  
    </div>  
     </v-touch>

   <!-- 加载动画 -->
    <loadingGif  v-if="isloadingGif" />     
    
   <!-- 音乐列表可以复用   -->
    <div v-if="listShow">
     <div  class="srch-music">
          <h3 v-if="h3Show">最佳匹配</h3>
          <div class="srch-musicImg" v-for="(music, index) in srchSuggest" :key="index">
              <div class="music-img"> <img  :src="music.img1v1Url+`?param=50y50`">  </div>
              <h4 class="music-peloe">歌手:{{music.name}}
                <span class="alias" v-if="music.alias.length">({{ music.alias[0] }})</span> <!-- 别名 -->
              </h4>
              <div class="music-icon"> <i class="icon-img"></i> </div>
          </div>
      </div>
    
      <!-- :searchKeyword="keywords" （3）父组件传子组件 -->
      <music-list   @play="$emit('aaa',$event)" :musicList="showList"  :searchKeyword="keywords" @bofanlist="$emit('bofanlist',$event)" @indexNum="$emit('indexNum',$event)"/>
      <div class="loading" ref="loading">{{ loadingText }}</div>
    </div>
   <!-- 无结果结果 -->
    <div v-if="errorShow" class="error-message">暂无搜索结果</div>

   <!-- 搜索建议 -->
    <div v-if="suggestShow">
      <h3 @click="showResult" class="suggest-title">搜索“{{keywords}}”</h3>
      <div class="suggest"  v-for="(suggest, index) in suggest.allMatch" :key="index">
           <div class="suggest-icon"> <i class="icon-img"></i> </div>
           <div @click="srch(suggest.keyword)" class="suggest-srch"> {{suggest.keyword}} </div>
      </div>
    </div>
  </div>   
</template>

<script>
import musicList from "../components/musicList.vue";
import loadingGif from "../components/loadingGif.vue"

export default {
  name: "search",
  data() {
    return { 
      keywords: "", //（2）
      searchSongs:[],
      errorShow: false,
      listShow: false,
      history: [], // 历史记录数组  
      historyShow: true,   
      hotList:[], //热门搜索数组
      suggest:[], //搜索建议数组
      suggestShow:false,   
      page: 1,//第几页
      isLoading: false,//是否可以再次请求数据
      loadingText: "",//显示加载内容
      srchSuggest:[],//最佳匹配数组
      isloadingGif: false, // 初始页面加载状态为正在加载
    }
  },

  created(){
    this.gethotList();
  }, 

  mounted() {
    this.history = JSON.parse(localStorage.getItem('history')) || []; // 从 localStorage 中恢复历史记录
   //   console.log(this.history) 
      
    this.$nextTick(() => {   // 注意： $nextTick函数确保子组件的数据渲染完成
      window.addEventListener("scroll", this.scrollBottomRefresh);
    });
     
  
  },

  beforeDestroy() {
    // 因为组件被销毁的时候，滚动事件依旧存在（该事件在Windows对象中）
    window.removeEventListener("scroll", this.scrollBottomRefresh);
  },

  watch: { //数据变化时触发的处理函数
    history: {
      handler(keywords) {
          localStorage.setItem('history', JSON.stringify(keywords)); // 将历史记录保存到 localStorage
      },
      deep: true,
    },
  },

  computed: {
    closeShow() {
      if(this.keywords && this.keywords.length > 0){ // this.keywords 存在且长度大于0，即不为空
        this.historyShow=false; //同时隐藏热门搜索、历史记录
        this.suggestShow=true;  //显示搜索建议
        return true;
      }else{
        this.listShow=false;
        this.errorShow=false;
        this.historyShow=true; 
        this.suggestShow=false;
        return false;
        
      }     
    },

    h3Show(){
         return this.srchSuggest ? true : false;
    },

    descHistory() {
       return this.history.slice().reverse(); //将历史数组倒序显示，不会直接修改原数组
    },

    showList() {
      /*
        第1页：12
        第2页：12*2
        第3页：12*3
        ...
        第n页：12*n
        */
      let end = this.page * 12;
      return this.searchSongs.slice(0, end);
    },
  
    
  },

  methods: {
    gethotList(){ //获取热门搜索列表
      this.$axios.get("https://apis.netstart.cn/music/search/hot")
      .then((res) =>{             
         this.hotList=res.data.result     
        // console.log(this.hotList.hots);
      });

          
    },
  
    getSuggest(){  //获取搜索建议
      if (this.keywords.trim() === '') { 
          this.suggestList = [];      
          return;
      }
    
      this.$axios.get("https://apis.netstart.cn/music/search/suggest?keywords="+ this.keywords +"&type=mobile")
      .then((res) =>{             
         this.suggest=res.data.result     
        //  console.log(this.suggest.allMatch);
      });
      
    },

    blurInput() { //设置失去焦点
       this.$refs.myInput.blur(); //会通过$refs.myInput引用到输入框元素，并调用blur()方法来使其失去焦点。
    },

    onInputFocus() { //焦点监听器
      // 在输入框获取焦点时执行的操作
         this.errorShow = false;
         this.listShow = false; 
         if( this.historyShow === false){
           this.getSuggest(); //相当于刷新一遍搜索建议
           this.suggestShow=true;
         }         
    },

    showResult() { //回车搜索
     this.suggestShow=false; // 隐藏搜索建议
     this.isloadingGif = true; // 显示加载动画

      if (this.keywords.trim() === '') { // 输入框为空或只包含空格时，不进行搜索操作       
          return;
      }
     // console.log(this.keywords);
       
      // 判断是否有重复项，有就先删除再添加，达到按搜索时间显示历史记录
      if (this.history.includes(this.keywords)) {
          //record是数组中的每个元素，表示单个记录; 使用record !== this.keywords作为过滤条件，表示只保留与this.keywords不相等的记录，从而删除重复项。
          this.history = this.history.filter(record => record !== this.keywords);
      }  
      this.history.push(this.keywords); // 再将新记录添加到历史记录数组中
      

      this.$axios
         .get("https://apis.netstart.cn/music/search/multimatch?keywords="+ this.keywords ) // 最佳匹配
         .then((res) =>{             
         this.srchSuggest=res.data.result.artist    
        //  console.log(this.srchSuggest);
      });
                       
      this.$axios
        .get("https://apis.netstart.cn/music/cloudsearch?type=1&keywords=" + this.keywords)
        .then((res) => {
      //     console.log(res.data.result.songs);
           if (res.data.result && res.data.result.songs) { // songs 存在且不为空，进行后续操作
              this.errorShow = false;
              this.listShow=true;
              this.historyShow=false;
              this.suggestShow=false;
              this.isloadingGif = false; // 加载完成，隐藏加载动画

              this.searchSongs = res.data.result.songs.map((item, index) => {
              item.song = {
                //歌曲别名
                alias: item.alia,
                //歌曲码率
                privilege: item.privilege,
                //歌手
                artists: item.ar,
                album: item.al,
              };
              return item;
              }); 
         //     console.log(this.searchSongs);

            }else{    // songs 不存在，显示无结果
               this.errorShow = true;
               this.listShow = false;  
               this.historyShow=false;   
               this.suggestShow=false;  
               this.isloadingGif = false; // 加载完成，隐藏加载动画 
            }   

        });
      this.blurInput() ; //回车后失去输入框焦点
    },

    colseSearch() { //清空输入框
      this.keywords=""
    },

    delect(index) { // 删历史记录
      this.history.splice(this.history.length - 1 - index, 1); // this.history.length - 1 - index 表示倒序数组中的实际索引位置 ,1 表示要删除的元素数量
    },

    srch(text) { //点击到搜索框搜索
      this.keywords = text;
       this.showResult();  
    },
      
    scrollBottomRefresh() {//触底刷新
      // 兼容性处理
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
         // 加载的标签（最底部的标签）距离最顶部的距离 + 本身高度== 本视图高度 + 被卷去的高度
         // （1）加载的标签（最底部标签）距离最顶部的距离
        if (this.$refs.loading.offsetTop + this.$refs.loading.offsetHeight <= window.innerHeight + scrollTop + 5) {        
            if (this.page >= this.searchSongs.length / 12 ) {
               this.loadingText = "没有更多了...";
               return;
            }

        //通过定时器模拟请求后台数据
            if (!this.isLoading) {
               this.loadingText = "正在加载...";
               //完成请求后，才能再次请求，isLoading为true代表加载中
               this.isLoading = true;

               setTimeout(() => {
               this.loadingText = "加载更多...";
               this.isLoading = false;
               this.page++;
               }, 1000);
            }
        }
      
    },

    swiperleft () {  //左划切换到下一页    
     //  this.$router.push({'path':'/'});   
    },   
        
    swiperright() { //右滑切换到上一页   
       this.$router.push({'path':'/hotRank'});   
    }  

  },

  components: {
    musicList,  // (1)
    loadingGif
  },
  
};
</script>

<style lang="scss" scoped>
.srch{ 

//  搜索栏
   .srch-box{
    //background: #333;
     position: relative;
     padding: 15px 10px;
     border-bottom: 1px solid rgba(112, 112, 112, 0.1);
     box-sizing: border-box;
   
   .search-icon{
     position: absolute;
     left: 10px;
     top: 15px;
     width: 30px;
     height: 30px;
     line-height: 35px;
     text-align: center;
   }

   .icon-img{
     display: inline-block;
     width: 14px;
     height: 14px;
     background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNiAyNiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljOWNhIiBkPSJNMjUuMTgxIDIzLjUzNWwtMS40MTQgMS40MTQtNy4zMTUtNy4zMTRBOS45NjYgOS45NjYgMCAwIDEgMTAgMjBDNC40NzcgMjAgMCAxNS41MjMgMCAxMFM0LjQ3NyAwIDEwIDBzMTAgNC40NzcgMTAgMTBjMCAyLjM0Mi0uODExIDQuNDktMi4xNiA2LjE5NWw3LjM0MSA3LjM0ek0xMCAyYTggOCAwIDEgMCAwIDE2IDggOCAwIDAgMCAwLTE2eiIvPjwvc3ZnPg==);
   }

   .srch-search{
     width: 100%;
     height: 30px;
     padding: 0 30px;
     box-sizing: border-box;
     background: #ebecec;
     border-radius: 30px;      
   }

   .search{
     width: 100%;
     height: 30px;
     line-height: 18px;
     background: none;
     border: none;
     font-size: 14px;
     box-sizing: border-box;
     outline: none; //取消点击边框
   }

   .search::placeholder {
   color: #c9c9c9;
   }

   .close{

    position: absolute;
    right: 10px;
    top: 15px;
    width: 30px;
    height: 30px;
    line-height: 35px;
    text-align: center;
   }
  
   .close-img{
     display: inline-block;
     width: 14px;
     height: 14px;
     background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOCAyOCI+PGcgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjYmNiZGJkIiBkPSJNMTQgMGM3LjczMiAwIDE0IDYuMjY4IDE0IDE0cy02LjI2OCAxNC0xNCAxNFMwIDIxLjczMiAwIDE0IDYuMjY4IDAgMTQgMHoiLz48cGF0aCBkPSJNMTkgOUw5IDE5TTkgOWwxMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZWJlY2ViIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIi8+PC9nPjwvc3ZnPg==);
   }

   }

// 无结果
  .error-message{
    text-align: center;
    margin-top: 20%;
  }

// 历史记录
  .history{
    position: relative;
    display: flex;
    align-items: center;
    height: 45px;
    line-height: 45px;
    
  
  .history-icon{    
    // background: #000000;
    
    .icon-img{
      margin: 0 10px;
      display: inline-block;
      width: 15px;
      height: 15px;
      background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljYWNhIiBkPSJNMTUgMzBDNi43MTYgMzAgMCAyMy4yODQgMCAxNVM2LjcxNiAwIDE1IDBzMTUgNi43MTYgMTUgMTUtNi43MTYgMTUtMTUgMTVtMC0yOEM3LjgyIDIgMiA3LjgyIDIgMTVzNS44MiAxMyAxMyAxMyAxMy01LjgyIDEzLTEzUzIyLjE4IDIgMTUgMm03IDE2aC04YTEgMSAwIDAgMS0xLTFWN2ExIDEgMCAxIDEgMiAwdjloN2ExIDEgMCAxIDEgMCAyIi8+PC9zdmc+);
    }
  }

  .history-srch{
    padding-left: 5px;
    border-bottom: 1px solid rgba(216, 216, 216, 0.2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: normal; 
   padding-right: 35px; 
    flex: 1;
  } 

  .del {   
    // background: #000000;
     position: absolute;
     top: 0;
     right: 5px;
     width: 32px;
     height: 45px;
     line-height: 45px;
     text-align: center;
    
    .icon-img{
      margin: 0 10px;
      display: inline-block;
      width: 12px;
      height: 12px;
      background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjOTk5ODk5IiBkPSJNMTMuMzc5IDEybDEwLjMzOCAxMC4zMzdhLjk3NS45NzUgMCAxIDEtMS4zNzggMS4zNzlMMTIuMDAxIDEzLjM3OCAxLjY2MyAyMy43MTZhLjk3NC45NzQgMCAxIDEtMS4zNzgtMS4zNzlMMTAuNjIzIDEyIC4yODUgMS42NjJBLjk3NC45NzQgMCAxIDEgMS42NjMuMjg0bDEwLjMzOCAxMC4zMzhMMjIuMzM5LjI4NGEuOTc0Ljk3NCAwIDEgMSAxLjM3OCAxLjM3OEwxMy4zNzkgMTIiLz48L3N2Zz4=);
    }
  }
  .del:active{
    opacity: 0.5;
  }
 }

// 热门搜索
 .hot-search{
   padding: 15px 10px 0;

    h3{
      font-size: 12px;
      line-height: 12px;
      color: #666;
    }

   .hots{
      margin: 10px 0 7px ;

   .hot{
      display: inline-block;
      border: 1px solid #d3d4da;
      border-radius: 32px;
      height: 32px;
      margin-right: 8px;
      margin-bottom: 8px;
      padding: 0 14px;
      font-size: 14px;
      line-height: 32px;
      color: #333;
   }
  }
 }

// 搜索建议
 .suggest-title{
  height: 50px;
  line-height: 50px;
  color: #507daf;
  font-size: 16px;
  padding-right: 10px;
  margin-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: normal; 
  border-bottom: 1px solid rgba(190, 190, 190, 0.1);
 }

 .suggest{
  position: relative;
    display: flex;
    align-items: center;
    height: 45px;
    line-height: 45px;
    
  
  .suggest-icon{    
    // background: #000000;
    
    .icon-img{
      margin: 0 10px;
      display: inline-block;
      width: 15px;
      height: 15px;
      background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNiAyNiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljOWNhIiBkPSJNMjUuMTgxIDIzLjUzNWwtMS40MTQgMS40MTQtNy4zMTUtNy4zMTRBOS45NjYgOS45NjYgMCAwIDEgMTAgMjBDNC40NzcgMjAgMCAxNS41MjMgMCAxMFM0LjQ3NyAwIDEwIDBzMTAgNC40NzcgMTAgMTBjMCAyLjM0Mi0uODExIDQuNDktMi4xNiA2LjE5NWw3LjM0MSA3LjM0ek0xMCAyYTggOCAwIDEgMCAwIDE2IDggOCAwIDAgMCAwLTE2eiIvPjwvc3ZnPg==);
    }
  }

  .suggest-srch{
    border-bottom: 1px solid rgba(216, 216, 216, 0.1);
    flex: 1;
  } 
 }

// 音乐列表 最佳匹配
 .srch-music{
   padding: 8px 0 4px;

   h3{
    margin-left: 10px;
    font-size: 13px;
    line-height: 16px;
    color: #666;
   }

 }
 .srch-musicImg{
  display: flex;
  align-items: center;
  height: 66px;
  margin-left: 10px;
  padding: 8px 10px 8px 0;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  .music-img{
    position: relative;
    width: 50px;
    height: 50px;
    margin-right: 15px;
    line-height: 0;

    img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .music-peloe{
    flex: 1;
    font-size: 17px;
    line-height: 30px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: normal;
  }

  .music-icon {   
     //background: #000000; 
     height: 66px;
     line-height: 66px; 
    
    .icon-img{
      margin: 0px  8px 0px 10px;
      display: inline-block;
      width: 8px;
      height: 13px;
      background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAyNiI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI5YjliIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTIuOTM5IDIzLjkzOUwxMy44NzkgMTMgMi45MzkgMi4wNjEiLz48L3N2Zz4=); 
   }
  }

 }
 

 .loading {
    text-align: center;
    color: #888;
    height: 55px;
    line-height: 55px;
  }

}

</style>