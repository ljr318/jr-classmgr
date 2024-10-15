 /**
  * Notes: UGC内容校验
  * Ver : CCMiniCloud Framework 2.4.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
  * Date: 2023-11-14 07:48:00 
  */

 const cloudHelper = require('../helper/cloud_helper.js');
 const pageHelper = require('../helper/page_helper.js');
 const setting = require('../setting/setting.js');

 /**
  * 图片类型校验
  * @param {*} fileName 
  * @param {*} type 
  */
 function imgTypeCheck(path, type = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG']) {
   let fmt = path.split(".")[(path.split(".")).length - 1];
   if (type.indexOf(fmt) > -1)
     return true;
   else
     return false;
 }

 /**
  * 图片大小校验
  * @param {*} size 
  * @param {*} maxSize 
  */
 function imgSizeCheck(size, maxSize) {
   return size < maxSize;
 }

 async function imgCheckCloud(imgBufferBase64, opt) {
   let PID = pageHelper.getPID();
   console.log('imgBufferBase64:', imgBufferBase64);
   //  const tmpImgCDNLink = await wx.cloud.CDN({
   //    type: 'filePath',
   //    filePath: path,
   //  });
   //  console.log('tmp cdn link:', tmpImgCDNLink);
   const result = await new Promise((resolve, reject) => {
     wx.cloud.callFunction({
       name: 'jrclassmgrsvr',
       data: {
         route: 'check/img',
         token: '',
         params: {
           img: imgBufferBase64
         },
         PID
       },
       success: function (res) {
         console.log(res)
         console.log('succ')
         return resolve(true);
       },
       fail: function (res) {
         console.log('img check cloud failed.')
         console.log(res)
         return resolve(false);
       },
       complete: function (res) {

       }
     });
   });
   return result;
 }

 /**
  * 图像校验
  * @param {*} imgData 
  */
 async function imgCheck(imgData) {

   let result = await wx.serviceMarket.invokeService({
     service: 'wxee446d7507c68b11',
     api: 'imgSecCheck',
     data: {
       "Action": "ImageModeration",
       "Scenes": ["PORN", "POLITICS", "TERRORISM"],
       "ImageUrl": new wx.serviceMarket.CDN({
         type: 'filePath',
         filePath: imgData,
       }),
       "ImageBase64": '',
       "Config": "",
       "Extra": ""
     },
   }).then(res => {
     if (res && res.data && res.data.Response &&
       res.data.Response.PornResult && res.data.Response.PornResult.Suggestion === 'PASS' &&
       res.data.Response.PoliticsResult && res.data.Response.PoliticsResult.Suggestion === 'PASS' &&
       res.data.Response.TerrorismResult && res.data.Response.TerrorismResult.Suggestion === 'PASS')
       return true;
     else
       return false;
   }).catch(err => {
     console.log(err);
     return false;
   });

   return result;
 }


 module.exports = {
   imgCheck,
   imgCheckCloud,
   imgTypeCheck,
   imgSizeCheck
 }