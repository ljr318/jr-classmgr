/**
 * Notes: 预约模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-12-08 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');
const CarService = require('../../service/car_service.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const CarModel = require('../../model/car_model.js');

class AdminCarController extends BaseProjectAdminController {

	async getCarList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new CarService();
		let result = await service.getCarList(input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].CREATE_TIME = timeUtil.timestamp2Time(list[k].CREATE_TIME);
		}
		result.list = list;
		return result;
  }
  
	/** 删除车辆 */
	async delCar() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			_id: 'must|id'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new CarService();
		return await service.delCar(input._id);
	}

	/** 新增车辆 */
	async insertCar() {
		await this.isAdmin();

		let rules = {
			CAR_NUMBER: 'must|string|min:7|max:8|name=车牌号',
			CAR_NAME: 'must|string|name=分类',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new CarService();
		let result = await service.insertCar(input);
		return result;
	}

	/** 编辑车辆 */
	async editCar() {
		await this.isAdmin();

		let rules = {
			_id: 'must|id',
      CAR_NAME: 'must|string|name=分类',
      CAR_NUMBER: 'must|string|name=车牌号',
			CAR_STATUS: 'must|int|name=车辆状态',
		};
		// 取得数据
		let input = this.validateData(rules);
    console.log("car number len:", input.CAR_NUMBER.length);
		let service = new CarService();
		let result = service.editCar(input);

		return result;
	}
}

module.exports = AdminCarController;