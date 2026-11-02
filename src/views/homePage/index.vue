<template>
  <div class="content_warp">
    111
  </div>
</template>

<script>

export default {
  name: 'homePage',

  data() {
    return {
      
    };
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  },
};

</script>

<style lang="scss" scoped>
::v-deep {
  .el-card {
    border-radius: 10px;
  }

  .el-card__body {
    height: 100%;
    padding: 12px 15px;
  }

  .el-tabs__nav {
    background: #e5ecff;
  }

  .el-tabs--card > .el-tabs__header {
    border: none;
  }

  .el-tabs__header {
    margin-bottom: 10px;
  }

  .radio_btn {
    .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 20px 0 0 20px;
    }

    .el-radio-button:last-child .el-radio-button__inner {
      border-radius: 0 20px 20px 0;
    }

    .el-radio-button--mini .el-radio-button__inner {
      padding: 5px 15px;
    }
  }


  .el-radio-button__inner {
    background: #e5ecff;
  }

  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background: #6e94fe;
  }

  .el-button--primary {
    background: #6e94fe;
  }
}

.content_warp {
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  gap: 12px;

  .left_warp {
    width: 69%;
    height: 100%;
    flex: 7;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .top_area {
      flex: 0 0 auto;
    }

    .model_area {
      flex: 1;
    }

    .monitor_area {
      width: 100%;
      flex: 0 0 auto;
    }
  }

  .right_warp {
    width: 30%;
    height: 100%;
    flex: 3;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .tab-container::after {
    content: "";
    position: absolute;
    top: 0;
    right: -5px;
    width: 5px;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.08), transparent);
  }

  .card_title {
    width: 237px;
    height: 24px;
    background-image: url("../../assets/home/titBg.png");
    background-repeat: no-repeat;
    padding-left: 35px;
    font-weight: bold;
    color: #444;
    line-height: 25px;
    font-size: 14px;
    letter-spacing: 2px;
  }

  .iconImg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70px;
    border: 1px solid #eee;
    margin-right: 10px;
    border-radius: 12px;
    font-size: 12px;
    box-shadow: 0px 1px 10px 0px rgba(57, 160, 248, 0.2);
    padding: 3px 0;

    img {
      margin-right: 5px;
    }
  }

  .data_link {

    &:hover {
      // 出现下划线
      text-decoration: underline;
    }
  }

  .legend-header,
  .legend-item {
    display: grid;
    grid-template-columns: 40px 90px 70px 70px;
    align-items: center;
    margin-bottom: 5px;
  }

  .legend-header {
    font-weight: bold;
    color: #507cff;
  }

  .item_percent {
    color: #4FAAFF;
  }

  .marker {
    display: inline-block;
    width: 18px;
    height: 10px;
    border-radius: 20%;
  }
}

@media (min-height: 1080px) {
  .content_warp .center_warp .left_top img {
    margin-top: 20px;
  }
}
</style>