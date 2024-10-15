/**
 * Notes: 用户管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-01-22  07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');

const util = require('../../../../framework/utils/util.js');
const exportUtil = require('../../../../framework/utils/export_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const StudentModel = require('../../model/student_model.js');
const LessonLogModel = require('../../model/lesson_log_model.js');
const AdminHomeService = require('./admin_home_service.js');
const MeetService = require('../meet_service.js');

// 导出用户数据KEY
const EXPORT_USER_DATA_KEY = 'EXPORT_USER_DATA';

class AdminUserService extends BaseProjectAdminService {


  /** 获得某个用户信息 */
  async getUser({
    userId,
    fields = '*'
  }) {
    let where = {
      OPENID: userId,
    }
    console.log("Get user where:", where);
    return await StudentModel.getOne(where, fields);
  }

  /** 取得用户分页列表 */
  async getUserList({
    search, // 搜索条件
    sortType, // 搜索菜单
    sortVal, // 搜索菜单
    orderBy, // 排序
    whereEx, //附加查询条件 
    page,
    size,
    oldTotal = 0
  }) {

    orderBy = orderBy || {
      CREATE_TIME: 'desc'
    };
    let fields = '*';


    let where = {};
    // where.and = {
    // 	_pid: this.getProjectId() //复杂的查询在此处标注PID
    // };

    if (util.isDefined(search) && search) {
      where.or = [{
          STUDENT_NAME: ['like', search]
        },
        {
          PHONE_NUMBER: ['like', search]
        }
      ];

    } else if (sortType && util.isDefined(sortVal)) {
      // 搜索菜单
      switch (sortType) {
        case 'status':
          where.and.STATUS = Number(sortVal);
          // where.and.STUDENT_TYPE = 1;
          break;
        case 'type':
          where.and.STUDENT_TYPE = Number(sortVal);
          where.and.STATUS = 1;
          break;
        case 'sort': {
          orderBy = this.fmtOrderBySort(sortVal, 'CREATE_TIME');
          break;
        }
      }
    }
    let result = await StudentModel.getList(where, fields, orderBy, page, size, true, oldTotal, false);


    // 为导出增加一个参数condition
    // result.condition = encodeURIComponent(JSON.stringify(where));

    return result;
  }


  async statusUser(id, status, reason) {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }


  /**添加用户 */
  async insertUser(admin, {
    name,
    mobile,
    lessonCnt
  }) {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }

  /**删除用户 */
  async delUser(id) {
    const where = {
      OPENID: id,
    };
    return await StudentModel.del(where);
  }

  // #####################导出用户数据

  /**获取用户数据 */
  async getUserDataURL() {
    return await exportUtil.getExportDataURL(EXPORT_USER_DATA_KEY);
  }

  /**删除用户数据 */
  async deleteUserDataExcel() {
    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
  }

  /**导出用户数据 */
  async exportUserDataExcel(condition, fields) {

    this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');

  }

}

module.exports = AdminUserService;