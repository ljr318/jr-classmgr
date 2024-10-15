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
			carNumber: 'must|string|min:7|max:7|name=车牌号',
			carName: 'must|string|name=分类',
			carStatus: 'must|int|name=车辆状态',
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
			carNumber: 'must|string|min:7|max:7|name=车牌号',
			carName: 'must|string|name=分类',
			carStatus: 'must|int|name=车辆状态',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new CarService();
		let result = service.editCar(input);

		return result;
	}
}

module.exports = AdminMeetController;