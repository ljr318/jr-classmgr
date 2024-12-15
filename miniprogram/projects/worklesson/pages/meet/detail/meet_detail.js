const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const timeHelper = require('../../../../../helper/time_helper.js')
const MeetBiz = require('../../../biz/meet_biz.js');
const projectSetting = require('../../../public/project_setting.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoad: false,


    tabCur: 0,
    mainCur: 0,
    verticalNavTop: 0,

    cur: 'info',

    dayIdx: 0,
    timeIdx: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    ProjectBiz.initPage(this);
    if (!await PassportBiz.loginMustBackWin(this)) return;
    if (!pageHelper.getOptions(this, options)) return;

    this._loadDetail();
  },

  _loadDetail: async function () {
    this.setData({
      dayIdx: 0,
      timeIdx: -1,
      isLoad: false
    });

    let id = this.data.id;
    if (!id) return;

    let params = {
      _id: id,
    };
    let opt = {
      title: 'bar'
    };
    let meet = await cloudHelper.callCloudData('meet/detail', params, opt);
    if (!meet) {
      this.setData({
        isLoad: null
      })
      return;
    }

    // let days = meet.MEET_DAYS_SET;

    // let dayNow1 = timeHelper.time('Y-M-D');
    // let dayNow2 = timeHelper.time('Y-M-D', 86400);
    // let dayNow3 = timeHelper.time('Y-M-D', 86400 * 2);

    // for (let k = 0; k < days.length; k++) {

    // 	if (days[k].day == dayNow1) days[k].status = '今天';
    // 	if (days[k].day == dayNow2) days[k].status = '明天';
    // 	if (days[k].day == dayNow3) days[k].status = '后天';

    // 	days[k].week = timeHelper.week(days[k].day);
    // 	days[k].date = days[k].day.split('-')[1] + '-' + days[k].day.split('-')[2]
    // }
    meet.startTimeStr = timeHelper.timestamp2Time(meet.MEET_START_TIME);
    meet.endTimeStr = timeHelper.timestamp2Time(meet.MEET_END_TIME);

    this.setData({
      isLoad: true,
      meet,
      // days,
      canNullTime: projectSetting.MEET_CAN_NULL_TIME
    });

  },

  bindDayTap: function (e) {
    let dayIdx = pageHelper.dataset(e, 'idx');
    this.setData({
      dayIdx,
      timeIdx: -1,
    });
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
    if (!await PassportBiz.loginMustBackWin(this)) return;
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindTimeTap: function (e) {
    let timeIdx = pageHelper.dataset(e, 'timeidx');

    let node = this.data.days[this.data.dayIdx].times[timeIdx];
    if (node.error) return;

    this.setData({
      timeIdx
    });
  },

  // bindSubmitCmpt: async function (e) {
  // 	let formsList = [];

  // 		formsList = [e.detail];
  // 		if (formsList.length == 0) return pageHelper.showModal('请先填写资料');


  // 	let callback = async () => {
  // 		try {
  // 			let opts = {
  // 				title: '提交中'
  // 			}
  // 			let params = {
  // 				meetId: this.data.id,
  // 				timeMark: this.data.timeMark,
  // 				formsList
  // 			}
  // 			await cloudHelper.callCloudSumbit('meet/join', params, opts).then(res => {
  // 				let content = '预约成功！'

  // 				wx.showModal({
  // 					title: '温馨提示',
  // 					showCancel: false,
  // 					content,
  // 					success() {
  // 						let ck = () => {
  // 							if (setting.IS_SUB)
  // 								wx.redirectTo({
  // 									url: pageHelper.fmtURLByPID('/pages/meet/my_join_list/meet_my_join_list')
  // 								});
  // 							else
  // 								wx.reLaunch({
  // 									url: pageHelper.fmtURLByPID('/pages/meet/my_join_list/meet_my_join_list')
  // 								});
  // 						}
  // 						ck();
  // 					}
  // 				})
  // 			})
  // 		} catch (err) {
  // 			console.log(err);
  // 		};
  // 	}

  // 	callback();

  // },

  bindJoinTap: async function (e) {
    if (!await PassportBiz.loginMustCancelWin(this)) return;

    this.setData({
      cur: 'info'
    });
    let meetId = this.data.id;

    let callback = async () => {
      try {
        let opts = {
          title: '提交中'
        }
        let params = {
          meetId: this.data.id,
        }
        await cloudHelper.callCloudSumbit('meet/join', params, opts).then(res => {
          let content = '预约成功！'
          wx.showModal({
            title: '温馨提示',
            showCancel: false,
            content,
            success() {
              let ck = () => {
                wx.redirectTo({
                  url: pageHelper.fmtURLByPID('/pages/meet/my_join_list/meet_my_join_list')
                });
              }
              ck();
            }
          })
        })
      } catch (err) {
        console.log(err);
      };
    }
    pageHelper.showConfirm('确定要预约该节课程吗？', callback);
  },

  url: function (e) {
    pageHelper.url(e, this);
  },

  bindTabTap: function (e) {
    let cur = pageHelper.dataset(e, 'cur');
    this.setData({
      cur
    });
  },

  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        topBtnShow: true
      });
    } else {
      this.setData({
        topBtnShow: false
      });
    }
  },



})