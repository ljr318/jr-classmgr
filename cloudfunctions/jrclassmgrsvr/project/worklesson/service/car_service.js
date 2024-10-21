/**
 * Notes: 车辆模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-10-29 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const CarModel = require('../model/car_model.js');
const MeetModel = require('../model/meet_model.js');
const timeUtil = require('../../../framework/utils/time_util.js');

class CarService extends BaseProjectService {

  async getCarList({
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

    if (util.isDefined(search) && search) {
      where.or = [{
          CAR_NUMBER: ['like', search]
        },
        {
          CAR_NAME: ['like', search]
        }
      ];

    } else if (sortType && util.isDefined(sortVal)) {
      // 搜索菜单
      where.and = {};
      switch (sortType) {
        case 'status':
          where.and.CAR_STATUS = Number(sortVal);
          break;
        case 'sort': {
          orderBy = this.fmtOrderBySort(sortVal);
          break;
        }
      }
    }
    let result = await CarModel.getList(where, fields, orderBy, page, size, true, oldTotal, false);
    return result;
  }

  async checkIfCarOccupied(carNumber, occupiedTimeSpan) {
    console.log("carNumber:", carNumber);
    const tmpFields = "_id";
    const where = {
      and: [{
        MEET_USING_CAR_ID: carNumber,
      }],
      or: [{
          MEET_START_TIME: [
            ['>=', occupiedTimeSpan.startTime],
            ['<', occupiedTimeSpan.endTime]
          ]
        },
        {
          MEET_END_TIME: [
            ['>', occupiedTimeSpan.startTime],
            ['<=', occupiedTimeSpan.endTime]
          ]
        }
      ]
    };
    console.log("where:", where, where.or[0], where.or[1]);
    const res = await MeetModel.getOne(where, tmpFields);
    console.log("res:", res);
    if (res === null) {
      return 0;
    }
    return 1;
  }

  /** 取得车辆列表，不做分页 */
  async getCars(carStatus, occupiedTimeSpan) {

    const orderBy = {
      'UPDATE_TIME': 'desc'
    };
    let fields = '*';

    let where = {};
    // if (carID && carID.length() > 0) {
    //   where._id = carID;
    // }
    // if (carNumber && carNumber.length() > 0) {
    //   where.CAR_NUMBER = carNumber;
    // }
    if (carStatus) {
      where.CAR_STATUS = carStatus;
    } else {
      where.CAR_STATUS = 0;
    }
    let resCarList = [];
    let tmpCarList = await CarModel.getList(where, fields, orderBy, 1, 2000, true, 0);
    if (occupiedTimeSpan && occupiedTimeSpan.startTime && occupiedTimeSpan.endTime) {
      for (const item of tmpCarList.list) {
        console.log("Inner car:", item);
        const tmpFields = "_id";
        const where = {
          and: [{
            MEET_USING_CAR_ID: item.CAR_NUMBER
          }],
          or: [{
              MEET_START_TIME: [
                ['>=', occupiedTimeSpan.startTime],
                ['<', occupiedTimeSpan.endTime]
              ]
            },
            {
              MEET_END_TIME: [
                ['>', occupiedTimeSpan.startTime],
                ['<=', occupiedTimeSpan.endTime]
              ]
            }
          ]
        };
        // console.log("where:", where, where.or[0], where.or[1], where.where.fieldName);
        const res = await MeetModel.getOne(where, tmpFields);
        console.log("res:", res);
        if (res === null) {
          resCarList.push(item);
        }
      }
    } else {
      resCarList = tmpCarList;
    }
    return resCarList;
  }

  /** 获取车辆详情 */
  async getCarDetail({
    _id
  }) {
    let fields = '*';

    let where = {
      _id
    };
    return await CarModel.getOne(where, fields);
  }

  // 新增车辆
  async insertCar(car) {
    console.log('Car about to insert: ', car);
    let tmpCar = {
      CAR_NUMBER: car.CAR_NUMBER,
      CAR_NAME: car.CAR_NAME,
      CAR_STATUS: 0,
      CREATE_TIME: timeUtil.time(),
      UPDATE_TIME: timeUtil.time(),
    };
    return await CarModel.insert(tmpCar);
  }

  async editCar(car) {
    const whereCar = {
      _id: car._id
    }
    const editData = {
      CAR_NUMBER: car.CAR_NUMBER,
      CAR_NAME: car.CAR_NAME,
      CAR_STATUS: car.CAR_STATUS,
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