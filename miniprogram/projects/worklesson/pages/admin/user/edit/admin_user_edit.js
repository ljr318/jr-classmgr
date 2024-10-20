const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js');
const contentCheckHelper = require('../../../../../../helper/content_check_helper.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoad: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!AdminBiz.isAdmin(this, true)) return;
    if (!pageHelper.getOptions(this, options)) return;
    this._loadDetail();
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

  _loadDetail: async function () {
    if (!AdminBiz.isAdmin(this, true)) return;

    let id = this.data.id;
    if (!id) return;

    let params = {
      id
    };
    let opt = {
      title: 'bar'
    };
    let user = await cloudHelper.callCloudData('admin/user_detail', params, opt);
    if (!user) {
      this.setData({
        isLoad: null
      })
      return;
    };
    console.log('Got user from backend:', user)
    this.setData({
      isLoad: true,
      ...user
    });
  },

  onChooseAvatar: async function (e) {
    const {
      avatarUrl
    } = e.detail;
    console.log('avatar:', avatarUrl);

    wx.showLoading({
      title: '上传中'
    });
    const cdnLink = await cloudHelper.transTempPicOne(avatarUrl, 'student_avatar', '', false);
    wx.hideLoading();

    this.setData({
      AVATAR: cdnLink,
    })
  },

  /** 
   * 数据提交
   */
  bindFormSubmit: async function () {
    if (!AdminBiz.isAdmin(this, true)) return;

    let data = this.data;

    // 数据校验 
    data = validate.check(data, AdminBiz.CHECK_FORM_USER_EDIT, this);
    if (!data) return;
    console.log("User data about to submit:", data);
    try {
      // let adminId = this.data.id;
      // data.id = adminId;

      await cloudHelper.callCloudSumbit('admin/user_edit', data).then(res => {

        let callback = () => {
          // 更新列表页面数据
          // let node = {
          //   'ADMIN_NAME': data.name,
          //   'ADMIN_DESC': data.desc,
          //   'ADMIN_PHONE': data.phone,
          // }
          // pageHelper.modifyPrevPageListNodeObject(adminId, node);
          // 返回列表页
          wx.navigateTo({
            url: '../list/admin_user_list'
          });
          // wx.navigateBack();
        }
        pageHelper.showSuccToast('修改成功', 1500, callback);
      });


    } catch (err) {
      console.log(err);
    }

  },
})