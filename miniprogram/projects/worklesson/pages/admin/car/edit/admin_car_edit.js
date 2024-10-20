const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js');

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
			_id: id
		};
		let opt = {
			title: 'bar'
		};
		let car = await cloudHelper.callCloudData('car/car_detail', params, opt);
		if (!car) {
			this.setData({
				isLoad: null
			})
			return;
		};

		this.setData({
			isLoad: true,

			// 表单数据 
			...car
		});
	},

	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this, true)) return;

		let data = this.data;

		// 数据校验 
		data = validate.check(data, AdminBiz.CHECK_FORM_CAR_EDIT, this);
		if (!data) return; 

		try {

			await cloudHelper.callCloudSumbit('admin/car_edit', data).then(res => {

				let callback = () => {
					// 更新列表页面数据
          wx.redirectTo({
            url: '../list/admin_car_list'
          });
				}
				pageHelper.showSuccToast('修改成功', 1500, callback);
			});


		} catch (err) {
			console.log(err);
		}

	},
})