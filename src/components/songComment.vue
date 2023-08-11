<template>
  <!-- 歌曲评论 -->
  <div class="songComment">
    <div class="nav">
      <!-- 返回 -->
      <div class="close-img">
        <div class="close-icon" @click="close"></div>
        <span>评论({{total}})</span>
      </div>

      <!-- 分享 -->
      <i class="iconfont icon-send"></i>
    </div>

    <!-- 加载动画 -->
    <loadingGif v-if="isloadingGif" />

    <div v-else class="bigbox">
      <!-- 歌曲信息 -->
      <div class="song-message">
        <div class="img">
          <img class="song-img" :src="bgPicUrl+`?param=30y30`" />
        </div>

        <div class="name">
          <div class="song-name">{{currentMusic.name}}</div>-
          <div class="artists">
            <em class="artist-name" v-for="(artist,i) in currentMusic.song.artists" :key="i">
              <span>
                {{artist.name}}
                <span v-if="i != currentMusic.song.artists.length -1">/</span>
              </span>
            </em>
          </div>
        </div>
      </div>

      <div style="margin-top: 10px; width: 100%;height: 6px; background-color: #eeeded;"></div>

      <!-- 评论列表 -->
      <div class="titile">
        <div>评论区</div>
        <div class="HotorNew">
          <span @click="isHotShow=true" :class="{ highLighteline: isHotShow }">最热</span>
          |
          <span @click="isHotShow=false" :class="{ highLighteline: !isHotShow }">最新</span>
        </div>
      </div>

      <!-- vue-touch 的左划右划 -->
      <v-touch v-on:swipeleft="swiperLeft" v-on:swiperight="swiperRight" >
        <div class="list">
          <!-- 最热 -->
          <comment-list v-if="isHotShow" :commentList="songComment1" :total="total"></comment-list>
          <!-- 最新 -->
          <comment-list v-else :commentList="songComment2" :total="total"></comment-list>
        </div>
      </v-touch>
    </div>
  </div>
</template>

<script>
import commentList from "./commentList.vue";
import loadingGif from "./loadingGif.vue";
export default {
  nama: "songComment",
  data() {
    return {
      songComment1: [], // 最热评论
      songComment2: [], // 最新评论
      total: 0,
      isHotShow: true, //默认先显示最热评论
      isloadingGif: true // 初始页面加载状态为正在加载
    };
  },

  props: {
    currentMusic: {
      type: Object,
      default: {}
    }
  },

  components: {
    commentList,
    loadingGif
  },

  computed: {
    bgPicUrl() {
      if (this.currentMusic.picUrl == null) {
        // 数据形式不一样
        return this.currentMusic.al.picUrl;
      } else {
        return this.currentMusic.picUrl;
      }
    }
  },

  created() {
    this.getSongComment();
  },

  mounted() {
    //通过使用this.$watch实例方法来监听数组的变化
    this.$watch("songComment2", () => {
      if (this.songComment2.length > 0) {
        this.isloadingGif = false; // 数据加载完成，隐藏加载动画
      }
    });
  },

  beforeDestroy() {
    this.$watch("songComment2", null); // 取消对 songComment1 的监听
  },

  methods: {
    close() {
      this.$emit("songCommentpage", false);
    },

    //获取歌曲评论
    getSongComment() {
      this.$axios
        .get(
          "https://apis.netstart.cn/music/comment/music?id=" +
            this.currentMusic.id
        )
        .then(res => {
          //  console.log(res.data);
          this.songComment1 = res.data.hotComments;
          this.songComment2 = res.data.comments;
          this.total = res.data.total;
        });
    },

    //左划
    swiperLeft() {
      if (this.isHotShow) {
        this.isHotShow = false;
      }
    },
    //右滑
    swiperRight() {
      if (!this.isHotShow) {
        this.isHotShow = true;
      }else{
        this.close()//关闭评论
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.songComment {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #ffffff;
  color: #000;

  .nav {
    background: #ffffff;
    width: 100%;
    height: 30px;
    position: fixed;

    // 返回
    .close-img {
      display: flex;
      align-items: center;
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

      span {
        color: #666;
        margin-left: 15px;
      }
    }

    i {
      position: absolute;
      top: 8px;
      right: 11px;
    }
  }
  .bigbox {
    // border: #f90000 10px solid;
    overflow: auto; //滚动播放
    height: 667px;
    scrollbar-width: none; /* 取消滚动条宽度 */
    -ms-overflow-style: none; /* 禁用 IE 和 Edge 浏览器的滚动条 */
  }
  .bigbox::-webkit-scrollbar {
    /* 隐藏滚动条 */
    display: none; /* Chrome, Safari, and Opera */
  }

  // 歌曲信息
  .song-message {
    margin-top: 50px;
    margin-left: 10px;
    display: flex;
    align-items: center;

    .img {
      padding: 7px;
      width: 25px;
      height: 25px;
      background: #000;
      border-radius: 50%;

      .song-img {
        width: 25px;
        height: 25px;
        border-radius: 50%;
      }
    }

    .name {
      display: flex;
      align-items: center;
      margin-right: 20px;
      overflow: hidden;

      .song-name {
        margin: 0 5px;
        white-space: nowrap;
      }

      .artists {
        margin: 0 5px;
        color: #666;
        font-size: 1px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: normal;
      }
    }
  }

  // 评论区
  .titile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    //backgroundrgb(255, 2, 2)0a;

    div:first-child {
      margin-left: 10px;
      line-height: 25px;
      font-weight: bold;
    }

    .HotorNew {
      color: #9f9f9f;
      font-size: 1px;

      span {
        margin: 0 10px;
      }

      .highLighteline {
        //高亮
        color: #000;
        font-weight: bold;
      }
    }
  }

  .list{
    min-height: 500px;
  }
}
</style>