/**
 * Notes: 车辆模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-09-29 04:00:00 
 */

const BaseProjectController = require('./base_project_controller.js');
const CarService = require('../service/car_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');

class CarController extends BaseProjectController {

	/** 车辆列表 */
	async getCarList() {
		// 数据校验
		let rules = {
      carID: 'string',
			carNumber: 'string',
			carStatus: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);
    console.log("Got get car list input: ", input);
		let service = new CarService();
		let result = await service.getCarList(input);
    console.log("Got car list: ", result);
		return result;
	}
}

module.exports = CarController;