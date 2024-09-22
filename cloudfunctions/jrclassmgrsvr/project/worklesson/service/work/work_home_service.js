/**
 * Notes: 服务者首页管理模块 
 * Date: 2023-01-15 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.8 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectWorkService = require('./base_project_work_service.js');

const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const md5Lib = require('../../../../framework/lib/md5_lib.js');

const TeacherModel = require('../../model/teacher_model.js');

class WorkHomeService extends BaseProjectWorkService {


	/**
	 * 首页数据归集
	 */
	async workHome(meetId) {

		// let meetService = new MeetService();
		// let dayList = await meetService.getDaysSet(meetId, timeUtil.time('Y-M-D'));
		// let dayCnt = dayList.length;

		// return { dayCnt };
	}


	// 教练登录  
	async workLogin(phone, password, openId) {
		// 判断是否存在
		let where = {
			PHONE_NUMBER: phone,
			LOGIN_PASSWORD: password,
			STATUS: TeacherModel.STATUS.ON_DUTY
		}
		let fields = 'PHONE_NUMBER,_id,TEACHER_NAME,AVATAR,STATUS,PUBLISHED_LESSONS';
		let teacher = await TeacherModel.getOne(where, fields);
		if (!teacher)
			this.AppError('该账号不存在或者密码错误');

		// 生成token
		let token = dataUtil.genRandomString(32);
		let tokenTime = timeUtil.time();
		let data = {
			LAST_LOGIN_OPENID: openId,
			TEACHER_TOKEN: token,
			TEACHER_TOKEN_TIME: tokenTime,
			TEACHER_LOGIN_TIME: timeUtil.time(),
			// TEACHER_LOGIN_CNT: cnt + 1
		}
		await TeacherModel.edit(where, data);

		// let name = meet.MEET_TITLE;
		// let id = meet._id;
		// let last = (!meet.MEET_LOGIN_TIME) ? '尚未登录' : timeUtil.timestamp2Time(meet.MEET_LOGIN_TIME);
		// let pic = '';
		// if (meet.MEET_OBJ && meet.MEET_OBJ.cover && meet.MEET_OBJ.cover.length > 0)
		// 	pic = meet.MEET_OBJ.cover[0];

		return teacher;
	}

	/** 修改自身密码 */
	async pwdWork(workId, oldPassword, password) {
		let where = {
			_id: workId,
			MEET_PASSWORD: md5Lib.md5(oldPassword),
		}
		let work = await TeacherModel.getOne(where);
		if (!work)
			this.AppError('旧密码错误');

		let data = {
			LOGIN_PASSWORD: md5Lib.md5(password),
		}
		return await TeacherModel.edit(workId, data);
	}

}

module.exports = WorkHomeService;