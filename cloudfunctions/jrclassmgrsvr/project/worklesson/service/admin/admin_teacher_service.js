/**
 * Notes: 管理员管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-07-11 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const util = require('../../../../framework/utils/util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const AdminModel = require('../../../../framework/platform/model/admin_model.js');
const LogModel = require('../../../../framework/platform/model/log_model.js');
const md5Lib = require('../../../../framework/lib/md5_lib.js');
const TeacherModel = require('../../model/teacher_model.js');
const shortUUID = require('short-uuid');

class AdminTeacherService extends BaseProjectAdminService {

	/** 获取所有管理员 */
	async getTeacherList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {
		orderBy = {
			ADMIN_ADD_TIME: 'desc'
		}
		let fields = 'TEACHER_NAME,PHONE_NUMBER,AVATAR,STATUS,LOGIN_PASSWORD,_id';

		let where = {};
		if (util.isDefined(search) && search) {
			where.or = [{
				TEACHER_NAME: ['like', search]
			},
			{
				PHONE_NUMBER: ['like', search]
			}
			];
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					// 按类型
					where.and = [
            {
              STATUS: Number(sortVal),
            }
          ];
					break;
			}
		}
    console.log('get teacher list where: ', where);
		return await TeacherModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/** 删除管理员 */
	async delTeacher(id) {
    const where = {
      _id: id,
    };
    return await TeacherModel.del(where);
	}

  // TEACHER_ID: 'string|true',
  // TEACHER_NAME: 'string|true',
  // PHONE_NUMBER: 'string|true|comment=添加的管理员',
  // AVATAR: 'string|true|default=|comment=头像cdn链接',
  // STATUS: 'int|true|default=1|comment=状态 1=在岗,2离岗',
  // PUBLISHED_LESSONS: 'array|true|default=[]|comment=发布的所有课程',
  // LOGIN_PASSWORD: 'string|true|comment=登陆密码',
  // LAST_LOGIN_OPENID: 'string|true|comment=上一次登入用户的微信openid',
	/** 添加新的管理员 */
	async insertTeacher({
		teacherName,
		phoneNumber,
    password,
    openID
	}) {
    let teacher = {};
    teacher.TEACHER_ID = shortUUID.generate();
    teacher.TEACHER_NAME = teacherName;
    teacher.PHONE_NUMBER = phoneNumber;
    teacher.LOGIN_PASSWORD = password;
    teacher.STATUS = 1;
    teacher.PUBLISHED_LESSONS = {};
    teacher.LAST_LOGIN_OPENID = openID;
    teacher.AVATAR = '';
    console.log('Teacher about to insert: ', teacher);
    return await TeacherModel.insert(teacher);
	}

	/** 修改状态 */
	async statusTeacher(id, status) {
    const where = {
      _id: id,
    };
    const data = {
      STATUS: status,
    }
    return await TeacherModel.edit(where, data);
	} 
 

	/** 获取管理员信息 */
	async getTeacherDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		let teacher = await AdminModel.getOne(where, fields);
		if (!teacher) return null;

		return teacher;
	}

	/** 修改管理员 */
	async editTeacher(id, {
		name,
		desc,
		phone,
		password
	}) {

		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 修改自身密码 */
	async pwdtTeacher(adminId, oldPassword, password) {

		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}
}

module.exports = AdminTeacherService;