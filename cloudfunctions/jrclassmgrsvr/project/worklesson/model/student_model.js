/**
 * Notes: 用户实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-10-14 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');
class StudentModel extends BaseProjectModel { }

// 集合名
StudentModel.CL = BaseProjectModel.C('student');

StudentModel.DB_STRUCTURE = {
	STUDENT_ID: 'string|true|comment=学号',
	STUDENT_NAME: 'string|true|comment=学员姓名',
	PHONE_NUMBER: 'string|true|comment=手机号',
	STUDENT_TYPE: 'string|true|default=1|comment=学员类型：1：本校 2：外校',
	HEADIMG: 'string|true|comment=头像链接',
	STATUS: 'string|true|default=1|comment=学员状态：1:在校 2:离校 ',
  BOOKING_LIST: 'array|true|default=[]|comment=课程预约列表', 
	// USER_TYPE: 'int|true|default=1|comment=类型 0=未注册,1=已注册',
	// USER_NAME: 'string|false|comment=用户昵称',
	// USER_MOBILE: 'string|false|comment=联系电话',
	// USER_FORMS: 'array|true|default=[]',
	// USER_OBJ: 'object|true|default={}',
	// USER_LOGIN_CNT: 'int|true|default=0|comment=登陆次数',
	// USER_LOGIN_TIME: 'int|false|comment=最近登录时间',
	// USER_LESSON_TOTAL_CNT: 'int|true|default=0|comment=当前课时数',
	// USER_LESSON_USED_CNT: 'int|true|default=0|comment=已约课时数',
	// USER_LESSON_TIME: 'int|false|comment=最近课时变动时间', 
	// USER_REG_TIME: 'int|true|default=0',
	// USER_ADD_TIME: 'int|true',
	// USER_ADD_IP: 'string|false',
	// USER_EDIT_TIME: 'int|true',
	// USER_EDIT_IP: 'string|false',
}

// 字段前缀
StudentModel.FIELD_PREFIX = "STUDENT_";

/**
 * 状态 0=待审核,1=正常,8=审核未过,9=禁用
 */
StudentModel.STATUS = {
  AT_SCHOOL: 1,
  OFF_SCHOOL: 2,
};

StudentModel.STUDENT_TYPE = {
	INNER_STUDENT: 1,
	OUTER_STUDENT: 2,
};


module.exports = StudentModel;