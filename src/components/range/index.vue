<template>
  <div class="vux-range-input-box mychange" style="position:relative;margin-right:30px;margin-left:30px;">
    <!-- <input class="vux-range-input" v-model.number="currentValue"> -->
      <input class="vux-range-input" v-model.number="currentValue">
    <!-- 5{{currentValue}}5 -->
    <div @click='goto0()' class="circle-item first" id="first"></div>
    <div @click='goto25()' class="circle-item second" id="second"></div>
    <div @click='goto50()' class="circle-item third" id="third"></div>
    <div @click='goto75()' class="circle-item fourth" id="fourth"></div>
    <div @click='goto100()' class="circle-item fifth" id="fifth"></div>
    <div class="percent" id="percent">
      {{(per/max*100).toFixed(1)}}%
      <!-- {{max}} -->
    </div>
    <div class="midcircle" id="midcircle">

    </div>
    <div class="leftstart">
      0
    </div>
    <div class="rightend">
      余额全部
    </div>
    <div class="leftdiv zd" id="leftdiv">

    </div>
    <div class="rightdiv zd" id="rightdiv">

    </div>
  </div>
</template>

<script>
import Powerange from './powerange'

export default {
  name: 'range',
  props: {
    per:{
      type: Number,
      default: 0
    },
    decimal: Boolean,
    value: {
      default: 0,
      type: Number
    },
    min: {
      type: Number,
      default: 0
    },
    minHTML: String,
    maxHTML: String,
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    disabled: Boolean,
    disabledOpacity: Number,
    rangeBarHeight: {
      type: Number,
      default: 1
    },
    rangeHandleHeight: {
      type: Number,
      default: 40
    }
  },
  created () {
    this.currentValue = this.value
  },
  mounted () {
    const _this = this
    this.$nextTick(() => {
      let options = {
        callback: function (value) {
          _this.currentValue = value
        },
        decimal: this.decimal,
        start: this.currentValue,
        min: this.min,
        max: this.max,
        minHTML: this.minHTML,
        maxHTML: this.maxHTML,
        disable: this.disabled,
        disabledOpacity: this.disabledOpacity,
        initialBarWidth: window.getComputedStyle(this.$el.parentNode).width.replace('px', '') - 80
      }
      if (this.step !== 0) {
        options.step = this.step
      }
      this.range = new Powerange(this.$el.querySelector('.vux-range-input'), options)
      const handleTop = (this.rangeHandleHeight - this.rangeBarHeight) / 2
      this.$el.querySelector('.range-handle').style.top = `-${handleTop}px`
      this.$el.querySelector('.range-bar').style.height = `${this.rangeBarHeight}px`
      this.handleOrientationchange = () => {
        this.update()
      }
      window.addEventListener('orientationchange', this.handleOrientationchange, false)
    })
  },
  methods: {
    update () {
      console.log('update', this.currentValue)
       this.currentValue=0;
      let value = this.currentValue


      if (value < this.min) {
        value = this.min
      }
      if (value > this.max) {
        value = this.max
      }
      this.range.reInit({
        min: this.min,
        max: this.max,
        step: this.step,
        value
      })
      this.currentValue = value
      this.range.setStart(this.currentValue)
      this.range.setStep()
    },
    goto0: function(){
      // alert(1);
      this.currentValue=0
    },
    goto25: function(){
      // alert(1);
      this.currentValue=this.max/4
    },
    goto50: function(){
      // alert(1);
      this.currentValue=this.max/2
    },
    goto75: function(){
      // alert(1);
      this.currentValue=this.max/4*3
    },
    goto100: function(){
      // alert(1);
      this.currentValue=this.max
    },
  },
  data () {
    return {
      currentValue: 0
    }
  },
  watch: {
    currentValue (val) {
      this.range && this.range.setStart(val)
      this.$emit('input', val)
      this.$emit('on-change', val)
    },
    value (val) {
      this.currentValue = val
    },
    min () {
      this.update()
    },
    step () {
      this.update()
    },
    max () {
      this.update()
    }
  },
  beforeDestroy () {
    window.removeEventListener('orientationchange', this.handleOrientationchange, false)
  }
}
</script>

<style lang="less">
@import '../../styles/variable.less';
@import './powerange.less';
.mychange{
  .circle-item{
    width: 12px;
    height: 12px;
    border-radius: 12px;
    background: #a9acb1;
    position: absolute;
    left: 0;
    top: -4px;
    z-index: 10;
  }
  .first{
    left: 0%;
  }
  .second{
    left: 26%;
  }
  .third{
    left:49%;
  }
  .fourth{
    left:70%;
  }
  .fifth{
    left:95%;
  }
  .range-quantity{
    background: #ff6000;
  }
  .percent{
    position: absolute;
    left: 0;
    top:-40px;
    width: 50px;
    height: 20px;
    background: transparent;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    color: #fff;
  }
  .midcircle{
    position: absolute;
    left: 15px;
    top:-3px;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background: #ff6000 ;
    z-index: 20;
  }
  .leftstart{
    font-size: 12px;
    color: #AEAEAE;
    position: absolute;
    left: 0;
    top:15px;
  }
  .rightend{
    font-size: 12px;
    color: #AEAEAE;
    position: absolute;
    right: 0;
    top:15px;
  }
  .zd{
    width: 12px;
    height: 20px;
    background: #1f232f;
  }
  .leftdiv{
    position: absolute;
    top:-13px;
    left: 0
  }
  .rightdiv{
    position: absolute;
    top:-13px;
    right:0px;
  }
}
</style>
