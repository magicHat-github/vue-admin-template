<template>
  <div class="sidebar-avator-container" :class="{'collapse':collapse}">
    <div class="avatar">
      <div class="avatar-wrapper">
        <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
      </div>
      <div class="user-info">
        <span class="name">管理员</span>
        <div class="status"><div class="dot" /><span class="value">在线</span></div>
      </div>
    </div>
    <div class="search">
      <el-input v-model="keyword" size="small" placeholder="搜索">
        <i slot="suffix" class="el-input__icon el-icon-search" />
      </el-input>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'UserInfo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ])
  }
}
</script>

<style lang="scss" scoped>
.sidebar-avator-container {
  position: relative;
  width: 100%;
  height: 130px;
  line-height: 20px;
  background: #304156;
  padding-top: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

    .avatar {
      display: flex;
      flex-direction: row;
      flex-grow: 1;

      .avatar-wrapper {
        height: 80px;

        .user-avatar {
          cursor: pointer;
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }

      .user-info {
        flex-grow: 1;
        margin-left: 20px;
        height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .name {
          font-size: 14px;
          color: azure;
        }

        .status {
          font-size: 8px;
          color: aqua;
          display: flex;
          flex-direction: row;
          align-items: center;

          .dot {
            width: 8px;
            height: 8px;
            border: 1px solid aqua;
            border-radius: 100px;
            background-color: aqua;
          }

          .value {
            margin-left: 5px;
            flex-grow: 1;
          }
        }
      }
    }

    .search {
      width: 100%;
      padding: 5px;
    }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
