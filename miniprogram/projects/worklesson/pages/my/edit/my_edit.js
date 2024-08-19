const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const validate = require('../../../../../helper/validate.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const projectSetting = require('../../../public/project_setting.js');
const setting = require('../../../../../setting/setting.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoad: false,
    isEdit: true,

    mobileCheck: setting.MOBILE_CHECK
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    ProjectBiz.initPage(this);
    await this._loadDetail();
  },

  _loadDetail: async function (e) {

    let opts = {
      title: 'bar'
    }
    let user = await cloudHelper.callCloudData('passport/my_detail', {}, opts);
    if (!user)
      return wx.redirectTo({
        url: '../reg/my_reg'
      });

    this.setData({
      isLoad: true,
      isEdit: true,

      fields: projectSetting.USER_FIELDS,

      formName: user.STUDENT_NAME,
      formMobile: user.PHONE_NUMBER,
      avatarUrl: user.AVATAR
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    await this._loadDetail();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  bindGetPhoneNumber: async function (e) {
    await PassportBiz.getPhone(e, this);
  },

  onChooseAvatar: async function (e) {
    const {
      avatarUrl
    } = e.detail;
    console.log('avatar:', avatarUrl);

    // if (!contentCheckHelper.imgTypeCheck(path)) {
    //   wx.hideLoading();
    //   return pageHelper.showNoneToast('只能上传png、jpg、jpeg格式', 3000);
    // }

    // let maxSize = 20; //TODO setting
    // let imageMaxSize = 1024 * 1000 * maxSize;
    // console.log('IMGX SIZE=' + size + 'Byte,' + size / 1024 + 'K');
    // if (!contentCheckHelper.imgSizeCheck(size, imageMaxSize)) {
    //   wx.hideLoading();
    //   return pageHelper.showModal('图片大小不能超过 ' + maxSize + '兆');
    // }


    wx.showLoading({
      title: '上传中'
    });
    const cdnLink = await cloudHelper.transTempPicOne(avatarUrl, 'student_avatar', '', false);
    wx.hideLoading();

    this.setData({
      avatarUrl: cdnLink,
    })
  },

  bindSubmitTap: async function (e) {
    try {
      let data = this.data;
      // 数据校验 
      data = validate.check(data, PassportBiz.CHECK_FORM, this);
      if (!data) return;

      let forms = this.selectComponent("#cmpt-form").getForms(true);
      if (!forms) return;
      data.forms = forms;
      data.userCheck = projectSetting.USER_REG_CHECK;

      let opts = {
        title: '提交中'
      };
      await cloudHelper.callCloudSumbit('passport/edit_base', data, opts).then(res => {
        let callback = () => {
          wx.reLaunch({
            url: '../index/my_index'
          });
        }
        PassportBiz.clearToken();
        pageHelper.showSuccToast('修改成功', 1500, callback);
      });
    } catch (err) {
      console.error(err);
    }
  }
})