/**
 * Notes: 教练实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wx)
 * Date: 2022-01-17 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class TeacherModel extends BaseProjectModel {}

// 集合名ƒ
TeacherModel.CL = BaseProjectModel.C('teacher');

TeacherModel.DB_STRUCTURE = {
  _id: 'string|true|comment=教练员ID',
  TEACHER_NAME: 'string|true',
  PHONE_NUMBER: 'string|true|comment=添加的管理员',
  AVATAR: 'string|true|default=|comment=头像cdn链接',
  STATUS: 'int|true|default=1|comment=状态 1=在岗,2离岗',
  PUBLISHED_LESSONS: 'array|true|default=[]|comment=发布的所有课程',
  LOGIN_PASSWORD: 'string|true|comment=登陆密码',
  LAST_LOGIN_OPENID: 'string|true|comment=上一次登入用户的微信openid',
  TEACHER_LOGIN_TIME: 'int|false|comment=最近登录时间',
  TEACHER_TOKEN: 'string|false|comment=当前登录token',
  TEACHER_TOKEN_TIME: 'int|true|default=0|comment=当前登录token time',

  // MEET_DAYS: 'array|true|default=[]|comment=最近一次修改保存的可用日期',

  // MEET_CATE_ID: 'string|true|comment=分类编号',
  // MEET_CATE_NAME: 'string|true|comment=分类冗余', 

  // MEET_FORMS: 'array|true|default=[]',
  // MEET_OBJ: 'object|true|default={}',  

  // MEET_CANCEL_SET: 'int|true|default=1|comment=取消设置 0=不允,1=允许,10=开始前均可取消,11=开始前1小时可取消,12=开始前2小时可取消,13=开始前3小时可取消,14=开始前4小时可取消,15=开始前5小时可取消',

  // MEET_STATUS: 'int|true|default=1|comment=状态 0=未启用,1=使用中,9=停止预约,10=已关闭',
  // MEET_ORDER: 'int|true|default=9999',
  // MEET_VOUCH: 'int|true|default=0',

  // MEET_QR: 'string|false',

  // MEET_PHONE: 'string|false|comment=登录手机',
  // MEET_PASSWORD: 'string|false|comment=登录密码',
  // MEET_MINI_OPENID: 'string|false|comment=小程序openid',


  // MEET_ADD_TIME: 'int|true',
  // MEET_EDIT_TIME: 'int|true',
  // MEET_ADD_IP: 'string|false',
  // MEET_EDIT_IP: 'string|false',
};

// 字段前缀
TeacherModel.FIELD_PREFIX = "TEACHER_";

/**
 * 状态 0=未启用,1=使用中,9=停止预约,10=已关闭 
 */
TeacherModel.STATUS = {
  // 在岗
  ON_DUTY: 1,
  // 离岗
  OFF_DUTY: 2,
};

TeacherModel.NAME = '教练';


module.exports = TeacherModel;