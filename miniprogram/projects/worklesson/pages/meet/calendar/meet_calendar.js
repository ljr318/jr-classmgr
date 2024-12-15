const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const timeHelper = require('../../../../../helper/time_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoad: false,
    days: [],

    list: [],

    day: '',
    hasDays: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    ProjectBiz.initPage(this);
    if (!await PassportBiz.loginMustBackWin(this)) return;
    let days = [];
    for (let k = -3; k < 31; k++) {
      days.push({
        full: timeHelper.time('Y-M-D', 86400 * k),
        val: timeHelper.time('M-D', 86400 * k)
      });
    }
    this.setData({
      days
    });

    this.setData({
      day: timeHelper.time('Y-M-D')
    }, async () => {
      // await this._loadHasList();
      await this._loadList();
    });
  },

  _loadList: async function () {
    let params = {
      day: this.data.day
    }
    let opts = {
      title: this.data.isLoad ? 'bar' : 'bar'
    }
    try {
      this.setData({
        list: null
      });
      await cloudHelper.callCloudSumbit('meet/list_by_day', params, opts).then(res => {
        res.data?.forEach((item) => {
          item.startTimeStr = timeHelper.timestamp2Time(item.MEET_START_TIME);
          item.endTimeStr = timeHelper.timestamp2Time(item.MEET_END_TIME);
        });
        this.setData({
          list: res.data,
          isLoad: true
        });
      });
    } catch (err) {
      console.error(err);
    }
  },

  _loadHasList: async function () {
    let params = {
      day: timeHelper.time('Y-M-D')
    }
    let opts = {
      title: 'bar'
    }
    try {
      await cloudHelper.callCloudSumbit('meet/list_has_day', params, opts).then(res => {
        this.setData({
          hasDays: res.data,
        });
      });
    } catch (err) {
      console.error(err);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    // await this._loadHasList();
    // await this._loadList();
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
  onPullDownRefresh: function () {
    // await this._loadHasList();
    this._loadList();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindClickTap: async function (e) {
    let day = pageHelper.dataset(e, 'day');
    this.setData({
      day
    }, async () => {
      await this._loadList();
    })

  },

  bindMonthChangeCmpt: function (e) {},

  url: async function (e) {
    // if (e.currentTarget.dataset.status === 0) {
    pageHelper.url(e, this);
    // }
  },
})