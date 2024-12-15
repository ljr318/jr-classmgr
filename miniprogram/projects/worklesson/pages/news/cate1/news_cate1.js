let behavior = require('../../../../../comm/behavior/news_index_bh.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const NewsBiz = require('../../../biz/news_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	behaviors: [behavior],

	onLoad: async function (options) {
    ProjectBiz.initPage(this);
    if (!await PassportBiz.loginMustBackWin(this)) return;
		this._setCate(NewsBiz.getCateList(), options, 1);
	},
})