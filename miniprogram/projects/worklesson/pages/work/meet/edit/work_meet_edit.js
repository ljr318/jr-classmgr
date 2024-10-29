const WorkBiz = require('../../../../biz/work_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const timeHelper = require('../../../../../../helper/time_helper.js');
const validate = require('../../../../../../helper/validate.js');
const AdminMeetBiz = require('../../../../biz/admin_meet_biz.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoad: false,
    isEdit: false,
    meetTitle: '',
    meetSubjectType: 1,
    meetDrivingLicenseType: 'C1',
    meetDesc: '',
    meetUsingCarID: '',
    formMeetStartTime: '',
    formMeetEndTime: '',
    meetLocation: '',
    meetReserveStudentCnt: 0,
    meetCancelSet: 0,
    meetCanReserveStudentType: 0,
    availableCars: [{
      label: '',
      val: ''
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log("on load");
    if (!WorkBiz.isWork(this)) return;
    pageHelper.getOptions(this, options);
    if (this.data.id) {
      const tmpMeet = await cloudHelper.callCloudData('work/meet_detail', {
        _id: this.data.id
      });
      console.log('tmpMeet:', tmpMeet);
      if (!tmpMeet) return;
      const startTime = timeHelper.timestamp2Time(tmpMeet.MEET_START_TIME);
      const endTime = timeHelper.timestamp2Time(tmpMeet.MEET_END_TIME);
      this.setData({
        isLoad: true,
        isEdit: true,
        meetCateID: tmpMeet.MEET_CATE_ID,
        meetTitle: tmpMeet.MEET_TITLE,
        meetSubjectType: tmpMeet.MEET_SUBJECT_TYPE,
        meetDrivingLicenseType: tmpMeet.MEET_DRIVING_LICENSE_TYPE,
        meetDesc: tmpMeet.MEET_DESC,
        meetUsingCarID: tmpMeet.MEET_USING_CAR_ID,
        formMeetStartTime: startTime,
        formMeetEndTime: endTime,
        meetLocation: tmpMeet.MEET_LOCATION,
        meetReserveStudentCnt: tmpMeet.MEET_RESERVE_STUDENT_CNT,
        meetCancelSet: tmpMeet.MEET_CANCEL_SET,
        meetCanReserveStudentType: tmpMeet.MEET_CAN_RESERVE_STUDENT_TYPE,
      });
    } else {
      // this.setData(await AdminMeetBiz.initFormData()); // 初始化表单数据   

      // await this._loadDetail();
      const tmpCars = await cloudHelper.callCloudData('car/get_cars', {
        carStatus: 0
      });
      console.log("tmp cars:", tmpCars);
      const availableCars = [];
      tmpCars.list.forEach((item) => {
        console.log("car item:", item);
        availableCars.push({
          label: `${item.CAR_NAME}-${item.CAR_NUMBER}`,
          val: item.CAR_NUMBER
        });
      });

      this.setData({
        availableCars: availableCars,
        id: WorkBiz.getWorkId(),
        onStartEndTimeChange: this.onStartEndTimeChange.bind(this),
        isLoad: true,
      });
      console.log("data:", this.data);
    }

  },

  _loadDetail: async function () {
    let id = this.data.id;
    console.log('meet edit data:', this.data);
    if (!id) return;

    let params = {
      id
    };
    let opt = {
      title: 'bar'
    };
    // let meet = await cloudHelper.callCloudData('work/meet_detail', params, opt);

    // if (!meet) {
    // 	this.setData({
    // 		isLoad: null
    // 	})
    // 	return;
    // }

    this.setData({
      isLoad: true,


      // 表单数据   
      // formTitle: meet.MEET_TITLE,
      // formCateId: meet.MEET_CATE_ID,
      // formOrder: meet.MEET_ORDER,
      // formCancelSet: meet.MEET_CANCEL_SET,

      // formPhone: meet.MEET_PHONE,

      // formForms: meet.MEET_FORMS,

      // formDaysSet: meet.MEET_DAYS_SET,

      // formJoinForms: meet.MEET_JOIN_FORMS,

      formTitle: 'test',
      formCateId: '2',
      formOrder: 9999,
      formCancelSet: 1,

      formPhone: '13319893318',

      formForms: [{
        "must": "true",
        "title": "姓名",
        "type": "text"
      }, {
        "must": "true",
        "title": "手机",
        "type": "mobile"
      }],

      formDaysSet: ['2024年9月21日'],

      formJoinForms: [{
        "must": "true",
        "title": "姓名",
        "type": "text"
      }, {
        "must": "true",
        "title": "手机",
        "type": "mobile"
      }],
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
  onShow: function () {},

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


  bindJoinFormsCmpt: function (e) {
    this.setData({
      formJoinForms: e.detail,
    });
  },


  bindFormEditSubmit: async function () {
    pageHelper.formClearFocus(this);

    if (!WorkBiz.isWork(this)) return;

    let data = this.data;


    // if (data.formDaysSet.length <= 0) {
    // 	pageHelper.anchor('formDaysSet', this);
    // 	return pageHelper.formHint(this, 'formDaysSet', '请配置「可预约时段」');
    // }
    // if (data.formJoinForms.length <= 0) return pageHelper.showModal('请至少设置一项「用户填写资料」');

    // 先把开始时间和结束时间转成unix时间戳
    // console.log(data);
    if (data.formMeetStartTime == '' || data.formMeetEndTime == '') {
      return pageHelper.showModal('请选择开课时间');
    }
    let startTimestamp = timeHelper.time2Timestamp(data.formMeetStartTime);
    let endTimestamp = timeHelper.time2Timestamp(data.formMeetEndTime);
    if (startTimestamp >= endTimestamp) {
      return pageHelper.showModal('请输入正确的课程开始与结束时间');
    } else if (data.meetReserveStudentCnt == 0) {
      return pageHelper.showModal('可预约人数上限不能为0');
    }
    data.meetStartTime = startTimestamp;
    data.meetEndTime = endTimestamp;
    data = validate.check(data, this.data.isEdit ? AdminMeetBiz.EDIT_CHECK_FORM : AdminMeetBiz.CHECK_FORM, this);
    if (!data) return;

    // let forms = this.selectComponent("#cmpt-form").getForms(true);
    // if (!forms) return;
    // data.forms = forms;

    // data.cateName = AdminMeetBiz.getCateName(data.cateId);

    try {
      // let meetId = this.data.id;
      // data.id = meetId;
      console.log("about to submit data:", data);
      if (this.data.isEdit) {
        await cloudHelper.callCloudSumbit('work/meet_edit', data);
      } else {
        // 先修改，再上传 
        await cloudHelper.callCloudSumbit('work/meet_add', data);
      }


      // 图片
      // await cloudHelper.transFormsTempPics(forms, 'meet/', meetId, 'work/meet_update_forms');

      let callback = async function () {
        if (isEdit) {
          wx.redirectTo({
            url: '../list/work_meet_list',
          });
        } else {
          wx.navigateBack();
        }
      }
      pageHelper.showSuccToast(this.data.isEdit ? '编辑成功' : '发布成功', 2000, callback);

    } catch (err) {
      console.log(err);
    }

  },

  url: function (e) {
    pageHelper.url(e, this);
  },

  onStartEndTimeChange: async function () {
    console.log("call onStartEndTimeChange:", this.data);

    if (this.data.formMeetStartTime && this.data.formMeetEndTime) {
      const occupyStartTime = timeHelper.time2Timestamp(this.data.formMeetStartTime);
      const occupyEndTime = timeHelper.time2Timestamp(this.data.formMeetEndTime);
      if (occupyStartTime >= occupyEndTime) {
        this.setData({
          formMeetStartTime: '',
          formMeetEndTime: ''
        });
        return pageHelper.showModal('课程开始时间不能晚于结束时间');
      }
      const tmpCars = await cloudHelper.callCloudData('car/get_cars', {
        carStatus: 0,
        occupyStartTime,
        occupyEndTime
      });
      console.log("tmp cars:", tmpCars);
      const tmpAvailableCars = [];
      if (!tmpCars) return;
      tmpCars.forEach((item) => {
        console.log("car item:", item);
        tmpAvailableCars.push({
          label: `${item.CAR_NAME}-${item.CAR_NUMBER}`,
          val: item.CAR_NUMBER
        });
      });
      console.log("tmpAvailableCars:", tmpAvailableCars);
      this.setData({
        availableCars: tmpAvailableCars,
      });
    }
  }


})