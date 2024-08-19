const pageHelper = require('../../../../../helper/page_helper.js');
const helper = require('../../../../../helper/helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const validate = require('../../../../../helper/validate.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const projectSetting = require('../../../public/project_setting.js');
const setting = require('../../../../../setting/setting.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoad: false,
    isEdit: false,
    avatarUrl: defaultAvatarUrl,
    mobileCheck: setting.MOBILE_CHECK,
    formName: '',
    formMobile: '',
    formInviteCode: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    ProjectBiz.initPage(this);

    if (options && options.retUrl)
      this.data.retUrl = decodeURIComponent(options.retUrl);

    await this._loadDetail();
  },

  _loadDetail: async function (e) {
    let opts = {
      title: 'bar'
    }
    let user = await cloudHelper.callCloudData('passport/my_detail', {}, opts);
    if (user) {
      return wx.reLaunch({
        url: '../index/my_index'
      });
    }

    this.setData({
      isLoad: true,

      // fields: projectSetting.USER_FIELDS,

      // formName: '',
      // formMobile: '',
      // formForms: []
    });
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
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
  onPullDownRefresh: async function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  bindGetPhoneNumber: async function (e) {
    console.log('DBG MARK1');
    console.log(e);
    PassportBiz.getPhone(e, this);
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
      let submitForm = {
        avatarUrl: this.data.avatarUrl,
        name: this.data.formName,
        phoneNumber: this.data.formMobile,
        inviteCode: this.data.formInviteCode
      };
      console.log("Call cloud function passport/register req: ", submitForm);
      await cloudHelper.callCloudSumbit('passport/register', submitForm, opts).then(result => {
        if (result && helper.isDefined(result.data.token) && result.data.token) {

          let callback = () => {
            if (this.data.retUrl == 'back')
              wx.navigateBack();
            else if (this.data.retUrl)
              wx.redirectTo({
                url: this.data.retUrl,
              })
            else
              wx.reLaunch({
                url: '../index/my_index'
              });
          }
          pageHelper.showSuccToast('注册成功', 1500, callback);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
})