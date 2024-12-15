/**
 * Notes: 服务者预约模块业务
 * Date: 2023-01-15 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.8 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectWorkService = require('./base_project_work_service.js');
const AdminMeetService = require('../admin/admin_meet_service.js')
const MeetModel = require('../../model/meet_model.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const util = require('../../../../framework/utils/util.js');

class WorkMeetService extends BaseProjectWorkService {

  convertStatus(meet) {
    const now = timeUtil.time();
    if (now > meet.MEET_START_TIME && now < meet.MEET_END_TIME && meet.MEET_STATUS === 0) {
      meet.MEET_STATUS = 1;
    } else if (now > meet.MEET_END_TIME && meet.MEET_STATUS === 0) {
      meet.MEET_STATUS = 2;
    }
  };

  /**添加 */
  async insertMeet(openID, meet) {
    let teacher = await this.isWork(openID);

    console.log('Current login teacher info:', teacher);
    // let meet = {};
    meet.meetTeacherID = teacher._id;
    // meet.MEET_TITLE = meetTitle;
    // meet.MEET_CATE_ID = meetCateID;
    // meet.MEET_SUBJECT_TYPE = meetSubjectType;
    // meet.MEET_DRIVING_LICENSE_TYPE = meetDrivingLicenseType;
    // meet.MEET_DESC = meetDesc;
    // meet.MEET_USING_CAR_ID = meetUsingCarID;
    // meet.MEET_START_TIME = meetStartTime;
    // meet.MEET_END_TIME = meetEndTime;
    // meet.MEET_LOCATION = meetLocation;
    // meet.MEET_RESERVE_STUDENT_CNT = meetReserveStudentCnt;
    // meet.MEET_CANCEL_SET = meetCancelSet;
    // meet.MEET_CAN_RESERVE_STUDENT_TYPE = meetCanReserveStudentType;
    meet.meetStatus = 0;
    console.log('Meet about to insert: ', meet);
    let service = new AdminMeetService();
    return await service.insertMeet(meet);
  }

  async cancelMeet(params, openID) {
    let teacher = await this.isWork(openID);
    console.log("Current operating teacher:", teacher);
    // console.log('Current login teacher info:', teacher);
    // const whereMeet = {
    //   _id: meet._id,
    //   MEET_TEACHER_ID: teacher._id,
    // }
    // const editData = {
    //   MEET_STATUS: 3,
    // }
    // return await MeetModel.edit(whereMeet, editData);
    let service = new AdminMeetService();
    return await service.cancelMeet(params, 'teacher');
  }

  async editMeet(meet, openID) {
    let teacher = await this.isWork(openID);
    console.log('Current login teacher info:', teacher);
    const whereMeet = {
      _id: meet._id,
      MEET_TEACHER_ID: teacher._id,
    }
    const editData = {
      MEET_TITLE: meet.meetTitle,
      MEET_DESC: meet.meetDesc,
      MEET_LOCATION: meet.meetLocation,
      MEET_CANCEL_SET: meet.meetCancelSet,
      MEET_CAN_RESERVE_STUDENT_TYPE: meet.meetCanReserveStudentType,
    }
    return await MeetModel.edit(whereMeet, editData);
  }

  async getMeetList(input, openID) {
    let teacher = await this.isWork(openID);
    console.log('Current login teacher info:', teacher);
    let service = new AdminMeetService();
    return await service.getMeetList(input, teacher._id);
  //  const orderBy = {
  //     'MEET_EDIT_TIME': 'desc'
  //   };
  //   let fields = '*';
  //   const now = timeUtil.time();
  //   let where = {};
  //   if (util.isDefined(search) && search) {
  //     const startEndTimeStrArr = dataUtil.splitTextByKey(search, '#');
  //     console.log('startEndTimeStrArr:', startEndTimeStrArr);
  //     const startTimestamp = timeUtil.time2Timestamp(startEndTimeStrArr[0]);
  //     const endTimestamp = timeUtil.time2Timestamp(startEndTimeStrArr[2]);
  //     where.MEET_START_TIME = ['between', startTimestamp, endTimestamp]
  //   }
  //   if (sortType && util.isDefined(sortVal)) {
  //     // 搜索菜单
  //     switch (sortType) {
  //       case 'status':
  //         // 按类型
  //         if (Number(sortVal) === 1) {
  //           where.MEET_STATUS = 0;
  //           where.MEET_START_TIME = ['<=', now];
  //           where.MEET_END_TIME = ['>=', now];
  //         } else if (Number(sortVal) === 2) {
  //           where.MEET_STATUS = 0;
  //           where.MEET_END_TIME = ['<', now];
  //         } else if (Number(sortVal) === 0) {
  //           where.MEET_STATUS = 0;
  //           where.MEET_START_TIME = ['>', now];
  //         } else {
  //           where.MEET_STATUS = Number(sortVal);
  //         }
  //         break;
  //     }
  //   }
  //   console.log("get list where:", where);
  //   const res = await MeetModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
  //   console.log("get list res:", res);
  //   res.list?.forEach((item) => {
  //     this.convertStatus(item);
  //   });
  //   return res;
 
  }

  async getMeetDetail({
    _id
  }, openID) {
    let fields = '*';
    let teacher = await this.isWork(openID);
    console.log('Current login teacher info:', teacher);
    let where = {
      _id,
      MEET_TEACHER_ID: teacher._id,
    }
    let meet = await MeetModel.getOne(where, fields);
    if (!meet) return null;
    this.convertStatus(meet);
    return meet;
  }

}

module.exports = WorkMeetService;