const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const PublicBiz = require('../../../../../../comm/biz/public_biz.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js'); 

Page({

	/** 
	 * 页面的初始数据
	 */
	data: {
    isLoad: false,
    teacherName: '',
    teacherNameFocus: false,
    phoneNumber: '',
    phoneNumberFocus: false,
    password: '',
    passwordFocus: false,
    // formAvatar: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;
 
		this.setData({
			isLoad: true
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

	model: function (e) {
		pageHelper.model(this, e);
	},

	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let data = this.data;

		let rules = {
			CAR_NAME: 'CAR_NAME|must|string|min:2|max:20|name=车辆名称',
			CAR_NUMBER: 'CAR_NUMBER|must|string|min:7|max:8||name=车牌号',
		}
		data = validate.check(data, rules, this);

		if (!data) return;
    console.log('teacher form data: ', data);
		try {
			await cloudHelper.callCloudSumbit('admin/car_insert', data).then(res => {

				let callback = async function () {
          wx.redirectTo({
            url: '../list/admin_car_list'
          });
				}
				pageHelper.showSuccToast('添加成功', 2000, callback);
			});


		} catch (err) {
			console.log(err);
		}

	},


})