/**
 * Notes: 车辆模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-10-29 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const CarModel = require('../model/car_model.js');

class CarService extends BaseProjectService {

  /** 取得车辆列表，不做分页 */
  async getCarList({
    carID,
    carNumber, // 车牌号
    carStatus, // 车辆状态
  }) {

    orderBy = {
      'UPDATE_TIME': 'desc'
    };
    let fields = '*';

    let where = {};
    if (carID && carID.length() > 0) {
      where._id = carID;
    }
    if (carNumber && carNumber.length() > 0) {
      where.CAR_NUMBER = carNumber;
    }
    if (carStatus) {
      where.CAR_STATUS = carStatus;
    }
    return await CarModel.getList(where, fields, orderBy, 1, 2000, true, 0);
  }

  // 新增车辆
  async insertCar(car) {
    console.log('Car about to insert: ', car);
    let tmpCar = {
      CAR_NUMBER: car.carNumber,
      CAR_NAME: car.carName,
      CAR_STATUS: car.carStatus,
      CREATE_TIME: timeUtil.time() / 1000,
      UPDATE_TIME: timeUtil.time() / 1000,
    };
    return await CarModel.insert(tmpCar);
  }

  async editCar(car) {
    const whereCar = {
      _id: car._id
    }
    const editData = {
      CAR_NUMBER: car.carNumber,
      CAR_NAME: car.carName,
      CAR_STATUS: car.carStatus,
    }
    return await CarModel.edit(whereCar, editData);
  }

  // 删除车辆
  async delCar(carID) {
    console.log('Car about to delete: ', carID);
    // TODO: 检查当前车辆是否会被使用，会的话就拒绝删除
    const where = {
      _id: carID,
    };
    return await CarModel.del(where);
  }
}

module.exports = CarService;