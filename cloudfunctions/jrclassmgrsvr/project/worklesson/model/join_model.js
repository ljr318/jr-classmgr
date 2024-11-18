/**
 * Notes: 报名实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-12-30 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class JoinModel extends BaseProjectModel {

}

// 集合名
JoinModel.CL = BaseProjectModel.C('join');

JoinModel.DB_STRUCTURE = {
	// _pid: 'string|true',
	// JOIN_ID: 'string|true',

	JOIN_EDIT_ADMIN_ID: 'string|false|comment=最近修改的管理员ID',
	// JOIN_EDIT_ADMIN_NAME: 'string|false|comment=最近修改的管理员名',
	JOIN_EDIT_ADMIN_TIME: 'int|false|default=0|comment=管理员最近修改的时间',
	// JOIN_EDIT_ADMIN_STATUS: 'int|false|comment=最近管理员修改为的状态 ',

	// JOIN_IS_ADMIN: 'int|true|default=0|comment=是否管理员添加 0/1',

	JOIN_CODE: 'string|true|comment=核验码15位',
	JOIN_IS_CHECKIN: 'int|true|default=0|comment=是否核销 0/1 ',
	JOIN_CHECKIN_TIME: 'int|true|default=0',

  JOIN_USER_ID: 'string|true|comment=用户ID',
  JOIN_MEET_START_TIME:'int|true',
  JOIN_MEET_END_TIME: 'int|true',
  JOIN_MEET_TEACHER_ID: 'string|true|comment=预约课程教练ID',
  JOIN_MEET_CATE_ID: 'int|true|default=0|comment=参加的课程类型 0：模拟 1：训练',
  JOIN_MEET_SUBJECT_TYPE: 'int|true|default=0|comment=科目 0：科目一 1：科目二 2：科目三 3：科目四',
	JOIN_MEET_ID: 'string|true|comment=预约的课程ID',
	JOIN_STATUS: 'int|true|default=1|comment=状态 1=待使用,2=已核销,3=已取消,4=已过期',
	JOIN_ADD_TIME: 'int|true',
	JOIN_EDIT_TIME: 'int|true',
	// JOIN_ADD_IP: 'string|false',
	// JOIN_EDIT_IP: 'string|false',
};

// 字段前缀
JoinModel.FIELD_PREFIX = "JOIN_";

/**
 * 状态 1=预约成功,10=已取消, 99=后台取消 
 */
JoinModel.STATUS = {
	SUCC: 1,
	CANCEL: 10,
	ADMIN_CANCEL: 99
};

JoinModel.STATUS_DESC = {
	SUCC: '预约成功',
	CANCEL: '已取消',
	ADMIN_CANCEL: '系统取消',
};



module.exports = JoinModel;