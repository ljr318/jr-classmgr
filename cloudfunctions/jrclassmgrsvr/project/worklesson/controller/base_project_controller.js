/**
 * Notes: 本业务基本控制器
 * Date: 2021-03-15 19:20:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseController = require('../../../framework/platform/controller/base_controller.js');
const BaseProjectService = require('../service/base_project_service.js');
const PassportService = require('../service/passport_service.js');
const appCode = require('../../../framework/core/app_code.js');

class BaseProjectController extends BaseController {

  /**
   * 抛出异常
   * @param {*} msg 
   * @param {*} code 
   */
  AppError(msg) {
    console.log('App error:', msg);
    super.AppError(msg);
  }

  // TODO
  async initSetup() {
    let service = new BaseProjectService();
    await service.initSetup();
  }

  /** 是否登陆  */
  async isUserLogin() {
    let service = new PassportService();
    let res = await service.login(this._openId);
    if (res.token === null) {
      this.AppError('登录已过期/未注册，请重新登录/注册', appCode.USER_LOGIN_ERROR);
    }
    return res.token;
  }
}

module.exports = BaseProjectController;