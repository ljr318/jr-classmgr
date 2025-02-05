/**
 * Notes: 课程实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wx)
 * Date: 2022-01-17 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class MeetModel extends BaseProjectModel {

}

// 集合名
MeetModel.CL = BaseProjectModel.C('meet');

MeetModel.DB_STRUCTURE = {
  // _id: 'string|true|comment=课程ID',
  MEET_TEACHER_ID: 'string|true|comment=添加的教练员ID',
  MEET_TITLE: 'string|false|comment=课程标题',
  MEET_CATE_ID: 'int|true|default=0|comment=课程类型 0：模拟 1：训练',
  MEET_SUBJECT_TYPE: 'int|true|default=0|comment=科目 0：科目一 1：科目二 2：科目三 3：科目四',
  MEET_DRIVING_LICENSE_TYPE: 'string|true|default=C1|comment=驾照等级 C1 C2 B1 B2 A1 A2',
  MEET_DESC: 'string|false|comment=课程详情',
  MEET_USING_CAR_ID: 'string|true|comment=课程使用的车辆车牌号',
  MEET_START_TIME: 'int|false|comment=课程开始时间',
  MEET_END_TIME: 'int|false|comment=课程结束时间',
  MEET_LOCATION: 'string|false|comment=课程地点',
  MEET_RESERVE_STUDENT_CNT: 'int|true|default=0|comment=课程可预约人数',
  MEET_CANCEL_SET: 'int|true|default=1|comment=可取消时间 0=不允许取消,1=开始前1小时可取消,2=开始前2小时可取消,3=开始前3小时可取消,4=开课前均可取消',
  MEET_CAN_RESERVE_STUDENT_TYPE: 'int|true|default=0|comment=可预约学员类型 0=本校外校均可,1=本校学员',
  MEET_STATUS: 'int|true|default=0|comment=课程状态 0=开放预约/待开课,1=已开课,2=课程已结束,3=课程以取消',
  MEET_QR: 'string|false',
  MEET_RESERVED_STUDENT_CNT: 'int|true|default=0|comment=课程已预约人数',
  MEET_ADD_TIME: 'int|true',
  MEET_EDIT_TIME: 'int|true',
  MEET_CANCEL_REASON: 'string|false|comment=课程取消原因',
};

// 字段前缀
MeetModel.FIELD_PREFIX = "MEET_";

/**
 * 状态 0=开放预约,1=已开课,2=课程已结束,3=课程以取消,4=课程异常未开
 */
MeetModel.STATUS = {
  OPEN: 0,
  COMM: 1,
  OVER: 9,
  CLOSE: 10
};

// MeetModel.STATUS_DESC = {
//   UNUSE: '未启用',
//   COMM: '使用中',
//   OVER: '停止预约(可见)',
//   CLOSE: '已关闭(不可见)'
// };


MeetModel.NAME = '课程';


module.exports = MeetModel;