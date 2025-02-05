/**
 * Notes: 预约后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-12-08 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const MeetService = require('../meet_service.js');
const CarService = require('../car_service');
const AdminHomeService = require('../admin/admin_home_service.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const setupUtil = require('../../../../framework/utils/setup/setup_util.js');
const util = require('../../../../framework/utils/util.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');
const cloudBase = require('../../../../framework/cloud/cloud_base.js');
const md5Lib = require('../../../../framework/lib/md5_lib.js');


const MeetModel = require('../../model/meet_model.js');
const JoinModel = require('../../model/join_model.js');
const TeacherModel = require('../../model/teacher_model.js');
const LessonLogModel = require('../../model/lesson_log_model.js');
const DayModel = require('../../model/day_model.js');
const TempModel = require('../../model/temp_model.js');

const exportUtil = require('../../../../framework/utils/export_util.js');
const dbUtil = require('../../../../framework/database/db_util.js');
const StudentModel = require('../../model/student_model.js');


// 导出报名数据KEY
const EXPORT_JOIN_DATA_KEY = 'EXPORT_JOIN_DATA';

class AdminMeetService extends BaseProjectAdminService {

  /** 推荐首页SETUP */
  async vouchMeetSetup(id, vouch) {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }

  convertStatus(meet) {
    const now = timeUtil.time();
    if (now > meet.MEET_START_TIME && now < meet.MEET_END_TIME && meet.MEET_STATUS === 0) {
      meet.MEET_STATUS = 1;
    } else if (now > meet.MEET_END_TIME && meet.MEET_STATUS === 0) {
      meet.MEET_STATUS = 2;
    }
  };

  convertJoinStatus(join) {
    const now = timeUtil.time();
    if (now > join.JOIN_MEET_END_TIME && join.JOIN_STATUS === 1) {
      join.JOIN_STATUS = 4;
    }
  };

  /** 预约数据列表 */
  async getDayList(meetId, start, end) {
    let where = {
      DAY_MEET_ID: meetId,
      day: ['between', start, end]
    }
    let orderBy = {
      day: 'asc'
    }
    return await DayModel.getAllBig(where, 'day,times,dayDesc', orderBy);
  }

  // 按项目统计人数
  async statJoinCntByMeet(meetId) {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }


  /** 管理员按钮核销 */
  async checkinJoin(joinId, flag) {
    let where = {
      _id: joinId,
    }
    const res = await JoinModel.getOne(where);
    if (!res) {
      this.AppError("该预约不存在！");
    } else if (res.JOIN_STATUS != 1 && flag == 1) {
      this.AppError("当前预约状态不支持核销！");
    } else if (res.JOIN_STATUS != 2 && flag == 0) {
      this.AppError("当前预约状态不支持撤销核销！");
    }
    // else if (flag == 1 && res.JOIN_MEET_START_TIME - 600000 > now) {
    //   this.AppError("当前时间段不允许核销！");
    // }
    let editData = {};
    if (flag == 1) {
      editData = {
        JOIN_STATUS: 2,
        JOIN_IS_CHECKIN: 1,
        JOIN_CHECKIN_TIME: timeUtil.time(),
      }
    } else if (flag == 0) {
      editData = {
        JOIN_STATUS: 1,
        JOIN_IS_CHECKIN: 0,
      }
    }
    console.log('check in join where:', where);
    await JoinModel.edit(where, editData);

    try {
      await StudentModel.inc({
        _id: res.JOIN_USER_ID
      }, 'CHECKED_IN_TIMES', flag == 1 ? 1 : -1);
    } catch (ex) {
      console.log(ex);
    }
  }

  /** 管理员扫码核销 */
  async scanJoin(code) {
    let where = {
      _id: code
    }
    const now = timeUtil.time();
    const res = await JoinModel.getOne(where);
    console.log('res:', res);
    if (!res) {
      this.AppError("该预约不存在！");
    } else if (res.JOIN_STATUS != 1) {
      this.AppError("当前预约状态不支持核销！");
    } else if (res.JOIN_MEET_START_TIME - 600000 > now || now > res.JOIN_MEET_END_TIME + 600000) {
      this.AppError("当前时间段不允许核销！");
    }
    let editData = {
      JOIN_STATUS: 2,
      JOIN_IS_CHECKIN: 1,
      JOIN_CHECKIN_TIME: timeUtil.time(),
    }
    console.log('check in join where:', where);
    await JoinModel.edit(where, editData);
    try {
      await StudentModel.inc({
        _id: res.JOIN_USER_ID
      }, 'CHECKED_IN_TIMES', 1);
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
   * 判断本日是否有预约记录
   * @param {*} daySet daysSet的节点
   */
  checkHasJoinCnt(times) {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }

  // 判断含有预约的日期
  getCanModifyDaysSet(daysSet) {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }

  // 更新forms信息
  async updateMeetForms({
    id,
    hasImageForms
  }) {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }

  async getMeetList({
    search, // 搜索条件
    sortType, // 搜索菜单
    sortVal, // 搜索菜单
    page,
    size,
    isTotal = true,
    oldTotal
  }, teacherID = undefined) {
    const orderBy = {
      'MEET_EDIT_TIME': 'desc'
    };
    let fields = '*';
    const now = timeUtil.time();
    let where = {};
    if (util.isDefined(search) && search) {
      const startEndTimeStrArr = dataUtil.splitTextByKey(search, '#');
      console.log('startEndTimeStrArr:', startEndTimeStrArr);
      const startTimestamp = timeUtil.time2Timestamp(startEndTimeStrArr[0]);
      const endTimestamp = timeUtil.time2Timestamp(startEndTimeStrArr[2]);
      where.MEET_START_TIME = ['between', startTimestamp, endTimestamp]
    }
    if (sortType && util.isDefined(sortVal)) {
      // 搜索菜单
      switch (sortType) {
        case 'status':
          // 按类型
          if (Number(sortVal) === 1) {
            where.MEET_STATUS = 0;
            where.MEET_START_TIME = ['<=', now];
            where.MEET_END_TIME = ['>=', now];
          } else if (Number(sortVal) === 2) {
            where.MEET_STATUS = 0;
            where.MEET_END_TIME = ['<', now];
          } else if (Number(sortVal) === 0) {
            where.MEET_STATUS = 0;
            where.MEET_START_TIME = ['>', now];
          } else {
            where.MEET_STATUS = Number(sortVal);
          }
          break;
      }
    }
    if (teacherID) {
      where.MEET_TEACHER_ID = teacherID;
    }
    console.log("get list where:", where);
    let res = {};
    if (teacherID) {
      res = await MeetModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
    } else {
      const joinParams = {
        from: 'bx_teacher',
        localField: 'MEET_TEACHER_ID',
        foreignField: '_id',
        as: 'teacherInfo',
      };
      res = await MeetModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
    }
    console.log("get list res:", res);
    res.list?.forEach((item) => {
      this.convertStatus(item);
      if (item.teacherInfo) {
        const teacherName = item.teacherInfo.TEACHER_NAME;
        const tel = item.teacherInfo.PHONE_NUMBER;
        item.teacherInfo = {
          TEACHER_NAME: teacherName,
          PHONE_NUMBER: tel,
        };
      }
    });
    return res;
  }

  // 取消
  async cancelMeet(params, lockOwner = 'system') {
    console.log('Cancel meet params:', params);
    // 先锁住当前的meetID
    const meetLockKey = `join_meet_${params._id}`;
    let lockRet = await dbUtil.lock(meetLockKey, 60000, lockOwner);
    if (lockRet !== 0) {
      console.log('cacelMeet lock ret:', lockRet);
      this.AppError('系统繁忙，请稍后再试！');
    }
    // 获取下课程详情 检查下请求合法性
    const meetInfo = await MeetModel.getOne({
      _id: params._id
    }, "*");
    console.log('meet info:', meetInfo);
    if (meetInfo === null) {
      await dbUtil.unlock(meetLockKey, lockOwner);
      this.AppError('课程不存在！');
    }
    const now = timeUtil.time();
    if (meetInfo.MEET_STATUS !== 0 || meetInfo.MEET_START_TIME - 600000 <= now) {
      await dbUtil.unlock(meetLockKey, lockOwner);
      this.AppError('当前课程状态不支持取消！');
    }
    // 更新课程状态为取消
    let editWhere = {
      _id: params._id,
    }
    let editData = {
      MEET_STATUS: 3,
      MEET_CANCEL_REASON: params.cancelReason,
    }
    console.log('edit meet where data:', editWhere, editData);
    await MeetModel.edit(editWhere, editData);

    // 接着更新全部的预约状态为取消
    // let editJoinWhere = {
    //   JOIN_MEET_ID: params._id,
    // };
    // let editJoinData = {
    //   JOIN_STATUS: 3,
    //   JOIN_CANCEL_TYPE: 1,
    //   JOIN_CANCEL_REASON: params.cancelReason,
    // };
    // console.log('edit join where data:', editJoinWhere, editJoinData);
    // await JoinModel.edit(editJoinWhere, editJoinData);

    const res = await JoinModel.getList({
      JOIN_MEET_ID: params._id
    }, "*", {
      'JOIN_ADD_TIME': 'desc'
    }, 1, 1000, true, 0);
    console.log("got join user list:", res);
    if (res !== null) {
      for (let item of res.list) {
        console.log('res item:', item);
        if (item.JOIN_STATUS != 1) continue;
        let editJoinWhere = {
          _id: item._id,
        };
        let editJoinData = {
          JOIN_STATUS: 3,
          JOIN_CANCEL_TYPE: 1,
          JOIN_CANCEL_REASON: params.cancelReason,
        };
        console.log('edit join where data:', editJoinWhere, editJoinData);
        await JoinModel.edit(editJoinWhere, editJoinData);
        // 如果是模拟课程 需要返还学员的可预约次数
        if (meetInfo.MEET_CATE_ID === 0) {
          await StudentModel.inc({
            _id: item.JOIN_USER_ID
          }, "MEMBERSHIP_USAGE_TIMES");
          await StudentModel.inc({
            _id: item.JOIN_USER_ID
          }, "MEMBERSHIP_USED_TIMES", -1);
        }
      }
    }

    return await dbUtil.unlock(meetLockKey, lockOwner);
  }

  /**添加 */
  async insertMeet({
    meetTeacherID,
    meetTitle,
    meetCateID,
    meetSubjectType,
    meetDrivingLicenseType,
    meetDesc,
    meetUsingCarID,
    meetStartTime,
    meetEndTime,
    meetLocation,
    meetReserveStudentCnt,
    meetCancelSet,
    meetCanReserveStudentType,
    meetStatus,
  }) {
    const now = timeUtil.time();
    if (now + 1200000 >= meetStartTime) {
      this.AppError('课程需在开始前至少20分钟发布！');
    }
    // 先给carid加个锁
    const lockRes = await dbUtil.lock(`CARID_LOCK_${meetUsingCarID}`, 60000, meetTeacherID);
    console.log('lockRes', lockRes);
    if (lockRes !== 0) {
      await dbUtil.unlock(`CARID_LOCK_${meetUsingCarID}`, meetTeacherID);
      this.AppError('车辆已被占用请重试');
    }
    // 检查下车辆有没有被占用
    const occupiedTimeSpan = {
      startTime: meetStartTime,
      endTime: meetEndTime
    };
    const tmpCarService = new CarService();
    const checkOccupiedRes = await tmpCarService.checkIfCarOccupied(meetUsingCarID, occupiedTimeSpan);
    console.log('checkOccupiedRes', checkOccupiedRes);
    if (checkOccupiedRes === 1) {
      await dbUtil.unlock(`CARID_LOCK_${meetUsingCarID}`, meetTeacherID);
      this.AppError('车辆已被占用请重试');
    }
    // 检查下同一时段当前教练有没有其他课程
    const tmpFields = "_id";
    const where = {
      and: [{
          MEET_TEACHER_ID: meetTeacherID
        },
        {
          MEET_STATUS: 0,
        },
      ],
      or: [{
          MEET_START_TIME: [
            ['>=', occupiedTimeSpan.startTime],
            ['<', occupiedTimeSpan.endTime]
          ]
        },
        {
          MEET_END_TIME: [
            ['>', occupiedTimeSpan.startTime],
            ['<=', occupiedTimeSpan.endTime]
          ]
        }
      ]
    };
    const res = await MeetModel.getOne(where, tmpFields);
    console.log("res:", res);
    if (res !== null) {
      await dbUtil.unlock(`CARID_LOCK_${meetUsingCarID}`, meetTeacherID);
      this.AppError('您在同一时段已发布过课程');
    }
    let meet = {};
    meet.MEET_TEACHER_ID = meetTeacherID;
    meet.MEET_TITLE = meetTitle;
    meet.MEET_CATE_ID = meetCateID;
    meet.MEET_SUBJECT_TYPE = meetSubjectType;
    meet.MEET_DRIVING_LICENSE_TYPE = meetDrivingLicenseType;
    meet.MEET_DESC = meetDesc;
    meet.MEET_USING_CAR_ID = meetUsingCarID;
    meet.MEET_START_TIME = meetStartTime;
    meet.MEET_END_TIME = meetEndTime;
    meet.MEET_LOCATION = meetLocation;
    meet.MEET_RESERVE_STUDENT_CNT = meetReserveStudentCnt;
    meet.MEET_RESERVED_STUDENT_CNT = 0;
    meet.MEET_CANCEL_SET = meetCancelSet;
    meet.MEET_CAN_RESERVE_STUDENT_TYPE = meetCanReserveStudentType;
    meet.MEET_STATUS = meetStatus;
    meet.MEET_ADD_TIME = timeUtil.time();
    meet.MEET_EDIT_TIME = timeUtil.time();
    console.log('Meet about to insert: ', meet);
    const insertRes = await MeetModel.insert(meet);
    await dbUtil.unlock(`CARID_LOCK_${meetUsingCarID}`, meetTeacherID);
    return insertRes;
  }


  /**排期设置 */
  async setDays(id, {
    daysSet,
  }) {

    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');

  }


  /**删除数据 */
  async delMeet(id) {
    let where = {
      _id: id
    }

    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }

  /**获取信息 */
  async getMeetDetail(id) {
    let fields = '*';

    let where = {
      _id: id
    }
    let meet = await MeetModel.getOne(where, fields);
    if (!meet) return null;

    let meetService = new MeetService();
    meet.MEET_DAYS_SET = await meetService.getDaysSet(id, timeUtil.time('Y-M-D')); //今天及以后

    return meet;
  }


  /** 更新日期设置 */
  async _editDays(meetId, nowDay, daysSetData) {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }

  /**更新数据 */
  async editMeet(meet) {
    const whereMeet = {
      _id: meet._id
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

  /**预约名单分页列表 */
  async getJoinList({
    search, // 搜索条件
    sortType, // 搜索菜单
    sortVal, // 搜索菜单
    orderBy, // 排序
    meetId,
    page,
    size,
    isTotal = true,
    oldTotal
  }) {

    orderBy = orderBy || {
      'JOIN_ADD_TIME': 'desc'
    };
    let fields = '*';
    console.log('inner get join list meetid:', meetId);
    let where = {};
    where.and = {
      JOIN_MEET_ID: meetId,
      // JOIN_MEET_TIME_MARK: mark
    }
    if (util.isDefined(search) && search) {
      where.or = [{
          'studentInfo.STUDENT_NAME': ['like', search]
        },
        {
          'studentInfo.PHONE_NUMBER': ['like', search]
        }
      ];
    } else if (sortType && util.isDefined(sortVal)) {
      // 搜索菜单
      switch (sortType) {
        case 'status':
          // 按类型
          sortVal = Number(sortVal);
          if (sortVal == 1) //取消的2种
            // where.JOIN_STATUS = ['in', [10, 99]]
            where.and.JOIN_STATUS = 1;
          else if (sortVal == 2)
            where.and.JOIN_STATUS = 2;
          else if (sortVal == 3)
            where.and.JOIN_STATUS = 3;
          else if (sortVal == 4) {
            where.and.JOIN_STATUS = 1;
            // where.JOIN_IS_CHECKIN = 0;
            where.and.JOIN_MEET_END_TIME = ['<', timeUtil.time()];
          }
          break;
        case 'checkin':
          // 核销
          where.JOIN_STATUS = JoinModel.STATUS.SUCC;
          if (sortVal == 1) {
            where.and.JOIN_IS_CHECKIN = 1;
          } else {
            where.and.JOIN_IS_CHECKIN = 0;
          }
          break;
      }
    }
    const joinParams = {
      from: 'bx_student',
      localField: 'JOIN_USER_ID',
      foreignField: '_id',
      as: 'studentInfo',
    };
    console.log("get join list where:", where);
    const res = await JoinModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
    res.list.forEach((item) => {
      item.studentInfo.OPENID = undefined;
      this.convertJoinStatus(item);
    });
    return res;
  }

  async getUserJoinList({
    search, // 搜索条件
    sortType, // 搜索菜单
    sortVal, // 搜索菜单
    orderBy, // 排序
    userId,
    page,
    size,
    isTotal = true,
    oldTotal
  }) {

    orderBy = orderBy || {
      'JOIN_ADD_TIME': 'desc'
    };
    let fields = '*';
    console.log('inner get join list userid:', userId);
    let where = {};
    where.and = {
      JOIN_USER_ID: userId,
      // JOIN_MEET_TIME_MARK: mark
    }
    if (util.isDefined(search) && search) {
      where.or = [{
          'meetInfo.MEET_TITLE': ['like', search]
        },
        {
          'meetInfo.MEET_DESC': ['like', search]
        }
      ];
    } else if (sortType && util.isDefined(sortVal)) {
      // 搜索菜单
      switch (sortType) {
        case 'status':
          // 按类型
          sortVal = Number(sortVal);
          if (sortVal == 1) //取消的2种
            // where.JOIN_STATUS = ['in', [10, 99]]
            where.and.JOIN_STATUS = 1;
          else if (sortVal == 2)
            where.and.JOIN_STATUS = 2;
          else if (sortVal == 3)
            where.and.JOIN_STATUS = 3;
          else if (sortVal == 4) {
            where.and.JOIN_STATUS = 1;
            // where.JOIN_IS_CHECKIN = 0;
            where.and.JOIN_MEET_END_TIME = ['<', timeUtil.time()];
          }
          break;
        case 'checkin':
          // 核销
          where.JOIN_STATUS = JoinModel.STATUS.SUCC;
      }
    }
    const joinParams = {
      from: 'bx_meet',
      localField: 'JOIN_MEET_ID',
      foreignField: '_id',
      as: 'meetInfo',
    };
    console.log("get join list where:", where);
    const res = await JoinModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
    for (let item of res.list) {
      this.convertJoinStatus(item);
      if (item.meetInfo.MEET_START_TIME) {
        item.meetInfo.MEET_START_TIME_STR = timeUtil.timestamp2Time(item.meetInfo.MEET_START_TIME);
      }
      if (item.meetInfo.MEET_END_TIME) {
        item.meetInfo.MEET_END_TIME_STR = timeUtil.timestamp2Time(item.meetInfo.MEET_END_TIME);
      }
      const teacher = await TeacherModel.getOne({
        _id: item.JOIN_MEET_TEACHER_ID
      }, "TEACHER_NAME,PHONE_NUMBER");
      item.teacherName = teacher.TEACHER_NAME;
      item.teacherPhoneNumber = teacher.PHONE_NUMBER;
    }
    // res.list.forEach((item) => {
    //   // item.studentInfo.OPENID = undefined;
    //   this.convertJoinStatus(item);
    //   if (item.meetInfo.MEET_START_TIME) {
    //     item.meetInfo.MEET_START_TIME_STR = timeUtil.timestamp2Time(item.meetInfo.MEET_START_TIME);
    //   }
    //   if (item.meetInfo.MEET_END_TIME) {
    //     item.meetInfo.MEET_END_TIME_STR = timeUtil.timestamp2Time(item.meetInfo.MEET_END_TIME);
    //   }
    // });

    return res;

  }

  /**预约项目分页列表 */
  async getAdminMeetList(input) {
    return await this.getMeetList(input);
    // orderBy = orderBy || {
    //   'MEET_ORDER': 'asc',
    //   'MEET_ADD_TIME': 'desc'
    // };
    // let fields = 'MEET_CATE_ID,MEET_CATE_NAME,MEET_TITLE,MEET_STATUS,MEET_DAYS,MEET_ADD_TIME,MEET_EDIT_TIME,MEET_ORDER,MEET_VOUCH,MEET_QR';

    // let where = {};
    // if (util.isDefined(search) && search) {
    //   where.MEET_TITLE = {
    //     $regex: '.*' + search,
    //     $options: 'i'
    //   };
    // } else if (sortType && util.isDefined(sortVal)) {
    //   // 搜索菜单
    //   switch (sortType) {
    //     case 'status':
    //       // 按类型
    //       where.MEET_STATUS = Number(sortVal);
    //       break;
    //     case 'cateId':
    //       // 按类型
    //       where.MEET_CATE_ID = sortVal;
    //       break;
    //     case 'sort':
    //       // 排序
    //       if (sortVal == 'view') {
    //         orderBy = {
    //           'MEET_VIEW_CNT': 'desc',
    //           'MEET_ADD_TIME': 'desc'
    //         };
    //       }

    //       break;
    //   }
    // }

    // return await MeetModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
  }

  /** 删除 */
  async delJoin(joinId) {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');

  }

  /**修改报名状态 
   * 特殊约定 99=>正常取消 
   */
  async statusJoin(joinId, status, reason = '') {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }

  /**修改项目状态 */
  async statusMeet(id, status) {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }

  /**置顶排序设定 */
  async sortMeet(id, sort) {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }

  /**首页设定 */
  async vouchMeet(id, vouch) {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }

  //##################模板
  /**添加模板 */
  async insertMeetTemp({
    name,
    times,
  }, meetId = 'admin') {

    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');

  }

  /**更新数据 */
  async editMeetTemp({
    id,
    limit,
    isLimit
  }, meetId = 'admin') {

    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }


  /**删除数据 */
  async delMeetTemp(id, meetId = 'admin') {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');

  }


  /**模板列表 */
  async getMeetTempList(meetId = 'admin') {
    let orderBy = {
      'TEMP_ADD_TIME': 'desc'
    };
    let fields = 'TEMP_NAME,TEMP_TIMES';

    let where = {
      TEMP_MEET_ID: meetId
    };
    return await TempModel.getAll(where, fields, orderBy);
  }

  // #####################导出报名数据
  /**获取报名数据 */
  async getJoinDataURL() {
    return await exportUtil.getExportDataURL(EXPORT_JOIN_DATA_KEY);
  }

  /**删除报名数据 */
  async deleteJoinDataExcel() {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }

  /**导出报名数据 */
  async exportJoinDataExcel({
    meetId,
    startDay,
    endDay,
    status
  }) {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');

  }

}

module.exports = AdminMeetService;