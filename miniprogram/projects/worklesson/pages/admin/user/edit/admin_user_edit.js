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
    let teacher = await cloudHelper.callCloudData('admin/teacher_detail', params, opt);
    if (!teacher) {
      this.setData({
        isLoad: null
      })
      return;
    };
    console.log('Got teacher from backend:', teacher)
    this.setData({
      isLoad: true,
      ...teacher
    });
  },

  onChooseAvatar: async function (e) {
    const {
      avatarUrl
    } = e.detail;
    console.log('avatar:', avatarUrl);

    if (!contentCheckHelper.imgTypeCheck(path)) {
      wx.hideLoading();
      return pageHelper.showNoneToast('只能上传png、jpg、jpeg格式', 3000);
    }

    let maxSize = 20; //TODO setting
    let imageMaxSize = 1024 * 1000 * maxSize;
    console.log('IMGX SIZE=' + size + 'Byte,' + size / 1024 + 'K');
    if (!contentCheckHelper.imgSizeCheck(size, imageMaxSize)) {
      wx.hideLoading();
      return pageHelper.showModal('图片大小不能超过 ' + maxSize + '兆');
    }


    wx.showLoading({
      title: '上传中'
    });
    const cdnLink = await cloudHelper.transTempPicOne(avatarUrl, 'student_avatar', '', false);
    wx.hideLoading();

    this.setData({
      avatarUrl: cdnLink,
    })
  },

  /** 
   * 数据提交
   */
  bindFormSubmit: async function () {
    if (!AdminBiz.isAdmin(this, true)) return;

    let data = this.data;

    // 数据校验 
    data = validate.check(data, AdminBiz.CHECK_FORM_MGR_EDIT, this);
    if (!data) return;

    try {
      let adminId = this.data.id;
      data.id = adminId;

      await cloudHelper.callCloudSumbit('admin/mgr_edit', data).then(res => {

        let callback = () => {
          // 更新列表页面数据
          let node = {
            'ADMIN_NAME': data.name,
            'ADMIN_DESC': data.desc,
            'ADMIN_PHONE': data.phone,
          }
          pageHelper.modifyPrevPageListNodeObject(adminId, node);

          wx.navigateBack();
        }
        pageHelper.showSuccToast('修改成功', 1500, callback);
      });


    } catch (err) {
      console.log(err);
    }

  },
})