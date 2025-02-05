/**
 * Notes:预约后台管理模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('../../../comm/biz/base_biz.js');
const dataHelper = require('../../../helper/data_helper.js');
const timeHelper = require('../../../helper/time_helper.js');
const projectSetting = require('../public/project_setting.js');
const MeetBiz = require('../biz/meet_biz.js');
const formSetHelper = require('../../../cmpts/public/form/form_set_helper.js');


class AdminMeetBiz extends BaseBiz {


  static getCateName(cateId) {
    let cateList = projectSetting.MEET_CATE;

    for (let k = 0; k < cateList.length; k++) {
      if (cateList[k].id == cateId) return cateList[k].title;
    }
    return '';
  }

  // 计算剩余天数
  static getLeaveDay(days) {
    let now = timeHelper.time('Y-M-D');
    let count = 0;
    for (let k = 0; k < days.length; k++) {
      if (days[k].day >= now) count++;
    }
    return count;
  }

  // 格式化日期字段，
  static getNewTimeNode(day, timeTemp = null) {
    let node = dataHelper.deepClone(timeTemp || projectSetting.MEET_NEW_NODE);
    day = day.replace(/-/g, '');
    node.mark = 'T' + day + 'AAA' + dataHelper.genRandomAlpha(10).toUpperCase();
    return node;
  }


  /** 表单初始化相关数据 */
  static async initFormData() {
    let cateIdOptions = MeetBiz.getCateList();
    return {

      // 选项数据  
      cateIdOptions,

      fields: projectSetting.MEET_FIELDS,


      // 表单数据  
      formTitle: '',
      formCateId: (cateIdOptions.length == 1) ? cateIdOptions[0].val : '',
      formOrder: 9999,
      formCancelSet: 1,

      formForms: [],

      formDaysSet: [], // 时间设置  

      formPhone: '',
      formPassword: '',


      formJoinForms: formSetHelper.initFields(projectSetting.MEET_JOIN_FIELDS)
    }

  }


  static getDaysTimeOptions() {
    let HourArr = [];
    let clockArr = [];
    let k = 0;

    for (k = 0; k <= 23; k++) {
      let node = {};
      node.label = k + '点';
      node.val = k < 10 ? '0' + k : k;
      HourArr.push(node);
    }

    for (k = 0; k < 59;) {
      let node = {};
      node.label = k + '分';
      node.val = k < 10 ? '0' + k : k;
      clockArr.push(node);
      k += 5;

      if (k == 60) {
        node = {};
        node.label = '59分';
        node.val = '59';
        clockArr.push(node);
      }
    }

    return [HourArr, clockArr];
  }

}


/** 表单校验  */
AdminMeetBiz.CHECK_FORM = {
  // meetTitle: 'meetTitle|must|string|min:2|max:50|name=课程标题',
  meetCateID: 'meetCateID|must|int|name=课程类型',
  meetSubjectType: 'meetSubjectType|must|int|name=科目类型',
  meetDrivingLicenseType: 'meetDrivingLicenseType|must|string|name=驾照等级',
  // meetDesc: 'meetDesc|must|string|min:6|max:30|name=课程详情',
  meetUsingCarID: 'meetUsingCarID|string|min:6|max:30|name=课程使用的车辆ID',
  meetStartTime: 'meetStartTime|must|int|name=课程开始时间',
  meetEndTime: 'meetEndTime|must|int|name=课程结束时间',
  // meetLocation: 'meetLocation|must|string|name=课程地点',
  meetReserveStudentCnt: 'meetReserveStudentCnt|must|int|name=课程可预约人数',
  meetCancelSet: 'meetCancelSet|must|int|name=可取消时间',
  meetCanReserveStudentType: 'meetCanReserveStudentType|must|int|name=可预约学员类型',
};

AdminMeetBiz.EDIT_CHECK_FORM = {
  _id: 'id|must|string',
  // meetTitle: 'meetTitle|must|string|min:2|max:50|name=课程标题',
  // meetDesc: 'meetDesc|must|string|min:6|max:30|name=课程详情',
  // meetLocation: 'meetLocation|must|string|name=课程地点',
  meetCancelSet: 'meetCancelSet|must|int|name=可取消时间',
  meetCanReserveStudentType: 'meetCanReserveStudentType|must|int|name=可预约学员类型',
};


module.exports = AdminMeetBiz;