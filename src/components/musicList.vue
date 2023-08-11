<template>
    <div class="musicList">
        <div class="song" v-for="(item,index) in musicList" :key="item.id" @click="activeIndex = index" :class="{ active: activeIndex === index }" >
            <!-- @click="activeIndex = index" 将当前点击的歌曲项的索引值赋给 activeIndex 变量
            :class="{ active: selectedIndex === index }" 如果 activeIndex 的值等于当前索引index，那么为该歌曲项添加一个名为active的类。 -->

            <div class="fl">

                <!-- 数字 -->
                <div v-if="showNum && activeIndex !== index " class="rank" :class="{ top3: index <= 2 }">
                {{ index >= 9  ?  index + 1  :   "0" + (index + 1) }}
                </div>

                 <!-- 歌单详情的数字 -->
                <div v-if="showNum1" class="rank">
                 {{index+1}}
                </div>

                <div class="content" @click="play(item,index)"> 
                    
                    <!-- 歌曲名字 -->
                    <!-- <div class="name"> {{ item.name}} -->
                        <!-- 歌曲别名 -->
                        <!-- <span class="alias" v-if="item.song.alias.length" > ({{item.song.alias[0] }} )</span> 
                    </div> -->

                    <div class="name">
                        <!-- 筛选高亮 -->
                        <span v-for="part in getHighlightedParts(item.name)" :key="part.id">
                             <span v-if="part.highlighted" class="highlighted">{{ part.text }}</span>
                             <span v-else>{{ part.text }}</span>
                        </span>

                       <span class="alias" v-if="item.song.alias.length">({{ item.song.alias[0] }})</span>
                    </div>
                
                <!-- 歌手和专辑 -->
                <div class="artist">
                    <!-- vip歌曲 -->
                     <i class="vip" v-if="item.fee === 1">
                        <i class="iconfont icon-vip"></i>
                        </i> 
                     <!-- SQ 码率 -->
                    <i class="maxbr" v-if="item.song.privilege.maxbr > 320000"> </i>

                    <!-- 歌手名字 -->
                    <!-- <span class="artist-name" v-for="(artist,i) in item.song.artists" :key="i">
                        {{ artist.name }} <span v-if="i != item.song.artists.length - 1">/</span> 
                    </span> -->

                    <span class="artist-name" v-for="(artist,i) in item.song.artists" :key="i">
                        <!-- 筛选高亮 -->
                        <span v-for="part in getHighlightedParts(artist.name)" :key="part.id">
                            <span v-if="part.highlighted" class="highlighted">{{ part.text }}</span>
                            <span v-else>{{ part.text }}</span>
                        </span>

                        <span v-if="i != item.song.artists.length - 1">/</span> 
                    </span>

                 
                    <!-- 歌曲名字 -->
                    <!-- - <span>{{ item.song.album.name}}</span> -->

                     <!-- 筛选高亮 -->
                       - <span v-for="part in getHighlightedParts(item.song.album.name)" :key="part.id">
                            <span v-if="part.highlighted" class="highlighted">{{ part.text }}</span>
                            <span v-else>{{ part.text }}</span>
                        </span>
                    
                 </div>
                </div>
            </div>
            <!-- 播放图标 -->
            <div class="fr"> 
                <span @click="play(item,index)"></span>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    name:"musicList",

     data() {
      return {
        
      };
    },

    props:{
        activeIndex: Number, // 高亮索引

        searchKeyword:String, //接收search.vue传过来的搜索关键字  （1）

        musicList:{
            type:Array,
            default: ()=>{
                return [];
            },
        },

        //是否显示排名
        showNum:{
           type: Boolean,
           default: false,
        },  
        showNum1:{
           type: Boolean,
           default: false,
        }, 
        
    },
    
    methods: {
        play(music,index){    
            this.$emit("play",music) // 传递一条音乐信息给父组件
           
            this.$emit("bofanlist",this.musicList)// 播放列表
            // console.log(this.musicList)
            this.$emit("indexNum",index) // 高亮索引
        },
     
        getHighlightedParts(name) { //传入歌名
            const parts = [];  //声明一个空数组，用于存储处理后的歌曲名字的部分
            const regex = new RegExp(`(${this.searchKeyword})`, "gi"); // 创建一个正则表达式，用于匹配搜索关键字。 "gi" 是正则表达式的标志，用于指定正则表达式的匹配模式。"g" 表示全局匹配，即查找所有匹配项而不只是第一个匹配项。"i" 表示不区分大小写匹配，即忽略匹配项的大小写差异。
            const matches = name.match(regex); //使用正则表达式匹配歌曲名字中与搜索关键字相符的部分，并将结果保存在 matches 变量中。
            if (matches) { //检查是否存在与搜索关键字相符的部分
                name.split(regex).forEach(part => {   //使用正则表达式匹配的位置拆分歌曲名字为多个部分，并对每个部分进行遍历。
                    if (matches.includes(part.toLowerCase())) { //检查当前部分是否在匹配项中，不区分大小写。part.toLowerCase() 是将 part 字符串转换为小写字母形式，以确保比较的一致性。
                        parts.push({ text: part, highlighted: true }); //如果当前部分在匹配项中，则将其添加到 parts 数组中，并将 highlighted 属性设置为 true，表示需要高亮显示。
                    } else {
                        parts.push({ text: part, highlighted: false });//如果当前部分不在匹配项中，则将其添加到 parts 数组中，并将 highlighted 属性设置为 false，表示不需要高亮显示。
                    }
                });
            } else {
                parts.push({ text: name, highlighted: false }); //如果没有与搜索关键字匹配的部分，则将整个歌曲名字作为一个部分，将其添加到 parts 数组中，并将 highlighted 属性设置为 false。
            }
            return parts; //返回处理后的歌曲名字的部分数组
        },


    },

};
</script>


<style lang="scss" scoped>
.highlighted {   //与搜索文字相同的高亮
  color: #3d76b7 ;
}

.active {   // 点击背景高亮
  background: rgba($color: #f78c00, $alpha: 0.2) ;
  margin-left: -10px;
  color: #f78c00 ; 

     &::before{
        content: "";
        background: url(../assets/wave.gif) no-repeat;
        width:25px;
        margin: 20px 0 0 15px;
    }

}

.musicList{
    padding-left: 10px;
    .song{
        display: flex;
        border-bottom: 1px solid rgba(184, 181, 175, 0.2);
       
    //    &:last-child{
    //         border-bottom: 0 ;
    //     }
        
        .fl{
            flex:1;
            padding:6px 0 ;

            display: flex;

            .rank{
                width:40px;
                display:flex;
                align-items:center;
                justify-content: center;
                font-size:17px;
                color:#999;
                margin-left: -10px;
            }
            
            .top3{
                color:#df3436
            }

            .content{
                width:0;
                flex:1 1 auto;

                .name{
                    font-size: 17px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-break: normal;
                    .alias{
                        color: #888;
                        margin-left: 4px;
                    }
                }
            }
            .artist{
                font-size:12px;
                color:#888;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-break: normal;
               
                .vip{
                    color: #edf50f;
                    width: 12px;
                    height: 8px;
                    display: inline-block;
                    margin-right: 4px;     
                    
                    i{
                        font-size: 1px;
                    }
                }

                .maxbr{
                    background: #000000;
                    width: 12px;
                    height: 8px;
                    display: inline-block;
                    margin-right: 4px;
                    //雪碧图或精灵图用在背景图片
                    background:url(../assets/index_icon_2x.png);
                    background-size: 166px 97px;
                }
            }

        }
        .fr{
            display: flex;
            align-items: center;
            padding: 0 10px;

            span{
                display: inline-block;
                width: 22px;
                height: 22px;
               //雪碧图或精灵图用在背景图片
                background:url(../assets/index_icon_2x.png);
                background-position: -24px 0;
                background-size: 166px 97px;
            }
        }

        .fr:active{
            opacity: 0.5;
        }


    }
}
</style>
