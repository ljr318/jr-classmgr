/**
 * Notes: 车辆模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-10-29 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const CarModel = require('../model/car_model.js');

class CarService extends BaseProjectService {

  /** 浏览资讯信息 */
  // async viewNews(id) {

  // 	let fields = '*';

  // 	let where = {
  // 		_id: id,
  // 		NEWS_STATUS: 1
  // 	}
  // 	let news = await NewsModel.getOne(where, fields);
  // 	if (!news) return null;



  // 	return news;
  // }


  /** 取得分页列表 */
  async getCarList({
    carID,
    carNumber, // 车牌号
    carName, // 车辆名称
    carStatus, // 车辆状态
    page,
    size,
    isTotal = true,
    oldTotal
  }) {

    orderBy = {
      'UPDATE_TIME': 'desc'
    };
    let fields = 'CAR_ID,CAR_NUMBER,CAR_NAME,CAR_IMG,CAR_STATUS,CREATE_TIME,UPDATE_TIME';

    let where = {};
    where.and = {
      CAR_ID: carID,

    };
    where.NEWS_STATUS = 1; // 状态 

    if (cateId && cateId !== '0') where.and.NEWS_CATE_ID = cateId;

    if (util.isDefined(search) && search) {
      where.or = [{
        NEWS_TITLE: ['like', search]
      }, ];
    } else if (sortType && util.isDefined(sortVal)) {
      // 搜索菜单
      switch (sortType) {
        case 'sort': {
          orderBy = this.fmtOrderBySort(sortVal, 'NEWS_ADD_TIME');
          break;
        }
        case 'cateId': {
          if (sortVal) where.and.NEWS_CATE_ID = String(sortVal);
          break;
        }
      }
    }

    return await CarModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
  }

}

module.exports = CarService;