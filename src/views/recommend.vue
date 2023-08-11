<template>
  <div class="recommend">
    <!-- vue-touch 的左滑右滑 -->
    <v-touch v-on:swipeleft="swiperleft" v-on:swiperight="swiperright">
      <!-- 推荐歌单 -->
      <title-border>编辑推荐</title-border>
      <div class="remd-lists">
        <div class="remd-list" v-for="item in randomRecommendList" :key="item.id" @click="details(item)"  >
          <!-- .slice(0,6) 截取前6个数据 -->
          <img-item :item="item"></img-item>
          <div class="name">{{item.name}}</div>
        </div>
      </div>

      <title-border>最新音乐</title-border>

      <!-- 加载动画 -->
      <loadingGif style="margin-top: 0px;" v-if="isloadingGif" />

      <!-- 音乐列表 -->
      <div v-else class="musicheight">
        <music-list
          :musicList="newSongs"
          @play="$emit('aaa',$event)"
          @bofanlist="$emit('bofanlist',$event)"
          @indexNum="$emit('indexNum',$event)"
        />
      </div>

      <div class="footer">
        <div class="logo">
          <img src="../assets/wyy.png" />
          <span class="logo-title">网易云音乐</span>
        </div>
        <div class="openapp">打开APP，发现更多好音乐 ></div>
        <div class="copyright">网易公司版权所有&copy;1997-2023杭州乐读科技有限公司</div>
      </div>
    </v-touch>

    <!-- 歌单详情页 -->
    <transition name="moveX">
      <detailsPage
        v-if="isPage"
        :songID="songID"
        style="z-index:99;"
        @aaaaa="$emit('aaa',$event)"
        @bofanlist="$emit('bofanlist',$event)"
        @indexNum="$emit('indexNum',$event)"
        @togglePage="togglePage"
      />
    </transition>
  </div>
</template>

<script>
import titleBorder from "../components/titleBorder.vue";
import imgItem from "../components/imgItem.vue";
import musicList from "../components/musicList.vue";
import detailsPage from "../components/detailsPage.vue";
import loadingGif from "../components/loadingGif.vue";
export default {
  name: "recommend",
  data() {
    return {
      recommendList: [], //存储推荐歌单
      randomRecommendList: [], // 随机排序的歌单
      newSongs: [], //最新音乐
      songID: 0, // 点击的歌单id
      isPage: false, // 歌单详情页
      playTop: Number, // 播放器的高度
      isloadingGif: true // 初始页面加载状态为正在加载
    };
  },

  created() {
    this.getRecommendList();
    this.getNewSongs();
  },

  mounted() {
    //通过使用this.$watch实例方法来监听数组的变化
    this.$watch("newSongs", () => {
      if (this.newSongs.length > 0) {
      //  setTimeout(() => { this.isloadingGif = false;}, 800); // 模拟加载延迟
        this.isloadingGif = false; // 数据加载完成，隐藏加载动画
      }
    });
  },

  beforeDestroy() {
    this.$watch("newSongs", null); // 取消对 newSongs 的监听
  },

  components: {
    titleBorder,
    imgItem,
    musicList,
    detailsPage,
    loadingGif
  },

  computed: {},

  methods: {
    getRandomItems(list, count) {
      // 随机截取6个编辑推荐
      /* 使用 Fisher-Yates (洗牌)算法随机排序数组 */

      const shuffled = list.slice(); // 复制原始数组 list,避免直接修改原始数组
      let currentIndex = list.length; // 定义一个变量 currentIndex，并将其初始化为 list 数组的长度。这个变量将用于迭代数组

      while (currentIndex !== 0) {
        // Math.random() 乘以 currentIndex 可以得到一个位于 0（包含）到 currentIndex（不包含）之间的随机浮点数。用 Math.floor() 向下取整，得到一个整数类型的随机索引
        let randomIndex = Math.floor(Math.random() * currentIndex);

        // 将 currentIndex 自减 1，以确保下次循环时处理下一个索引
        currentIndex--;

        // 数组解构赋值交换元素位置
        [shuffled[currentIndex], shuffled[randomIndex]] = [
          shuffled[randomIndex],
          shuffled[currentIndex]
        ];
      }

      // 返回截取后的数组
      return shuffled.slice(0, count);
    },

    details(item) {
      this.songID = item.id;
      this.isPage = true;
      this.playTop = 10; // 播放器的高度
      this.$emit("playTop", this.playTop); // 传给App.vue
      //    console.log(item.id)
    },

    togglePage(val) {
      // 关闭页面
      this.isPage = val;
      this.playTop = 1; // 播放器的高度
      this.$emit("playTop", this.playTop); // 传给App.vue
    },

    //获取推荐歌单
    getRecommendList() {
      this.$axios
        .get("https://apis.netstart.cn/music//personalized")
        .then(res => {
          // console.log(res.data.result)
          this.recommendList = res.data.result;
          //  console.log(this.recommendList);
          this.randomRecommendList = this.getRandomItems(this.recommendList, 6);
          //   console.log(this.randomRecommendList);
        });
    },

    //获取最新音乐
    getNewSongs() {
      this.$axios
        .get("https://apis.netstart.cn/music/personalized/newsong")
        .then(res => {
          // console.log(res.data.result)
          this.newSongs = res.data.result;
        });
    },

    swiperleft() {
      //左划切换到下一页
      this.$router.push({ path: "/hotRank" });
    },

    swiperright() {
      //右滑切换到上一页
      //   this.$router.push({'path':'/search'});
    }
  }
};
</script>

<style lang="scss" scoped>
.recommend {
  .remd-lists {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: 352px;
    // background: #d33a31;

    .remd-list {
      width: 33%;
      margin-bottom: 15px;

      .name {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;

        padding: 6px 2px 0 6px;
        min-height: 30px;
        line-height: 1.2;
        font-size: 13px;
      }
    }
  }

  .musicheight {
    min-height: 565px;
    // background: #d33a31
  }

  .footer {
    width: 100%;
    height: calc(400 / 700 * 100vw);
    //  border-top:  1px solid rgb(239, 239, 239);
    background: url(../assets/bottombg.png) no-repeat top;
    background-size: cover;

    .logo {
      padding-top: 16.9%;
      display: flex;
      margin: 0 auto;
      width: 230px;
      height: 45px;

      img {
        height: 100%;
      }

      .logo-title {
        display: inline-block;
        margin-left: 8px;
        font-size: 32px;
        line-height: 45px;
        letter-spacing: 3px; //字间距
      }
    }

    .openapp {
      //打开
      line-height: 38px;
      border: 1px solid #d33a31;
      border-radius: 38px;
      font-size: 16px;
      color: #d33a31;
      margin: 15px 37px 5px;
      text-align: center;
    }
    .copyright {
      //版权
      color: #888;
      font-size: 12px;
      line-height: 16px;
      -webkit-transform: scale(0.75);
      -ms-transform: scale(0.75);
      transform: scale(0.75);
      text-align: center;
      letter-spacing: 1.5px; //字间距
    }
  }

  .moveX-enter-active,
  .moveX-leave-active {
    transition: all 0.3s linear;
  }

  .moveX-leave-to,
  .moveX-enter {
    transform: translateX(100%);
  }

  .moveX-leave,
  .moveX-enter-to {
    transform: translateX(0);
  }
}
</style>