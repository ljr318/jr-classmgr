const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cacheHelper = require('../../../../../../helper/cache_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const projectSetting = require('../../../../public/project_setting.js');


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		curIdx: -1,

		checkModalShow: false,
		formReason: '',

		lessonModalShow: false,
		lessonType: '增加',
		formLessonChangeCnt: 0,
		formLessonDesc: '',


	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		//设置搜索菜单
		await this._getSearchMenu();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () { },

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

	url: async function (e) {
		pageHelper.url(e, this);
	},


	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	bindDelTap: async function (e) {
		if (!AdminBiz.isAdmin(this, true)) return;

		let id = e.currentTarget.dataset.id;
		if (!id) return;

		let params = {
			_id: id,
		}

		let callback = async () => {
			try {
				await cloudHelper.callCloudSumbit('admin/car_del', params).then(res => {
					pageHelper.delListNode(id, this.data.dataList.list, '_id');
					this.data.dataList.total--;
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('删除成功', 2000);
				});

			} catch (e) {
				console.log(e);
			}
		}
		pageHelper.showConfirm('确认删除？删除不可恢复', callback);
	},


	_getSearchMenu: async function () {

		let sortItems1 = [
			{ label: '创建时间', type: '', value: '' },
			{ label: '创建时间正序', type: 'sort', value: 'CREATE_TIME|asc' },
			{ label: '创建时间倒序', type: 'sort', value: 'CREATE_TIME|desc' },
		];
		let sortMenus = [
			{ label: '全部', type: '', value: '' },
			{ label: '正常', type: 'status', value: 0 },
			{ label: '停用', type: 'status', value: 1 }
		]

		this.setData({
			search: '',
			sortItems: [sortItems1],
			sortMenus,
			isLoad: true
		})


	}

})