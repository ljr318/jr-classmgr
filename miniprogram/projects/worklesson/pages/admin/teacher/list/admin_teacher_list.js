const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cacheHelper = require('../../../../../../helper/cache_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const projectSetting = require('../../../../public/project_setting.js');

const CACHE_USER_CHECK_REASON = 'CACHE_USER_CHECK_REASON';

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
			id,
		}

		let callback = async () => {
			try {
				await cloudHelper.callCloudSumbit('admin/teacher_del', params).then(res => {
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



	bindCheckCmpt: async function () {
		let e = {
			currentTarget: {
				dataset: {
					status: 8,
					idx: this.data.curIdx
				}
			}
		}
		cacheHelper.set(CACHE_USER_CHECK_REASON, this.data.formReason, 86400 * 365);
		await this.bindStatusTap(e);
	},

	bindStatusTap: async function (e) {
		if (!AdminBiz.isAdmin(this, true)) return;

		let id = pageHelper.dataset(e, 'id');
		let status = pageHelper.dataset(e, 'status');
		if (!id || !status) return;
		status = Number(status);

		let params = {
			id,
			status
		}

		let that = this;
		try {
			await cloudHelper.callCloudSumbit('admin/teacher_status', params).then(res => {
				pageHelper.modifyListNode(id, that.data.dataList.list, 'STATUS', status, '_id');
				that.setData({
					dataList: that.data.dataList,
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},


	bindLessonTap: async function (e) {
		let curIdx = pageHelper.dataset(e, 'idx');
		let lessonType = pageHelper.dataset(e, 'type');

		this.setData({
			formLessonChangeCnt: '',
			curIdx,
			lessonModalShow: true,
			lessonType,
			formLessonDesc: '',
		});

	},


	bindLessonCmpt: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let idx = this.data.curIdx;

		let dataList = this.data.dataList;
		let id = dataList.list[idx].USER_MINI_OPENID;

		let lessonChangeCnt = Math.abs(Number(this.data.formLessonChangeCnt.trim()));
		if (!lessonChangeCnt) return pageHelper.showModal('课时数不能为空或者小于等于0');


		let params = {
			id,
			lessonChangeCnt,
			lessonType: this.data.lessonType,
			lessonDesc: this.data.formLessonDesc
		}

		try {
			await cloudHelper.callCloudSumbit('admin/meet_user_lesson', params).then(res => {
				let lessonType = this.data.lessonType;
				let cnt = 0;
				if (lessonType == '减少')
					cnt = -Number(this.data.formLessonChangeCnt) + Number(this.data.dataList.list[idx].USER_LESSON_TOTAL_CNT);
				else
					cnt = Number(this.data.formLessonChangeCnt) + Number(this.data.dataList.list[idx].USER_LESSON_TOTAL_CNT);


				this.setData({
					['dataList.list[' + idx + '].USER_LESSON_TOTAL_CNT']: cnt,
					lessonModalShow: false,
					formLessonChangeCnt: '',
					curIdx: -1,
					lessonType: '增加',
					formLessonDesc: ''
				});
				pageHelper.showSuccToast('课时' + lessonType + '成功');
			});

		}
		catch (e) {
			console.log(e);
		}
	},

	_getSearchMenu: async function () {

		let sortItems1 = [
			// { label: '创建时间', type: '', value: '' },
			// { label: '创建时间正序', type: 'sort', value: 'USER_ADD_TIME|asc' },
			// { label: '创建时间倒序', type: 'sort', value: 'USER_ADD_TIME|desc' },
		];
		let sortMenus = [
			{ label: '全部', type: '', value: '' },
			{ label: '在岗', type: 'status', value: 1 },
			{ label: '离岗', type: 'status', value: 2 }
		]


		this.setData({
			search: '',
			// sortItems: [sortItems1],
			sortMenus,
			isLoad: true
		})


	}

})