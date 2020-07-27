<template>
  <div class="alignment">
    <div class="alignment-ref">{{ right[0][0] }}</div>
    <div class="columns">
      <div :class="['left', `text-${textSize}`, `text-width-${textWidth}`]">
        <div v-for="line in left" :key="line[0]" :class="['line', line[2]]">
          <span class="line-ref">{{ line[0] }}</span>
          <span class="line-text">{{ line[1] }}</span>
        </div>
      </div>
      <div :class="['right', `text-${textSize}`, `text-width-${textWidth}`]">
        <div v-for="line in right" :key="line[0]" :class="['line', line[2]]">
          {{ line[1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['left', 'right', 'textSize', 'textWidth'],
  };
</script>

<style lang="scss" scoped>
  @import '../../styles/variables';
  .alignment {
    margin-bottom: 20px;
    .columns {
      display: flex;
      .left,
      .right {
        flex: 1;
      }
      .left {
        padding-right: 0.5rem;
      }
      .right {
        padding-left: 0.5rem;
        padding-right: 0.25rem;
      }
    }
  }
  .alignment-ref {
    text-align: center;
    font-size: 12pt;
    color: #69c;
    font-family: 'Noto Sans';
    margin-bottom: 5px;
  }
  .left .line {
    display: flex;
    align-items: baseline;
    .line-ref {
      font-size: 10pt;
      color: #69c;
      font-family: 'Noto Sans';
      min-width: 4em;
      text-align: right;
    }
    .line-text {
      margin-left: 1rem;
    }
  }
  .line {
    font-family: $font-family-serif;
  }

  .text-xs .line {
    line-height: 1.5;
  }
  .text-sm .line {
    line-height: 1.6;
  }
  .text-md .line {
    line-height: 1.7;
  }
  .text-lg .line {
    line-height: 1.8;
  }
  .text-xl .line {
    line-height: 1.9;
  }
</style>
