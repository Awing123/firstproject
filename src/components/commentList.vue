<template>
<!-- 评论内容区 -->
  <div class="commentList">
    <!-- 头像 -->
    <div class="comment" v-for="(item,index) in commentList" :key="index">
      <div class="user-img">
        <img :src="item.user.avatarUrl+`?param=30y30`" />
      </div>

      <div class="wrap" v-if="commentList">
        <div class="header">
          <div class="header-content">
            <!-- 名字 -->
            <div class="user-name">
              {{item.user.nickname}}
              <!-- vip等级 (检查item.user.vipRights.associator是否存在)-->
              <div class="vip" v-if="item.user.vipRights && item.user.vipRights.associator">
                <img :src="item.user.vipRights.associator.iconUrl" class="vip-img" />
              </div>
            </div>
            <!-- 日期 -->
            <div class="time">{{item.timeStr}}</div>
          </div>
          <!-- 点赞 -->
          <div class="like">
            {{likeNum(item.likedCount)}}
            <i class="iconfont icon-like"></i>
          </div>
        </div>
        <!-- 评论内容 -->
        <div class="text">
          <span class v-if="item.beReplied.length">
            回复
            <span style="color: #507daf;">@{{item.beReplied[0].user.nickname}}</span>：
          </span>

          <span class="content">{{item.content}}</span>

          <!-- 被回复的评论 -->
          <div class="reply" v-if="item.beReplied.length">
            <span class="reply-name">@{{item.beReplied[0].user.nickname}}：</span>
            <span class="reply-content">{{item.beReplied[0].content}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论数 -->
    <div class="commentNum">
      <div class="total">查看全部{{total}}条评论</div>
      <div class="icons"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "commentList",
  props: {
    commentList: {
      type: Array,
      default: () => {
        return [];
      }
    },

    total: Number
  },

  computed: {
    likeNum() {
      return num =>{
      if ( num> 10000) {
        return Math.floor(num / 1000) / 10 + "万";
      } else {
        return num + "";
      }
    }
    }
  }
};
</script>

<style lang="scss" scoped>
.commentList {
  background: #ffffff;

  // 评论列表
  .comment {
    padding-top: 10px;
    display: flex;

    // 头像
    .user-img {
      margin: 0 10px;
      img {
        border-radius: 50%;
      }
    }
    // 右边部分
    .wrap {
      width: 100%;
      padding-right: 10px;
      padding-bottom: 11px;
      border-bottom: 1px solid rgba($color: #bdbdbd, $alpha: 0.1);

      .header {
        display: flex;

        .header-content {
          flex: 1;

          // 用户名
          .user-name {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #666;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            -webkit-box-flex: 1;
            letter-spacing: 1px;

            // vip等级
            .vip {
              margin: 0 4px;
              height: 12px;
              //  background: #ff0404;
              line-height: 12px;

              .vip-img {
                height: 100%;
              }
            }
          }
          // 日期
          .time {
            font-size: 9px;
            color: #999;
          }
        }
        // 点赞
        .like {
          line-height: 22px;
          font-size: 11px;
          color: #999;
        }
      }

      .text {
        margin-top: 5px;

        // 评论内容
        .content {
          color: #333;
          font-size: 15px;
          line-height: 22px;
        }
        // 被回复的评论
        .reply {
          margin: 5px 0;
          padding: 10px;
          color: #888;
          font-size: 14px;
          border: 1px solid rgba($color: #ababab, $alpha: 0.2);
        }
      }
    }
  }

  // 评论数
  .commentNum {
    margin: 0 50px;
    display: flex;
    align-items: center;
    height: 50px;
    justify-content: center;

    .total {
      font-size: 14px;
      color: #999;
    }

    .icons {
      width: 6px;
      height: 11px;
      margin-left: 5px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAWCAQAAACx896vAAAApUlEQVR4AWNgYDjDeKbnTDkDJjjDembRmf9n/p2JxpRiP7P3zH8g/HnGF1OS/8wlsOTXM+aYkpJnboMlX53RwZRUAQqDJB+fkcGUNDnzASQJNFwUU9LpzE+w5IkzXJiSEWf+gCU3nmHDlMwESoDgkjOMmJItUMl23FKdBAzEdMbmM2x4HY/p5StnRPEGFGbwvj6jizdSMKPy1xk/ohMALNlUYIoDAK7esfYRq6CVAAAAAElFTkSuQmCC);
      background-size: 100%;
    }
  }
}
</style>