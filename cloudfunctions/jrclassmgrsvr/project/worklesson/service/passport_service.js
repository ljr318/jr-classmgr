/**
 * Notes: passport模块业务逻辑, 登录相关
 * Date: 2020-10-14 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectService = require('./base_project_service.js');
const cloudBase = require('../../../framework/cloud/cloud_base.js');
const StudentModel = require('../model/student_model.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const LessonLogModel = require('../model/lesson_log_model.js');
const MeetService = require('../service/meet_service.js');
const shortUUID = require('short-uuid');

class PassportService extends BaseProjectService {

  // 注册
  async register(userId, {
    phoneNumber,
    name,
    avatarUrl
  }) {
    // 判断是否存在
    let where = {
      OPENID: userId,
    }
    console.log('register openid:', userId);
    console.log('register where:', where);
    let cnt = await StudentModel.count(where);
    console.log('register select cnt:', cnt);
    if (cnt > 0)
      return await this.login(userId);

    // 看下是不是已经提前预注册好了
    where = {
      PHONE_NUMBER: phoneNumber
    }
    cnt = await StudentModel.count(where);

    if (cnt === 0) {
      // 没提前注册好则新插入一条数据
      let data = {
        STUDENT_ID: shortUUID.generate(),
        STUDENT_TYPE: StudentModel.STUDENT_TYPE.OUTER_STUDENT,
        OPENID: userId,
        PHONE_NUMBER: phoneNumber,
        STUDENT_NAME: name,
        AVATAR: avatarUrl,
        STATUS: StudentModel.STATUS.AT_SCHOOL,
        CREATE_TIME: this._timestamp,
        REG_TIME: this._timestamp,
        BOOKING_LIST: []
      }
      await StudentModel.insert(data);
      return await this.login(userId);
    }


    // 如果已经在库里的则直接更新一下openid和注册时间
    // 入库
    const editWhere = {
      PHONE_NUMBER: phoneNumber,
    };
    let data = {
      REG_TIME: this._timestamp,
      AVATAR: avatarUrl,
      STUDENT_NAME:name,
      OPENID: userId
    }
    await StudentModel.edit(editWhere, data);
    return await this.login(userId);
  }

  /** 获取手机号码 */
  async getPhone(cloudID) {
    let cloud = cloudBase.getCloud();
    let res = await cloud.getOpenData({
      list: [cloudID], // 假设 event.openData.list 是一个 CloudID 字符串列表
    });
    if (res && res.list && res.list[0] && res.list[0].data) {

      let phone = res.list[0].data.phoneNumber;

      return phone;
    } else
      return '';
  }

  /** 取得我的用户信息 */
  async getMyDetail(userId) {
    let where = {
      OPENID: userId,
    }
    let fields = 'STUDENT_ID,OPENID,STUDENT_NAME,AVATAR,STATUS'
    return await StudentModel.getOne(where);
  }

  /** 修改用户资料 */
  async editBase(userId, {
    mobile,
    name,
    avatarUrl
  }) {
    let user = await StudentModel.getOne({
      OPENID: userId
    });
    console.log('Got user:', user, 'user_id:', userId);
    if (!user) return;

    // if (!userCheck) {
    // 不校验
    let whereMobile = {
      PHONE_NUMBER: mobile,
      OPENID: ['<>', userId]
    }
    let cnt = await StudentModel.count(whereMobile);
    if (cnt > 0) this.AppError('该手机已注册，请更换');

    let data = {
      PHONE_NUMBER: mobile,
      STUDENT_NAME: name,
      AVATAR: avatarUrl,
    };
    console.log(data);
    return await StudentModel.edit({
      OPENID: userId
    }, data);
    // }

    // if (user.USER_MOBILE != mobile || user.USER_NAME != name) { // 手机号码+姓名 出现变更 

    //   // 是否在校验库里
    //   let where = {
    //     USER_TYPE: 0,
    //     USER_NAME: name,
    //     USER_MOBILE: mobile
    //   }
    //   let cnt = await StudentModel.count(where);
    //   if (cnt == 0)
    //     this.AppError('该“姓名与手机”未登记为学员，请修改或者联系管理员~');

    //   // 退出老数据
    //   let data = {
    //     USER_TYPE: 0,
    //     USER_MINI_OPENID: user.USER_MOBILE
    //   };
    //   await StudentModel.edit({
    //       USER_MINI_OPENID: userId,
    //       USER_TYPE: 1
    //     },
    //     data);

    //   // 赋予新数据
    //   data = {
    //     USER_TYPE: 1,
    //     USER_MINI_OPENID: userId,
    //     USER_OBJ: dataUtil.dbForms2Obj(forms),
    //     USER_FORMS: forms,
    //   };
    //   await StudentModel.edit({
    //       USER_MINI_OPENID: mobile,
    //       USER_TYPE: 0
    //     },
    //     data);

    //   // 退出旧课时记录
    //   await LessonLogModel.edit({
    //     LESSON_LOG_USER_ID: userId
    //   }, {
    //     LESSON_LOG_USER_ID: user.USER_MOBILE
    //   });

    //   // 赋予新课时记录
    //   await LessonLogModel.edit({
    //     LESSON_LOG_USER_ID: mobile
    //   }, {
    //     LESSON_LOG_USER_ID: userId
    //   });
    // } else {
    //   // 手机号码+姓名未出现变更
    //   let data = {
    //     USER_OBJ: dataUtil.dbForms2Obj(forms),
    //     USER_FORMS: forms,
    //   };


    //   await StudentModel.edit({
    //       USER_MINI_OPENID: userId,
    //       USER_TYPE: 1
    //     },
    //     data);
    // }
  }

  /** 登录 */
  async login(userId) {
    console.log('login openid:', userId);
    let where = {
      OPENID: userId
    };
    console.log('login where condition: ', where);
    let fields = 'STUDENT_ID,OPENID,STUDENT_NAME,AVATAR,STATUS';
    let user = await StudentModel.getOne(where, fields);
    let token = {};
    if (user) {
      // 正常用户
      token.id = user.STUDENT_ID;
      token.openid = user.OPENID;
      token.name = user.STUDENT_NAME;
      token.avatarUrl = user.AVATAR;
      token.status = user.STATUS;
      console.log('login token:', token);
      // 异步更新最近更新时间
      let dataUpdate = {
        LAST_LOGIN_TIME: this._timestamp
      };
      StudentModel.edit(where, dataUpdate);
      // StudentModel.inc(where, 'USER_LOGIN_CNT', 1);

    } else
      token = null;

    return {
      token
    };
  }



}

module.exports = PassportService;