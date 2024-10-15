/**
 * Notes: 车辆实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wx)
 * Date: 2022-01-17 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class CarModel extends BaseProjectModel {

}

// 集合名
CarModel.CL = BaseProjectModel.C('car');

CarModel.DB_STRUCTURE = {
	CAR_NUMBER: 'string|true|comment=车牌号，唯一值',
	CAR_NAME: 'string|true|comment=车辆名称',
  CAR_STATUS: 'int|true|default=0|comment=车辆状态：0:可用 1:停用 ',
	CREATE_TIME: 'int|true',
	UPDATE_TIME: 'int|true',
};

// 字段前缀
CarModel.FIELD_PREFIX = "CAR_";

/**
 * 状态 0=可用,1=停用
 */
CarModel.STATUS = {
	AVAILABLE: 0,
	OUT_OF_SERVICE: 1,
};

CarModel.STATUS_DESC = {
	AVAILABLE: '可用',
	OUT_OF_SERVICE: '停用',
};

CarModel.NAME = '车辆';


module.exports = CarModel;