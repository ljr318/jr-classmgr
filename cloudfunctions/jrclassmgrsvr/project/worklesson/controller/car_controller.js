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
  async getCars() {
    // 数据校验
    let rules = {
      carStatus: 'int',
      occupyStartTime: 'int',
      occupyEndTime: 'int',
    };

    // 取得数据
    let input = this.validateData(rules);
    console.log("Got get car list input: ", input);
    let service = new CarService();
    let result = await service.getCars(input.carStatus, {
      startTime: input.occupyStartTime,
      endTime: input.occupyEndTime
    });
    console.log("Got car list: ", result);
    return result;
  }

  /** 获取车辆详情 **/
  async getCarDetail() {
    // 数据校验
    let rules = {
      _id: 'must|id',
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new CarService();
    let car = await service.getCarDetail(input);

    return car;
  }
}

module.exports = CarController;