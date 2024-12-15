const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const behavior = require('./admin_meet_join_bh.js'); 

Page({

	behaviors: [behavior],

	/**
	 * 页面的初始数据
	 */
	data: {
    isLoad: false,
    oprt: 'admin'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		this._init(options);
    this.setData({
      isLoad: true,
    });
  }, 
  
  _init(options) {
    this._getSearchMenu();
    this.setData({
      _params: {
        meetId: options.id
      }
    });
  },

  _getSearchMenu: function () {
    let sortItems = [];
    let sortMenus = [{
      label: '全部',
      type: '',
      value: ''
    }, {
      label: `待使用`,
      type: 'status',
      value: 1
    },
    {
      label: `已核销`,
      type: 'status',
      value: 2
    },
    {
      label: `已取消`,
      type: 'status',
      value: 3
    },
    {
      label: `已过期`,
      type: 'status',
      value: 4
    }
    ]
    this.setData({
      sortItems,
      sortMenus
    })
  },
})