/**
 * Notes:服务者预约控制器模块
 * Ver : CCMiniCloud Framework 2.0.3 ALL RIGHTS RESERVED BY cclinuX0730 (wechat)
 * Date: 2023-01-16 19:20:00 
 */

const BaseProjectWorkController = require('./base_project_work_controller.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const WorkMeetService = require('../../service/work/work_meet_service.js');
const AdminMeetService = require('../../service/admin/admin_meet_service.js');

class WorkMeetController extends BaseProjectWorkController {

  /** 获取预约信息用于编辑修改 */
  async getMeetDetail() {
    await this.isWork();

    // 数据校验
    let rules = {
      _id: 'must|id',
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new WorkMeetService();
    let detail = await service.getMeetDetail(input, this._openId);
    return detail;
  }

  // 发布课程
  async insertMeet() {
    await this.isWork();
    // 先获取下锁
    
    let rules = {
      // meetTitle: 'must|string|min:2|max:50|name=课程标题',
      meetCateID: 'must|int|name=课程类型',
      meetSubjectType: 'must|int|name=科目类型',
      meetDrivingLicenseType: 'must|string|name=驾照等级',
      // meetDesc: 'must|string|min:6|max:30|name=课程详情',
      meetUsingCarID: 'string|min:6|max:30|name=课程使用的车辆ID',
      meetStartTime: 'must|int|name=课程开始时间',
      meetEndTime: 'must|int|name=课程结束时间',
      // meetLocation: 'must|string|name=课程地点',
      meetReserveStudentCnt: 'must|int|name=课程可预约人数',
      meetCancelSet: 'must|int|name=可取消时间',
      meetCanReserveStudentType: 'must|int|name=可预约学员类型',
    };

    // 取得数据
    let input = this.validateData(rules);
    // input.id = this._workId;


    let service = new WorkMeetService();
    let result = service.insertMeet(this._openId, input);
    return result;
  }

  /** 编辑预约 */
  async editMeet() {
    await this.isWork();

    let rules = {
      _id: 'must|id',
      // meetTitle: 'must|string|min:2|max:50|name=课程标题',
      // meetCateID: 'must|int|name=课程类型',
      // meetSubjectType: 'must|int|name=科目类型',
      // meetDrivingLicenseType: 'must|string|name=驾照等级',
      // meetDesc: 'must|string|min:6|max:30|name=课程详情',
      // meetUsingCarID: 'string|min:6|max:30|name=课程使用的车辆ID',
      // meetStartTime: 'must|int|name=课程开始时间',
      // meetEndTime: 'must|int|name=课程结束时间',
      // meetLocation: 'must|string|name=课程地点',
      // meetReserveStudentCnt: 'must|int|name=课程可预约人数',
      meetCancelSet: 'must|int|name=可取消时间',
      meetCanReserveStudentType: 'must|int|name=可预约学员类型',
    };

    // 取得数据
    let input = this.validateData(rules);
    let service = new WorkMeetService();
    let result = service.editMeet(input, this._openId);
    return result;
  }


  /** 更新图片信息 */
  async updateMeetForms() {
    await this.isWork();

    // 数据校验
    let rules = {
      id: 'must|id',
      hasImageForms: 'array'
    };

    // 取得数据
    let input = this.validateData(rules);
    input.id = this._workId;


    let service = new AdminMeetService();
    return await service.updateMeetForms(input);
  }



  /** 创建模板 */
  async insertMeetTemp() {
    await this.isWork();

    let rules = {
      name: 'must|string|min:1|max:20|name=名称',
      times: 'must|array|name=模板时段',
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new AdminMeetService();
    let result = await service.insertMeetTemp(input, this._workId);

    return result;

  }

  /** 编辑模板 */
  async editMeetTemp() {
    await this.isWork();

    let rules = {
      id: 'must|id',
      isLimit: 'must|bool|name=是否限制',
      limit: 'must|int|name=人数上限',
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new AdminMeetService();
    let result = service.editMeetTemp(input, this._workId);

    return result;
  }

  /** 模板列表 */
  async getMeetTempList() {
    await this.isWork();

    let service = new AdminMeetService();
    let result = await service.getMeetTempList(this._workId);

    return result;
  }

  /** 删除模板 */
  async delMeetTemp() {
    await this.isWork();

    // 数据校验
    let rules = {
      id: 'must|id',
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new AdminMeetService();
    await service.delMeetTemp(input.id, this._workId);

  }


  // 取消课程
  async cancelMeet() {
    await this.isWork();

    // 数据校验
    let rules = {
      _id: 'must|id',
      cancelReason: 'string',
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new WorkMeetService();
    return await service.cancelMeet(input, this._openId);
  }

  async cancelJoinByTimeMark() {
    await this.isWork();

    // 数据校验
    let rules = {
      meetId: 'must|id',
      timeMark: 'must|string',
      reason: 'string'
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new AdminMeetService();
    return await service.cancelJoinByTimeMark(input._workId, input.timeMark, input.reason);
  }

  /** 预约名单列表 */
  async getJoinList() {
    await this.isWork();

    // 数据校验
    let rules = {
      search: 'string|min:1|max:30|name=搜索条件',
      sortType: 'string|name=搜索类型',
      sortVal: 'name=搜索类型值',
      orderBy: 'object|name=排序',
      meetId: 'must|id',
      page: 'must|int|default=1',
      size: 'int|default=10',
      isTotal: 'bool',
      oldTotal: 'int',
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new AdminMeetService();
    let result = await service.getJoinList(input);

    // 数据格式化
    let list = result.list;
    for (let k = 0; k < list.length; k++) {
      list[k].JOIN_ADD_TIME = timeUtil.timestamp2Time(list[k].JOIN_ADD_TIME);
      list[k].JOIN_CHECKIN_TIME = timeUtil.timestamp2Time(list[k].JOIN_CHECKIN_TIME);

      //分解成数组，高亮显示
      // let forms = list[k].JOIN_FORMS;
      // for (let j in forms) {
      //   forms[j].valArr = dataUtil.splitTextByKey(forms[j].val, input.search);
      // }

    }
    result.list = list;

    return result;
  }

  /** 预约名单列表 */
  async getMeetList() {
    await this.isWork();

    // 数据校验
    let rules = {
      search: 'string|min:1|max:30|name=搜索条件',
      sortType: 'string|name=搜索类型',
      sortVal: 'name=搜索类型值',
      page: 'must|int|default=1',
      size: 'int|default=10',
      isTotal: 'bool',
      oldTotal: 'int',
    };

    // 取得数据
    let input = this.validateData(rules);
    // input.meetId = this._workId;

    let service = new WorkMeetService();
    let result = await service.getMeetList(input, this._openId);
    console.log('Got meet list result:', result);
    // 数据格式化
    // let list = result.list;
    // for (let k = 0; k < list.length; k++) {
    //   list[k].JOIN_ADD_TIME = timeUtil.timestamp2Time(list[k].JOIN_ADD_TIME);
    //   list[k].JOIN_CHECKIN_TIME = timeUtil.timestamp2Time(list[k].JOIN_CHECKIN_TIME);

    //   //分解成数组，高亮显示
    //   let forms = list[k].JOIN_FORMS;
    //   for (let j in forms) {
    //     forms[j].valArr = dataUtil.splitTextByKey(forms[j].val, input.search);
    //   }

    // }
    // result.list = list;

    result.list.forEach((item)=>{
      item.MEET_START_TIME_STR = timeUtil.timestamp2Time(item.MEET_START_TIME);
      item.MEET_END_TIME_STR = timeUtil.timestamp2Time(item.MEET_END_TIME);
    });

    return result;

  }

  // 按日统计预约记录
  async getDayList() {
    await this.isWork();

    let rules = {
      meetId: 'must|id',
      start: 'must|date',
      end: 'must|date',
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new AdminMeetService();
    return await service.getDayList(this._workId, input.start, input.end);
  }


  /** 管理员按钮核销 */
  async checkinJoin() {
    await this.isWork();

    let rules = {
      joinId: 'must|id',
      flag: 'must|in:0,1'
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new AdminMeetService();
    await service.checkinJoin(input.joinId, input.flag);
  }

  /** 管理员扫码核验 */
  async scanJoin() {
    await this.isWork();

    let rules = {
      // meetId: 'must|id',
      code: 'must|string',
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new AdminMeetService();
    await service.scanJoin(input.code);
  }


  /** 报名状态修改 */
  async statusJoin() {
    await this.isWork();

    // 数据校验
    let rules = {
      joinId: 'must|id',
      status: 'must|int',
      reason: 'string|max:200',
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new AdminMeetService();
    return await service.statusJoin(input.joinId, input.status, input.reason);
  }

  /** 报名删除 */
  async delJoin() {
    await this.isWork();

    // 数据校验
    let rules = {
      joinId: 'must|id'
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new AdminMeetService();
    return await service.delJoin(input.joinId);
  }

}

module.exports = WorkMeetController;