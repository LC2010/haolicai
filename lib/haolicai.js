var request = require('request');
var cheerio = require('cheerio');
var Table = require('cli-table');

module.exports = function() {
    // 今日推荐
    var todayRecoTable = new Table({
        head: ['今日推荐', '收益信息']
    });

    // 高收益推荐
    var highRateTable = new Table({
        head: ['高收益推荐', '收益信息']
    });

    var options = {
        url: 'http://licai.360.cn/'
    };

    request(options, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var parseInfo = parse(body);
            // var todayRecoInfo = parseInfo.todayRecoInfo;
            // renderTodyRecoTable(todayRecoInfo);
            var otherRecoInfo = parseInfo.otherRecoInfo;
            renderOtherRecoTable(otherRecoInfo);
        }
    });

    // 渲染今日推荐表格
    function renderTodyRecoTable(info) {
        for (var i = 0, l = info.length; i < l; i++) {
            todayRecoTable.push([info[i].title, info[i].desc]);
        }
        console.log(todayRecoTable.toString());        
    }

    // 渲染其它类别的表格
    function renderOtherRecoTable(info) {
        for (var i = 0, l = info.length; i < l; i++) {
            var table = new Table({
                head: [info[i].name.trim(), '收益信息']
            });

            for (var j = 0, data = info[i]['data'], len = data.length; j < len; j++) {
                table.push([data[j].title, data[j].desc]);
            }

            console.log(table.toString());
        }
    }

    // 提取有用信息
    function parse(body) {
        var $ = cheerio.load(body);
        // 今日推荐
        // var todayRecoArr = [];
        // var dayReco = $("div.slide-content .slide-section");
        // dayReco.each(function (index, section) {
        //     var title = $(section).find('.slide-name').text();
        //     var descs = $(section).find('.slide-txt');
        //     var descArr = [];
        //     descs.each(function (index, desc) {
        //         descArr.push($(desc).text().replace('%', '% '));
        //     });
        //     todayRecoArr.push({
        //         title : title,
        //         desc: descArr.join('  ')
        //     });
        // });
        // 其它推荐
        var otherRecoArr = [];
        var modules = $('#doc-main-bd > .f-l .module');
        modules.each(function (index, module) {
            var moduleMap = {};
            var moduleName = $(module).find('.module-title').text();
            var productItem = $(module).find('.product-item');
            moduleMap['name'] = moduleName;
            moduleMap['data'] = [];
            productItem.each(function (index, item) {
                var descs = $(item).find('.product-yield');
                var descArr = [];
                descs.each(function (index, desc) {
                    descArr.push($(desc).find('.yield').text() + ' ' + $(desc).find('span.txt').text());
                });
                moduleMap['data'].push({
                    title : $(item).find('.product-name').text(),
                    desc : descArr.join('  ')
                });
            });
            otherRecoArr.push(moduleMap);
        });

        return {
            // todayRecoInfo : todayRecoArr,
            otherRecoInfo : otherRecoArr
        };
    }


};