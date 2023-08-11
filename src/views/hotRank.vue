<template>
  <!-- vue-touch 的左滑右滑 -->
  <v-touch v-on:swipeleft="swiperleft" v-on:swiperight="swiperright">
    <div class="hotRank">
      <!-- 背景图片 -->
      <div class="hotop">
        <div class="hotopct">
          <div class="hoticon"></div>
          <div class="hottime">更新日期：{{currentDate}}</div>
        </div>
      </div>

      <!-- 回到顶部 -->
      <div class="top" :style="{opacity: topButton}" @click="scrollToTop">
        <i class="iconfont icon-top"></i>
      </div>

      <!-- 加载动画 -->
      <loadingGif v-if="isloadingGif" />

      <!-- 音乐列表   -->
      <music-list
        v-else
        :musicList="showList.slice(0, 200)"
        :showNum="true"
        @play="$emit('aaa',$event)"
        @bofanlist="$emit('bofanlist',$event)"
        @indexNum="$emit('indexNum',$event)"
      />

      <!-- 触底刷新 -->
      <div class="loading" ref="loading">
        <span v-if="!isloadingGif">{{ loadingText }}</span>
      </div>
    </div>
  </v-touch>
</template>

<script>
import musicList from "../components/musicList.vue";
import loadingGif from "../components/loadingGif.vue";//页面加载
export default {
  name: "hotRank",
  data() {
    return {
      hotSongList: [], //热歌榜存储歌单
      page: 1, //第几页
      isLoading: false, //是否可以再次请求数据
      loadingText: "", //显示加载内容
      currentDate: "", // 存储年月日
      isloadingGif: true, // 初始页面加载状态为正在加载
      topButton: 0 // 回到顶部按钮的初始透明度
    };
  },

  methods: {
    // 获取年月日
    getCurrentDate() {
      const date = new Date();
      //  const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      this.currentDate = `${month}月${day}日`;
    },

    //获取热歌榜歌单
    getHotSongs() {
      this.$axios
        .get("https://apis.netstart.cn/music/playlist/detail?id=3778678")
        .then(res => {
          //  console.log(res.data);
          // 因为该模块跟最新音乐公用一个组件，但是不是同一个数据接口
          // 因此需要调整数据形式让其基本一致，不能影响渲染
          this.hotSongList = res.data.playlist.tracks.map((item, index) => {
            item.song = {
              //歌曲别名
              alias: item.alia,
              //歌曲码率
              privilege: res.data.privileges[index],
              //歌手
              artists: item.ar,
              album: item.al
            };
            return item;
          });
          // console.log(this.hotSongList);
        });
    },

    //判断是否触底
    scrollBottomRefresh() {
      // 加载的标签（最底部的标签）距离最顶部的距离 + 本身高度== 本视图高度 + 被卷去的高度
      // （1）加载的标签（最底部标签）距离最顶部的距离
      // console.log(this.$refs.loading.offsetTop);
      // console.log(this.$refs.loading.offsetHeight);
      // console.log(window.innerHeight);

      // 兼容性处理
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      // console.log(scrollTop)

      if (
        this.$refs.loading.offsetTop + this.$refs.loading.offsetHeight <=
        window.innerHeight + scrollTop + 5
      ) {
        // console.log("着火");
        // this.page++

        if (this.page * 1 >= this.hotSongList.length / 20) {
          this.loadingText = "没有数据了...";
          this.playTop = 10;
          return;
        }

        //通过定时器模拟请求后台数据
        if (!this.isLoading) {
          this.loadingText = "数据请求中...";
          //完成请求后，才能再次请求，isLoading为true代表加载中
          this.isLoading = true;

          setTimeout(() => {
            this.loadingText = "加载更多...";
            this.isLoading = false;
            this.page++;
          }, 500);
        }
      }
    },

    handleScroll() {
      // 滚动时 按钮透明度变化

      if (this.isScrolling) {
        //如果isScrolling为true，表示之前已经触发了滚动事件，需要清除之前设置的定时器。
        clearTimeout(this.scrollTimeout);
      } else {
        // 如果isScrolling为false，表示当前滚动事件是新的滚动开始
        this.topButton = 0.3;
      }

      this.isScrolling = true; // 表示页面正在滚动。

      //使用一个定时器和布尔值来确保在滚动期间连续的滚动事件不会导致按钮的透明度闪烁。
      //定时器延迟了恢复按钮透明度的操作，只有在300毫秒内没有新的滚动事件时才执行
      this.scrollTimeout = setTimeout(() => {
        this.topButton = 0.8;
        this.isScrolling = false; // 表示滚动已经停止
      }, 300);
    },

    scrollToTop() {
      //回到顶部

      this.topButton = 0.1; // 点击按钮时将透明度设置为0.1,样式

      // 使用原生JavaScript的scrollTo方法滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: "smooth" // 使用平滑滚动效果
      });
    },

    swiperleft() {
      //左划切换到下一页
      this.$router.push({ path: "/search" });
    },

    swiperright() {
      //右滑切换到上一页
      this.$router.push({ path: "/" });
    }
  },

  created() {
    this.getHotSongs();
    this.getCurrentDate();
  },

  mounted() {
    this.$nextTick(() => {
      // 监听滚动
      window.addEventListener("scroll", this.handleScroll);
      window.addEventListener("scroll", this.scrollBottomRefresh);
    });

    //通过使用this.$watch实例方法来监听数组的变化
    this.$watch("hotSongList", () => {
      if (this.hotSongList.length > 0) {
      //  setTimeout(() => { this.isloadingGif = false;}, 800); // 模拟加载延迟
         this.isloadingGif = false; // 数据加载完成，隐藏加载动画
      }
    });
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("scroll", this.scrollBottomRefresh);
    this.$watch("hotSongList", null); // 取消对 hotSongList 的监听
  },

  computed: {
    showList() {
      /*
        第1页：20
        第2页：20*2
        第3页：20*3
        ...
        第n页：20*n
        */

      let end = this.page * 20;
      return this.hotSongList.slice(0, end);
    }
  },

  components: {
    musicList,
    loadingGif
  }
};
</script>

<style lang="scss" scoped>
.hotRank {
   min-height: 600px;
  .hotop {
    position: relative;
    width: 100%;
    height: calc(292 / 750 * 100vw); //保持图片比例，根据宽决定
    background: url(../assets/hotbg.jpg);
    background-size: contain;

    .hotopct {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      left: 0;
      top: 20%;
      z-index: 2;
      padding-left: 20px;
      box-sizing: border-box;

      .hoticon {
        //热歌榜
        width: 142px;
        height: 67px;
        background: url(../assets/index_icon_2x.png) bottom right no-repeat;
        background-size: 166px 97px;
      }

      .hottime {
        color: #fff;
        font-size: 12px;
        margin-top: 10px;
      }
    }
  }

  .top {
    width: 30px;
    height: 30px;
    background: #000000;
    border-radius: 50%;
    position: absolute;
    bottom: 13%;
    right: 5%;
    position: fixed;
    text-align: center;
    line-height: 30px;

    i {
      font-size: 20px;
      color: #ffffff;
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