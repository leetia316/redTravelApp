<template>
  <div class="game">
    <van-nav-bar
      v-if="!isWeChatUS"
      left-text="返回"
      title="知识游戏"
      left-arrow
      @click-left="$router.back()"
      @click-right=""
      :fixed="true"
    >
    </van-nav-bar>
    <div class="main" ref="centerDiv">
        <div class="item">
          <Loading v-show="showLoading"/>
          <p class="title">{{index}}、{{title}}</p>
          <div class="opinions">
            <van-radio-group v-model="radioResult" v-if="!multiple">
              <template v-for="(item, index)  in options">
                <p class="opinion" @click="radio= index" :key="index">  <van-radio :name="item">{{item}}</van-radio></p>
              </template>
            </van-radio-group>
            <van-checkbox-group v-model="multipleResult" v-else>
              <van-checkbox
                v-for="(item, index) in options"
                :key="index"
                :name="item"
              >
                {{item}}
              </van-checkbox>
            </van-checkbox-group>

          </div>

          <p style="margin-top: 10px;color: red" v-show="showAnswer">正确答案是：{{rightAnswer}}</p>
          <button class="submit_item" @click="onSubmitItem" v-show="!showNextItemBtn">确定</button>
          <button class="submit_item" style="background-color: #06bf04" @click="nextItem" v-show="showNextItemBtn" >下一题</button>
        </div>
    </div>
  </div>
</template>

<script>
  import ItemContainer from './itemcontainer'
  import weChat from '@/tools/public'
    export default {
        name: "knowledgeGage",
      component:{ItemContainer},
        data() {
            return {
              typeId:'',
              index:0,
              pageApi:'/knowledge/getInteractions',
              title:'',
              options:[],
              multiple:false,
              items:[],
              radioResult:'',
              multipleResult:[],
              showLoading:false,
              rightOption:'',
              rightAnswer:'',
              showAnswer:false,
              showNextItemBtn:false,
              isWeChatUS: !!weChat.inWeChat()
            }
        },
        computed: {},

        created() {
          this.showLoading = true;
          this.typeId = this.$route.query.id;
          this.$ajaxGet('/knowledge/getInteractions', {typeId: this.typeId}).then(res => {
            this.items = res.data;
            console.log(res.data)
            if(this.items.length>0){
              this.setItem(this.items[0])
            }
            this.$nextTick(()=>{
              this.showLoading = false;
            })
          }).catch(err=>{
            this.showLoading = false;
          })
        },

        mounted() {
          if(this.isWeChatUS){   //微信环境下去掉顶部栏
            this.$refs.centerDiv.style.top = 0;
          }
        },


      methods: {
        setItem(item){
          if(this.index === this.items.length){
            this.$toast('没有题啦~')
            return
          }
          this.showAnswer = false;
          this.showNextItemBtn = false;
          this.radioResult = '';
          this.rightAnswer = '';
          this.multipleResult.splice(0,this.options.length)
          this.options.splice(0,this.options.length)
          this.index++;
          if(item.multiple_choice == 0){
            this.multiple = false
          }else {
            this.multiple = true
          }
          this.title = item.knowledge_desc;
          this.rightOption = item.rightOption;
          let keys = Object.keys(item)
          keys.forEach(value=>{
            if(value.includes('option')){
              // this.options.push({
              //     [value]:item[value]
              // })
              let pos = value.substring(6);
              this.$set(this.options, pos, item[value])
            }
          });
        },
        nextItem(){
          this.setItem(this.items[this.index])
        },
        onSubmitItem(){
          if(this.multiple){
            if(this.multipleResult.length === 0){
              this.$toast('请选择答案！');
              return
            }
            let re = [];
            this.showNextItemBtn = true;
            this.multipleResult.forEach(value => {
              re.push(this.options.indexOf(value))
            })
            let right = this.rightOption.split(',');
            let re2 = [];
            right.forEach(value => {
              re2.push(Number(value.substring(6)))
              this.rightAnswer = this.rightAnswer +'，'+this.options[Number(value.substring(6))]
            });
            if(re.sort().toString() == re2.sort().toString()){
              this.$toast.success('回答正确！');
            }else {
              this.$toast.fail('回答错误！');
              this.showAnswer = true;
            }
          }else {  //单选
            if(this.radioResult === ''){
              this.$toast('请选择答案！');
              return
            }
            this.showNextItemBtn = true;
            let pos1 = this.options.indexOf(this.radioResult)
            let right = this.rightOption.substring(6);
            if(pos1 == right){
              this.$toast.success('回答正确！');
            }else{
              this.$toast.fail('回答错误！');
              this.rightAnswer = this.options[right]
              this.showAnswer = true;
            }
          }
        }
      }
    }
</script>

<style scoped lang="scss">

  .game{
    .main{
      @include bg-image('../../assets/konwledge/knowledge_bg');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      @include scroll-div();
      top:46px;
      .item{
        margin: 15vh 30px;
        min-height: 30vh;
        width: auto;
        background: rgba(255,255,255,0.65);
        padding: 30px 20px;
        .title{
          font-size: $text-l;
        }
        .opinions{
          margin-top: 15px;
          .opinion{
            padding: 10px 0;
          }
        }
        .submit_item{
          margin-top: 25px;
          width: 100%;
          background-color: $theme;
          font-size: $text-l;
          color: white;
          line-height: $text-l;
          padding: 12px;
          border: none;
          border-radius: 30px;
        }
      }
    }

  }
</style>
