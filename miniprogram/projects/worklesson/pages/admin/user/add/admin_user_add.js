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

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;
 
		this.setData({
      isLoad: true,
      STUDENT_TYPE: 1,
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
			STUDENT_NAME: 'STUDENT_NAME|must|string|min:2|max:20|name=姓名',
			PHONE_NUMBER: 'PHONE_NUMBER|must|string|len:11|name=手机',
			MEMBERSHIP_USAGE_TIMES: 'MEMBERSHIP_USAGE_TIMES|must|int|name=可用课时数',
			STUDENT_TYPE: 'STUDENT_TYPE|must|int|name=学员类型',
		}
		data = validate.check(data, rules, this);

		if (!data) return;

		try {
			await cloudHelper.callCloudSumbit('admin/user_insert', data).then(res => {
        console.log('Insert data succ:', data);
				let callback = async function () {
					PublicBiz.removeCacheList('admin-user-list');
					wx.navigateBack();
				}
				pageHelper.showSuccToast('添加成功', 2000, callback);
			});


		} catch (err) {
			console.log(err);
		}

	},


})