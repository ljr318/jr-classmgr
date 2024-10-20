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

  async getMeetList({
    search, // 搜索条件
    sortType, // 搜索菜单
    sortVal, // 搜索菜单
    page,
    size,
    isTotal = true,
    oldTotal
  }) {

    const orderBy = {
      'MEET_EDIT_TIME': 'desc'
    };
    let fields = '*';

    let where = {};
    if (util.isDefined(search) && search) {
      const startEndTimeStrArr = dataUtil.splitTextByKey(search, '#');
      console.log('startEndTimeStrArr:', startEndTimeStrArr);
      const startTimestamp = timeUtil.time2Timestamp(startEndTimeStrArr[0])/1000;
      const endTimestamp = timeUtil.time2Timestamp(startEndTimeStrArr[2])/1000;
      where.MEET_START_TIME = ['between', startTimestamp, endTimestamp]
    }
    if (sortType && util.isDefined(sortVal)) {
      // 搜索菜单
      switch (sortType) {
        case 'status':
          // 按类型
          where.MEET_STATUS = Number(sortVal);
          break;
      }
    }
    console.log("get list where:", where);
    return await MeetModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
  }

}

module.exports = WorkMeetService;