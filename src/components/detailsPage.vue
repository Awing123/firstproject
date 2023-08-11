<template>
  <!-- 歌单详情页 -->
  <div class="detailsPage">
    <!-- 歌单背景 (三元表达式，存在显示背景，不存在不显示)-->
    <div
      class="plhead_bg"
      :style="{ backgroundImage: `url(${detailSongs.coverImgUrl ? detailSongs.coverImgUrl+`?param=170y170` : ''})` }"
    ></div>

    <div class="close-img">
      <div class="close-icon" @click="close"></div>
    </div>

    <!-- 歌单图片 -->
    <div class="plhead">
      <div class="plhead_wrap">
        <div class="plhead_img">
          <img
            :src="detailSongs.coverImgUrl ? detailSongs.coverImgUrl+`?param=170y170` : defaultSongImg"
          />
          <span class="plhead_icon">
            <span v-if="detailSongs.highQuality">精品</span>歌单
          </span>
          <span class="plhead_num">{{(detailSongs.playCount/10000).toFixed(1)}}万</span>
        </div>
      </div>

      <!-- 歌单介绍文本 -->
      <div class="plhead_tiltle">
        <h2 class="text">{{detailSongs.name}}</h2>
        <!-- 创作者 -->
        <div class="creator">
          <div class="creator-img">
            <!-- 三元表达式，在图片没加载完前，默认占位图 -->
            <img
              :src="detailSongs.creator ? detailSongs.creator.avatarUrl+`?param=30y30` : defaultUserImg"
            />
          </div>
          <span v-if="detailSongs.creator" class="creator-name">{{detailSongs.creator.nickname}}</span>
        </div>
      </div>
    </div>

<!-- vue-touch 的左滑右滑 -->
    <v-touch v-on:swipeleft="swiperleft"  v-on:swiperight="swiperright" >
    <!-- 歌曲列表 -->
    <div class="pylst_last" v-if="trackSongs">
      <div class="titile">歌曲列表</div>
      <!-- 加载动画 -->
      <loadingGif v-if="isloadingGif" />
      <!-- 音乐列表 -->
      <music-list
        v-else
        :musicList="trackSongs"
        :showNum1="true"
        @play="$emit('aaaaa',$event)"
        @bofanlist="$emit('bofanlist',$event)"
        @indexNum="$emit('indexNum',$event)"
      />
      <div v-if="!isloadingGif" class="more-text">查看更多歌曲，请下载客户端</div>
    </div>

    <!-- 评论列表 -->
    <div class="titile">精彩评论</div>
    <div style="min-height: 614px;background: #fff;">
      <!-- 加载动画 -->
      <loadingGif v-if="isloadingGif1" style="margin-top: 0px;padding-top: 30px;" />
      <comment-list v-else :commentList="commentSongs" :total="total"></comment-list>
      <div style="height: 39px;"></div>
    </div>

    <!-- 收藏歌单 -->
    <div class="footer">
      <div class="footer-wrap">收藏歌单</div>
    </div>
    </v-touch>

  </div>

</template>

<script>
import musicList from "./musicList.vue";
import commentList from "./commentList.vue";
import loadingGif from "./loadingGif.vue";
export default {
  nama: "detailsPage",
  data() {
    return {
      //歌单所有歌曲
      trackSongs: [],
      //获取歌单详情
      detailSongs: [],
      //歌单评论
      commentSongs: [],
      total: 0, //歌曲评论总数
      defaultSongImg: "https://music.dogged.cn/images/player_cover.png", // 默认歌单封面
      defaultUserImg:
        "http://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg?param=30y30", // 默认头像
      isloadingGif: true, // 初始歌曲列表页面加载状态为正在加载
      isloadingGif1: true // 初始评论区页面加载状态为正在加载
    };
  },

  props: {
    songID: Number
  },

  created() {
    //  console.log(this.songID)
    this.getDetailSongs();
    this.getTrackSongs();
    this.getCommentSongs();
  },

  components: {
    musicList,
    commentList,
    loadingGif
  },

  mounted() {
    //通过使用this.$watch实例方法来监听数组的变化
    this.$watch("commentSongs", () => {
      // 评论区
      if (this.commentSongs.length > 0) {
        this.isloadingGif1 = false; // 数据加载完成，隐藏加载动画
      }
    });

    this.$watch("trackSongs", () => {
      // 歌曲列表
      if (this.trackSongs.length > 0) {
        this.isloadingGif = false; // 数据加载完成，隐藏加载动画
      }
    });
  },

  beforeDestroy() {
    this.$watch("commentSongs", null); // 取消对 commentSongs 的监听
    this.$watch("trackSongs", null); // 取消对 trackSongs 的监听
  },

  methods: {
    close() {
      this.$emit("togglePage", false);
    },

    //获取歌单详情
    getDetailSongs() {
      this.$axios
        .get("https://apis.netstart.cn/music/playlist/detail?id=" + this.songID)
        .then(res => {
          //   console.log(res.data.playlist);
          this.detailSongs = res.data.playlist;
        });
    },

    //获取歌单所有歌曲
    getTrackSongs() {
      this.$axios
        .get(
          "https://apis.netstart.cn/music//playlist/track/all?id=" +
            this.songID +
            "&limit=10&offset=0"
        )
        .then(res => {
          // console.log(res.data);

          this.trackSongs = res.data.songs.map((item, index) => {
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
        });
    },

    //获取歌单评论
    getCommentSongs() {
      this.$axios
        .get(
          "https://apis.netstart.cn/music/comment/playlist?id=" + this.songID
        )
        .then(res => {
          // console.log(res.data);
          this.commentSongs = res.data.hotComments;
          this.total = res.data.total;
        });
    },
    //左划
    swiperleft() {},
    //右滑
    swiperright() {
      this.close();//关闭页面
    }
  }
};
</script>

<style lang="scss" scoped>
.detailsPage {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #000000;
  padding-bottom: 63px;

  // 背景
  .plhead_bg {
    min-height: 126px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
    filter: blur(30px);
    overflow: hidden;
    padding: 30px 10px 30px 15px;
  }

  // 返回
  .close-img {
    position: absolute;
    top: 8px;
    left: 11px;

    .close-icon {
      width: 8px;
      height: 13px;
      background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAyNiI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI5YjliIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTIuOTM5IDIzLjkzOUwxMy44NzkgMTMgMi45MzkgMi4wNjEiLz48L3N2Zz4=)
        no-repeat;
      transform: rotate(180deg);
    }
  }

  // 歌单图片
  .plhead {
    display: flex;
    position: absolute;
    z-index: 2;
    top: 30px;
    left: 15px;

    .plhead_img {
      width: 126px;
      height: 126px;
      position: relative;
      border: solid 0.5px rgba($color: #ffffff, $alpha: 0.5);
      //background: #fff;

      img {
        width: 100%;
        vertical-align: middle;
      }

      .plhead_icon {
        // 歌单
        position: absolute;
        z-index: 3;
        top: 10px;
        left: 0;
        padding: 0 8px;
        height: 17px;
        color: #fff;
        font-size: 9px;
        text-align: center;
        line-height: 17px;
        background-color: rgba(217, 48, 48, 0.8);
        border-top-right-radius: 17px;
        border-bottom-right-radius: 17px;
      }
      .plhead_num {
        // 播放量
        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMiAyMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMDQwMDAwIiBkPSJNMjIgMTYuNzc3YzAgMS4yMzMtMS4xMjEgMi4yMzMtMi41MDYgMi4yMzMtMS4zODQgMC0yLjUwNi0xLTIuNTA2LTIuMjMzdi0yLjU1M2MwLTEuMjM0IDEuMTIyLTIuMjMzIDIuNTA2LTIuMjMzLjE3NCAwIC4zNDMuMDE3LjUwNi4wNDZ2LTEuMzdoLS4wMzNjLjAxNy0uMjIuMDMzLS40NDEuMDMzLS42NjZhOCA4IDAgMCAwLTE2IDBjMCAuMjI1LjAxNi40NDYuMDM0LjY2Nkg0djEuMzdjLjE2My0uMDI5LjMzMy0uMDQ2LjUwNS0uMDQ2IDEuMzg0IDAgMi41MDYuOTk5IDIuNTA2IDIuMjMzdjIuNTUzYzAgMS4yMzMtMS4xMjIgMi4yMzMtMi41MDYgMi4yMzNTMiAxOC4wMTEgMiAxNi43Nzd2LTIuNTUzYzAtLjI1OC4wNTktLjUwMS4xNDgtLjczQS45ODIuOTgyIDAgMCAxIDIgMTMuMDAxdi0yLjY2N2MwLS4wMjMuMDEyLS4wNDMuMDEzLS4wNjctLjAwNC0uMDg4LS4wMTMtLjE3Ni0uMDEzLS4yNjYgMC01LjUyMyA0LjQ3Ny0xMCAxMC0xMHMxMCA0LjQ3NyAxMCAxMGMwIC4wOS0uMDA5LjE3OC0uMDE0LjI2Ni4wMDIuMDI0LjAxNC4wNDQuMDE0LjA2N3YyYS45ODguOTg4IDAgMCAxLS4zNi43NTNjLjIyNC4zMzQuMzYuNzIuMzYgMS4xMzh2Mi41NTIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI2ZmZiIgZD0iTTIwIDE2Ljc3N2MwIDEuMjMzLTEuMTIxIDIuMjMzLTIuNTA2IDIuMjMzLTEuMzg0IDAtMi41MDYtMS0yLjUwNi0yLjIzM3YtMi41NTNjMC0xLjIzNCAxLjEyMi0yLjIzMyAyLjUwNi0yLjIzMy4xNzQgMCAuMzQzLjAxNy41MDYuMDQ2di0xLjM3aC0uMDMzYy4wMTctLjIyLjAzMy0uNDQxLjAzMy0uNjY2YTggOCAwIDAgMC0xNiAwYzAgLjIyNS4wMTYuNDQ2LjAzNC42NjZIMnYxLjM3Yy4xNjMtLjAyOS4zMzMtLjA0Ni41MDUtLjA0NiAxLjM4NCAwIDIuNTA2Ljk5OSAyLjUwNiAyLjIzM3YyLjU1M2MwIDEuMjMzLTEuMTIyIDIuMjMzLTIuNTA2IDIuMjMzUzAgMTguMDExIDAgMTYuNzc3di0yLjU1M2MwLS4yNTguMDU5LS41MDEuMTQ4LS43M0EuOTgyLjk4MiAwIDAgMSAwIDEzLjAwMXYtMi42NjdjMC0uMDIzLjAxMi0uMDQzLjAxMy0uMDY3LS4wMDQtLjA4OC0uMDEzLS4xNzYtLjAxMy0uMjY2IDAtNS41MjMgNC40NzctMTAgMTAtMTBzMTAgNC40NzcgMTAgMTBjMCAuMDktLjAwOS4xNzgtLjAxNC4yNjYuMDAyLjAyNC4wMTQuMDQ0LjAxNC4wNjd2MmEuOTg4Ljk4OCAwIDAgMS0uMzYuNzUzYy4yMjQuMzM0LjM2LjcyLjM2IDEuMTM4djIuNTUyIi8+PC9zdmc+);
        background-color: rgba($color: #000000, $alpha: 0.1);
        position: absolute;
        right: 2px;
        top: 0;
        z-index: 3;
        padding-left: 15px;
        color: #fff;
        font-size: 12px;
        background-position: 0;
        background-repeat: no-repeat;
        background-size: 11px 10px;
        text-shadow: 1px 0 0 rgba($color: #000000, $alpha: 0.15);
      }
    }

    // 文本
    .plhead_tiltle {
      margin-left: 15px;
      margin-top: 3px;
      margin-right: 10px;

      .text {
        padding-top: 1px;
        font-size: 17px;
        line-height: 1.3;
        color: #fefefe;
        height: 44px;
        display: -webkit-box;
        -webkit-box-pack: center;
      }

      // 创作者
      .creator {
        display: flex;
        align-items: center;
        margin-top: 2px;

        .creator-img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border-radius: 50%;
          margin-right: 5px;
          background: #fafafa;

          img {
            width: 100%;
            border-radius: 50%;
            vertical-align: middle;
          }
        }

        .creator-name {
          color: #fff;
          letter-spacing: 1px;
        }
      }
    }
  }

  // 歌曲列表
  .pylst_last {
    background: #fff;
    min-height: 614px;

    .titile {
      height: 23px;
      line-height: 23px;
      padding: 0 10px;
      font-size: 12px;
      color: #666;
      background-color: #eeeff0;
    }

    .more-text {
      color: #999;
      font-size: 14px;
      text-align: center;
      margin-top: 7px;
    }
  }

  // 精彩评论
  .titile {
    height: 23px;
    line-height: 23px;
    padding: 0 10px;
    font-size: 12px;
    color: #666;
    background-color: #eeeff0;
  }

  // 收藏歌单
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 62px;
    background: #ffffff;
    border-top: 1px solid #f0f0f0;

    .footer-wrap {
      height: 40px;
      line-height: 40px;
      border-radius: 40px;
      font-size: 18px;
      text-align: center;
      background: rgb(255, 58, 58);
      color: rgb(255, 255, 255);
      margin: 11px 30px;
    }
  }
}
</style>