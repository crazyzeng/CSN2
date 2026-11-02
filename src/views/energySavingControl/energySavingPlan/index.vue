<!-- 节能预案 -->
<template>
  <div class="energy_saving_plan">
    <div class="card-container">
      <div v-for="(item, index) in tableData" :key="index" class="stat-card"
        :class="[`card-theme-${index}`, { 'active-card': activeCardIndex === index }]" @click="handleCardClick(index)">
        <div class="card-header">
          <span class="card-title">{{ item.title }}</span>
          <span class="card-status">
            <span class="card_status_title">已完成</span>
            <span class="card_status_num">{{ item.completedNum }}/</span>
            <span class="card_status_percent">{{ item.total }}</span>
          </span>
        </div>
        <div class="card-body">
          <div class="stat-item">
            <span class="label">日度: </span>
            <span class="value">{{ item.dayNum }}</span>
          </div>
          <div class="stat-item">
            <span class="label">月度: </span>
            <span class="value">{{ item.moonNum }}</span>
          </div>
          <div class="stat-item">
            <span class="label">季度: </span>
            <span class="value">{{ item.seasonNum }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!tableVisible" class="content">
      <div class="table">
        <el-table ref="planTable" :data="(tableData[activeCardIndex] && tableData[activeCardIndex].data) || []"
          height="100%" size="mini" row-key="userName" header-cell-class-name="th-table-header-cell"
          @row-click="handleRowClick" highlight-current-row>
          <el-table-column label="序号" type="index" width="120" align="center"></el-table-column>
          <el-table-column label="预案项目" prop="title" align="center"></el-table-column>
          <el-table-column label="周期" prop="cycle" align="center"></el-table-column>
          <el-table-column label="状态" prop="status" align="center">
            <template slot-scope="scope">
              <span :class="getStatusClass(scope.row.status)">
                {{ scope.row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="上次记录时间" prop="date" align="center"></el-table-column>
        </el-table>
      </div>
    </div>

    <div v-else class="content1">
      <div class="table1">
        <el-table ref="planTable" :data="(tableData[activeCardIndex] && tableData[activeCardIndex].data) || []"
          height="100%" size="mini" row-key="userName" header-cell-class-name="th-table-header-cell"
          @row-click="handleRowClick" highlight-current-row>
          <el-table-column label="序号" type="index" width="120" align="center"></el-table-column>
          <el-table-column label="预案项目" prop="title" align="center"></el-table-column>
          <el-table-column label="周期" prop="cycle" align="center"></el-table-column>
          <el-table-column label="状态" prop="status" align="center">
            <template slot-scope="scope">
              <span :class="getStatusClass(scope.row.status)">
                {{ scope.row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="上次记录时间" prop="date" align="center"></el-table-column>
        </el-table>
      </div>

      <div class="details1">
        <div class="details_box">
          <div class="details_title">项目详情</div>
          <div class="details_info">责任部门： {{ detailsData.department }}</div>
          <div class="details_info">&nbsp;&nbsp;&nbsp;责任人： {{ detailsData.person }}</div>
          <div class="details_info">执行周期： {{ detailsData.cycle }}</div>
          <div class="details_info">执行日期： {{ detailsData.date }}</div>
          <div class="details_title">项目记录</div>
          <div class="details_info">记录文件： <span class="details_test">记录文件.pdf</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//
export default {
  data() {
    return {
      tableData: [
        {
          title: '冷却塔节能预案',
          total: 10,
          completedNum: 6,
          dayNum: 3,
          moonNum: 2,
          seasonNum: 5,
          data: [{
            title: '冷却塔定期巡检',
            cycle: '季度',
            status: '待处理',
            date: '2026-01-02 09:43:13',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '空压机温度日记录',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-16 08:35:16',
            department: '研发中心',
            person: '林琳',
          },
          {
            title: '补水量日记录',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-16 08:45:56',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '补水阀日巡检',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-16 08:57:41',
            department: '研发中心',
            person: '林琳',
          },
          {
            title: '冷却塔填料周巡检',
            cycle: '季度',
            status: '待处理',
            date: '2026-01-02 11:23:53',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '集水池水位及脏污度周巡检',
            cycle: '季度',
            status: '已完成',
            date: '2026-01-02 11:13:23',
            department: '研发中心',
            person: '林琳',
          },
          {
            title: '冷却塔填料月清洗',
            cycle: '月度',
            status: '待处理',
            date: '2026-03-22 10:15:16',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '集水池及回水口月清洗',
            cycle: '月度',
            status: '已完成',
            date: '2026-04-02 09:45:56',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '风机及叶片季度检修',
            cycle: '季度',
            status: '待处理',
            date: '2026-01-02 14:23:43',
            department: '研发中心',
            person: '林琳',
          },
          {
            title: '润滑及密封件季度巡检',
            cycle: '季度',
            status: '已完成',
            date: '2026-01-02 15:03:43',
            department: '维保中心',
            person: '曾海涵',
          }]
        },
        {
          title: '冷热源节能预案',
          total: 13,
          completedNum: 7,
          dayNum: 8,
          moonNum: 4,
          seasonNum: 1,
          data: [{
            title: '冷冻水PH值混浊度日记录',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-15 08:35:16',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '冷却水PH值混浊度日记录',
            cycle: '日度',
            status: '待处理',
            date: '2026-04-14 08:37:12',
            department: '研发中心',
            person: '林琳',
          },
          {
            title: '机组油位日记录',
            cycle: '日度',
            status: '待处理',
            date: '2026-04-14 08:38:26',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '机组噪音日记录',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-15 08:35:16',
            department: '研发中心',
            person: '林琳',
          },
          {
            title: '机组泄漏日记录',
            cycle: '日度',
            status: '待处理',
            date: '2026-04-14 08:38:16',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '冷凝器季度清洗',
            cycle: '季度',
            status: '已完成',
            date: '2026-03-16 08:35:16',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '蒸发器季度清洗',
            cycle: '月度',
            status: '已完成',
            date: '2026-04-01 10:15:26',
            department: '研发中心',
            person: '林琳',
          },
          {
            title: '过滤器月清洁',
            cycle: '月度',
            status: '待处理',
            date: '2026-04-03 09:45:56',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '水系统管线月度电子检漏',
            cycle: '月度',
            status: '已完成',
            date: '2026-04-11 10:15:26',
            department: '研发中心',
            person: '林琳',
          },
          {
            title: '电气接线月度巡检',
            cycle: '月度',
            status: '待处理',
            date: '2026-03-12 11:35:56',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '水泵及阀门温度日记录',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-12 11:41:52',
            department: '研发中心',
            person: '林琳',
          },
          {
            title: '水泵及阀门噪音日记录',
            cycle: '日度',
            status: '待处理',
            date: '2026-04-12 12:46:16',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '水泵及阀门泄漏日记录',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-12 14:45:56',
            department: '研发中心',
            person: '林琳',
          }]
        },
        {
          title: '燃气锅炉节能预案',
          total: 11,
          completedNum: 7,
          dayNum: 5,
          moonNum: 4,
          seasonNum: 2,
          data: [{
            title: '锅炉压力日记录',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-15 10:25:46',
            department: '维保中心',
            person: '陈涛',
          },
          {
            title: '锅炉温度日记录',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-15 10:15:21',
            department: '维保中心',
            person: '陈涛',
          },
          {
            title: '锅炉燃烧状态日记录',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-15 10:15:21',
            department: '维保中心',
            person: '陈涛',
          },
          {
            title: '锅炉噪音日记录',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-15 10:21:11',
            department: '维保中心',
            person: '陈涛',
          },
          {
            title: '锅炉泄漏日记录',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-15 11:15:46',
            department: '研发中心',
            person: '林琳',
          },
          {
            title: '过滤器月度清洗',
            cycle: '月度',
            status: '待处理',
            date: '2026-04-01 09:21:16',
            department: '维保中心',
            person: '陈涛',
          },
          {
            title: '压力表月度清洗',
            cycle: '月度',
            status: '已完成',
            date: '2026-04-01 11:55:41',
            department: '研发中心',
            person: '林琳',
          },
          {
            title: '季度清灰保养',
            cycle: '季度',
            status: '已完成',
            date: '2026-02-02 08:55:51',
            department: '维保中心',
            person: '陈涛',
          },
          {
            title: '燃烧器清洁维护',
            cycle: '季度',
            status: '待处理',
            date: '2026-02-01 09:51:32',
            department: '研发中心',
            person: '林琳',
          },
          {
            title: '水系统管线月度电子检漏',
            cycle: '月度',
            status: '已完成',
            date: '2026-04-01 10:21:12',
            department: '维保中心',
            person: '陈涛',
          },
          {
            title: '电气接线月度巡检',
            cycle: '月度',
            status: '待处理',
            date: '2026-04-03 11:22:12',
            department: '维保中心',
            person: '陈涛',
          }]
        },
        {
          title: '照明节能预案',
          total: 6,
          completedNum: 5,
          dayNum: 5,
          moonNum: 1,
          seasonNum: 0,
          data: [{
            title: '全区高效LED光源替换',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-14 10:31:22',
            department: '维保中心',
            person: '陈涛',
          },
          {
            title: '公区照明LED光源月巡检',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-14 10:21:16',
            department: '研发中心',
            person: '林琳',
          },
          {
            title: '商业照明LED光源月巡检',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-14 9:21:23',
            department: '维保中心',
            person: '陈涛',
          },
          {
            title: '应急照明UPS月度巡检',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-14 10:31:19',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '照明线路分区月度巡检',
            cycle: '日度',
            status: '已完成',
            date: '2026-04-14 09:11:24',
            department: '维保中心',
            person: '曾海涵',
          },
          {
            title: '照明线路分区线损月度记录',
            cycle: '月度',
            status: '待处理',
            date: '2026-03-11 08:31:24',
            department: '维保中心',
            person: '曾海涵',
          }]
        }],
      detailsData: {},
      tableVisible: false,
      activeCardIndex: -1, 
    };
  },
  computed: {},

  mounted() {
    this.activeCardIndex = 0;
  },
  methods: {
    getStatusClass(status) {
      return status === '已完成' ? 'status-completed' : 'status-pending';
    },
    handleCardClick(index) {
      this.activeCardIndex = index;
      this.tableVisible = false;

      this.$nextTick(() => {
        if (this.$refs.planTable) {
          this.$refs.planTable.setCurrentRow(null);
        }
      });
    },
    handleRowClick(row, column, event) {
      this.tableVisible = true;
      this.detailsData = row;
    }
  },
};
</script>

<style lang="scss" scoped>
.energy_saving_plan {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .card-container {
    height: 15%;
    margin-bottom: 15px;
    display: flex;
    gap: 10px;
  }

  .stat-card {
    flex: 1;
    border-radius: 10px;
    padding: 15px;
    color: #000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s;

    &.card-theme-0 {
      background: linear-gradient(180deg, #7eacfc 0%, #EEF5FF 100%);
    }

    &.card-theme-1 {
      background: linear-gradient(180deg, #FCF3E4 0%, #EEF5FF 100%);
    }

    &.card-theme-2 {
      background: linear-gradient(180deg, #EEE6FE 0%, #EEF5FF 100%);
    }

    &.card-theme-3 {
      background: linear-gradient(180deg, #F7FFE7 0%, #EEF5FF 100%);
      color: #555;
    }

    &.card-theme-0.active-card {
      box-shadow: 0 0 0 2px #7aa9fa inset;
    }

    &.card-theme-1.active-card {
      box-shadow: 0 0 0 2px #E6C88A inset;
    }

    &.card-theme-2.active-card {
      box-shadow: 0 0 0 2px #B39DDB inset;
    }

    &.card-theme-3.active-card {
      box-shadow: 0 0 0 2px #8BC34A inset;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;

      .card-title {
        font-size: 16px;
        letter-spacing: 2px;
      }

      .card-status {
        font-size: 14px;

        .card_status_title {
          font-size: 16px;
          color: #666;

        }

        .card_status_num {
          color: #000;
          font-size: 18px;
          font-weight: normal;
          margin-left: 5px;
        }
      }
    }

    .card-body {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 10px;

      .stat-item {
        text-align: center;

        .label {
          font-size: 14px;
          color: #666;
        }

        .value {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }

  .content {
    display: flex;
    width: 100%;
    height: 100%;

    .table {
      width: 100%;
      background: #fff;
      border-radius: 10px;
      padding: 15px;
    }

    .details {
      width: calc(25% - 7.5px);
      transition: all 0.3s;
      margin-left: 10px;
      background: #000;
      color: #fff;
      border-radius: 10px;
      margin-left: 15px;

    }
  }


  .content1 {
    display: flex;
    width: 100%;
    height: 100%;

    .table1 {
      width: calc(80% - 7.5px);
      height: 100%;
      background: #fff;
      border-radius: 10px;
      padding: 15px;
    }

    .details1 {
      width: calc(20% - 7.5px);
      height: 100%;
      transition: all 0.3s;
      margin-left: 10px;
      background: #fff;
      color: #000;
      border-radius: 10px;
      margin-left: 15px;

    }
  }

  .details_box {
    padding: 20px;
    color: #000;
  }

  .details_title {
    font-weight: 500;
    font-size: 16px;
    margin-top: 10px;
  }

  .details_info {
    margin: 10px;
    color: #666;
  }

  .details_test {
    color: #5492FF;
    cursor: pointer;
  }

  // 状态颜色样式
  ::v-deep .status-completed {
    color: #67C23A; // 绿色
    font-weight: bold;
  }

  ::v-deep .status-pending {
    color: #E6A23C; // 橘色
    font-weight: bold;
  }

}
</style>