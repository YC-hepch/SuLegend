/*
 * @Descripttion: file content
 * @version: 1.0
 * @Author: 予程_hepch
 * @Date: 2022-02-23 14:33:39
 * @LastEditors: 予程_hepch
 * @LastEditTime: 2022-03-01 13:50:10
 */
/**
 * @Description: 
 * @User: 予程_hepch(1336327352@qq.com)
 * @Date: 2022-03-01 13:50:26
 *zoom_scale 比例尺层级映射关系 默认值
 */
var zoom_scale = [
    {
        zoom: 0,
        scale: 1.690163571602655e-9,
    },
    {
        zoom: 1,
        scale: 3.3803271432053056e-9,
    },
    {
        zoom: 2,
        scale: 6.760654286410611e-9,
    },
    {
        zoom: 3,
        scale: 1.3521308572821242e-8,
    },
    {
        zoom: 4,
        scale: 2.7042617145642484e-8,
    },
    {
        zoom: 5,
        scale: 5.408523429128511e-8,
    },
    {
        zoom: 6,
        scale: 1.0817046858256998e-7,
    },
    {
        zoom: 7,
        scale: 2.1634093716513974e-7,
    },
    {
        zoom: 8,
        scale: 4.3268187433028044e-7,
    },
    {
        zoom: 9,
        scale: 8.653637486605571e-7,
    },
    {
        zoom: 10,
        scale: 0.0000017307274973211203,
    },
    {
        zoom: 11,
        scale: 0.0000034614549946422405,
    },
    {
        zoom: 12,
        scale: 0.0000069229099892844565,
    },
    {
        zoom: 13,
        scale: 0.000013845819978568952,
    },
    {
        zoom: 14,
        scale: 0.000027691639957137904,
    },
    {
        zoom: 15,
        scale: 0.0000553832799142758,
    },
    {
        zoom: 16,
        scale: 0.0001107665598285516,
    },
    {
        zoom: 17,
        scale: 0.0002215331196571032,
    },
    {
        zoom: 18,
        scale: 0.0004430662393142064,
    },
    {
        zoom: 19,
        scale: 0.0008861324786284128,
    },
    {
        zoom: 20,
        scale: 0.001772264957256826,
    },
    {
        zoom: 21,
        scale: 0.003544529914513652,
    },
];
/**
 * @Description: 
 * @User: 予程_hepch(1336327352@qq.com)
 * @Date: 2022-03-01 13:45:54
 * @param {*} viewer //cesium.viewer
 * @param {*} options={
        mapUrls: [],//服务地址
        postion: "bottom-right",//位置 top-left
        maxHeight: 300,//图例内容div最大高度
        maxWidth: 300,//图例内容div最大宽度
        minWidth: 100,//图例内容div最小宽度
        minHeight: 100,//图例内容div最小高度
        title: "图例",//图例标题
    }
 */
const SmpLegend = function (viewer, options) {
    this.options = {
        mapUrls: [],
        postion: "bottom-right",
        maxHeight: 300,
        maxWidth: 300,
        minWidth: 100,
        minHeight: 100,
        title: "图例",
    };
    let LegendListArray = [];
    this.viewer = viewer;
    this.int = int;
    this.int(options);
    var mapLegendObj = [];
    const requestPng = (url, params) => {
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                datatype: "json",
                data: params,
                type: "get",
                success: function (e) {
                    //成功后回调
                    resolve(e);
                },
                error: function (e) {
                    //失败后回调
                    reject(e);
                },
                beforeSend: function () {
                    //console.log(e)
                },
            });
        });
        return promise;
    };
    const regroup = (arr, str) => {
        var map = {},
            dest = [];
        arr.map((item) => {
            if (!map[item[str]]) {
                dest.push({
                    maxScale: item[str],
                    data: [item],
                });
                map[item[str]] = item;
            } else {
                dest.filter((itemD) => itemD.maxScale == item[str])[0].data.push(item);
            }
        });
        return dest;
    };
    const regroupTitle = (arr, str) => {
        var map = {},
            dest = [];
        arr.map((item) => {
            if (!map[item[str]]) {
                dest.push({
                    title: item[str],
                    data: [item],
                });
                map[item[str]] = item;
            } else {
                dest.filter((itemD) => itemD.title == item[str])[0].data.push(item);
            }
        });
        return dest;
    };
    function int(options) {
        setOptions(this.options, options);
        addDom(this.options.title);
        initializeLegend(this.options);
        cameraHeigtChangeListener(this.viewer);
        getMapServerLegendList(this.options.mapUrls);
    }
    function setOptions(defultoptions, options) {
        for (let key in options) {
            defultoptions[key] = options[key];
        }
    }

    function setLegendContainerPostion(postionStr) {
        let element = getLegendContainer();
        if (element) {
            let postionParam = postionStr.split("-");
            element.style[postionParam[0]] = "30px";
            element.style[postionParam[1]] = "10px";
        }
    }
    function initializeLegend(options) {
        let element = getLegendContentElement();
        if (element) {
            setLegendContainerPostion(options.postion);
            element.style.maxHeight = options.maxHeight;
            element.style.minHeight = options.minHeight;
            element.style.maxWidth = options.maxWidth;
            element.style.minWidth = options.minWidth;
        }
    }
    function addDom(title) {
        let legendContainer = getMapViewerElement();
        if (legendContainer) {
            let element = document.createElement("div");
            element.className = "supermap-cesium-legend-container";
            let html = `<div class='legend-header'><div class='legend-header-content'>${title}</div></div ><div class='legend-content'></div><div class='legend-footer'></div>`;
            element.innerHTML = html;
            legendContainer.appendChild(element);
        }
    }
    function showNoLegenddiv() {
        let element = document.createElement("div");
        element.innerText = "未插入图例";
        getLegendContentElement().appendChild(element);
    }
    function showLegendInfo(array) {
        let records = array;
        let element = getLegendContentElement();
        if (element) {
            element.innerHTML = "";
            records.map((item) => {
                let node = addLayerLegendDom(item);
                if (node) element.appendChild(node);
            });
        }
    }
    function addLayerLegendDom(obj) {
        let element = document.createElement("div");
        let html = `<div class='legend-content-title'>${obj.title}</div>`;
        obj.legendList.map((item) => {
            html += ` <div class="single-legend-bar"><img height=25,width=25, src=${item.symbol} class="single-legend-sym"></img><span
        class="single-legend-name">${item.name}</span></div>`;
        });
        element.innerHTML = html;
        return element;
    }
    function getMapViewerElement() {
        let element = document.getElementsByClassName("cesium-viewer");
        if (element && element[0]) {
            return element[0];
        }
        return undefined;
    }
    function getLegendContentElement() {
        let element = document.getElementsByClassName("legend-content");
        if (element && element[0]) {
            return element[0];
        }
        return undefined;
    }
    function getLegendContainer() {
        let element = document.getElementsByClassName(
            "supermap-cesium-legend-container"
        );
        if (element && element[0]) {
            return element[0];
        }
        return undefined;
    }
    function cameraHeigtChangeListener(viewer) {
        viewer.scene.camera.moveEnd.addEventListener(function () {
            let height = viewer.camera.positionCartographic.height;
            changeLegend(height);
        });
    }
    async function getMapServerLegendList(mapUrls) {
        mapLegendObj = [];
        showNoLegenddiv();
        if (mapUrls.length) {
            let promiseArry = mapUrls.map(async (item) => {
                let data = await getLayersInfo(item);
                let obj = getLayerSubLayers(data, item);
                let array = await getLayersLegendList(obj);
                //  console.log(data, obj, array)
                mapLegendObj.push({
                    title: obj.mapName,
                    mapUrl: obj.mapUrl,
                    layers: obj.layers,
                    legendList: array,
                });
            });
            await Promise.all(promiseArry);
            sortLegendData(mapLegendObj);
        }
    }
    async function getLayersLegendList(mapLayersInfo) {
        let array = [];
        let vectorLayers = mapLayersInfo.layers.filter(
            (item) => item.ugcLayerType != "THEME"
        );
        let labelLayers = mapLayersInfo.layers.filter(
            (item) => item.ugcLayerType == "THEME" && item.theme.type == "LABEL"
        );
        let themeLayers = mapLayersInfo.layers.filter(
            (item) => item.ugcLayerType == "THEME" && item.theme.type != "LABEL"
        );
        // console.log(
        //     "矢量",
        //     vectorLayers,
        //     "标签：",
        //     labelLayers,
        //     "专题图：",
        //     themeLayers
        // );
        if (themeLayers)
            promiseArry = themeLayers.map(async (item) => {
                let itemF = item;
                let themes = item.theme.items;
                let type = item.datasetInfo.type;
                console.log(type);
                promiseArr = themes.map(async (item) => {
                    let stylejson = item.style;
                    let data = await switchVectorType(
                        mapLayersInfo.mapUrl,
                        type,
                        stylejson
                    );
                    array.push({
                        maxScale: itemF.maxScale,
                        minScale: itemF.minScale,
                        symbol: data.resourceImageUrl,
                        name: item.caption,
                    });
                });
                await Promise.all(promiseArr);
            });
        await Promise.all(promiseArry);
        if (vectorLayers)
            vectorLayers.map((item) => {
                array.push({
                    maxScale: item.maxScale,
                    minScale: item.minScale,
                    symbol: `${mapLayersInfo.mapUrl}/layers/${item.name.replace(
                        "#",
                        "."
                    )}@@${mapLayersInfo.mapName}/legend.png?width=25&height=25`,
                    name: item.name,
                });
            });
        return array;
    }
    function switchVectorType(mapUrl, key, stylejson) {
        let type = key;
        let url = mapUrl + "/symbol.json";
        let params = {
            resourceType: "SYMBOL" + key,
            style: JSON.stringify(stylejson),
            transparent: false,
        };
        switch (type) {
            case "LINE":
                return getVectorLineSymbol(url, params);
            case "POINT":
                params.resourceType = "SYMBOL" + "MARKER";
                return getVectorPointSymbol(url, params);
            case "REGION":
                params.resourceType = "SYMBOL" + "FILL";
                return getVectorPolygonSymbol(url, params);
            case "Theme":
                return getThemeLayerSymbol(url, params);

            default:
                return undefined;
        }
    }

    function getVectorPointSymbol(mapUrl, params) {
        let promise = requestPng(mapUrl, params);
        return promise;
    }
    function getVectorLineSymbol(mapUrl, params) {
        let promise = requestPng(mapUrl, params);
        return promise;
    }
    function getVectorPolygonSymbol(mapUrl, params) {
        let promise = requestPng(mapUrl, params);
        return promise;
    }
    function getThemeLayerSymbol(mapUrl, params) {
        let promise = requestPng(mapUrl, params);
        return promise;
    }
    function getLayersInfo(mapUrl) {
        if (mapUrl && mapUrl != "") {
            // 请求data1
            var promise = new Promise(function (resolve, reject) {
                $.ajax({
                    url: `${mapUrl}/layers.json`,
                    datatype: "json",
                    type: "get",
                    success: function (e) {
                        //成功后回调
                        resolve(e);
                    },
                    error: function (e) {
                        //失败后回调
                        reject(e);
                    },
                    beforeSend: function () {
                        //console.log(e)
                    },
                });
            });
            return promise;
        }
    }
    function getLayerSubLayers(result, url) {
        let layers = result[0].subLayers.layers;
        let mapName = result[0].name;
        return {
            layers: layers,
            mapName: mapName,
            mapUrl: url,
        };
    }
    function changeLegend(height) {
        var height = Math.ceil(height);
        var zoom = heightToZoom(height);
        // console.log('zoom', zoom)
        let scale = zoomToScale(zoom);
        getCurrentScaleLegendlist(scale);
        // showLegendInfo(mapLegendObj)
    }
    function getCurrentScaleLegendlist(scale) {
        let LisData = [];
        const returnList = (array) => {
            let arr = [];
            array.map((item) => {
                item.level.map((item) => {
                    arr.push(item);
                });
            });
            return arr;
        };
        LegendListArray.map((item) => {
            let array = item.data.filter(
                (item) => scale > item.minScale && scale < item.maxScale
            );
            if (array && array.length) {
                //  console.log("arr", returnList(array))
                LisData.push({
                    title: item.title,
                    legendList: returnList(array),
                });
            } else {
                //默认加载样式
                LisData.push({
                    title: item.title,
                    legendList: item.data[0].level,
                });
            }
        });
        //console.log("LisData", LisData)
        showLegendInfo(LisData);
    }
    function zoomToScale(zoom) {
        let item = zoom_scale.filter((item) => item.zoom == zoom)[0];
        return item.scale;
    }
    //TODO
    function heightToZoom(height) {
        var A = 40487.57;
        var B = 0.00007096758;
        var C = 91610.74;
        var D = -40467.74;
        return Math.round(D + (A - D) / (1 + Math.pow(height / C, B)));
    }
    function jsonsort(obj, key) {
        for (var i = 0; i < obj.length; i++) {
            for (var j = i + 1; j < obj.length; j++) {
                if (obj[i][key] > obj[j][key]) {
                    var temp = obj[i];
                    obj[i] = obj[j];
                    obj[j] = temp;
                }
            }
            // if (obj[i].childre.length) this.jsonsort(obj[i].children);
        }
        return obj;
    }
    function getBaseLog(y) {
        return Math.log(y) / Math.log(2);
    }
    function altitudeToZoom(altitude) {
        var _earthRadius = 6378137;
        var altitude = _earthRadius;
        var clientWidth = document.getElementById("mapViewer").clientWidth;
        boundsWidth = ((altitude + _earthRadius) * 60) / _earthRadius;
        var resolution = boundsWidth / clientWidth;
        var y = 1.40625 / resolution;
        var zoom = getBaseLog(y);
        console.log("zoom", Math.round(zoom));
        return Math.round(zoom);
    }
    function sortLegendData(array) {
        LegendListArray = [];
        let list = [];
        array.map((item) => {
            let obj = item;
            regroup(obj.legendList, "minScale").map((item) => {
                regroup(item.data, "maxScale").map((item) => {
                    list.push({
                        title: obj.title,
                        level: item.data,
                        maxScale: item.maxScale,
                        minScale: item.data[0].minScale,
                    });
                });
            });
        });
        list = regroupTitle(list, "title");
        list.map((item) => {
            jsonsort(item.data, "maxScale");
        });
        list.map((item) => {
            LegendListArray.push({
                title: item.title,
                data: item.data,
            });
        });
        let height = viewer.camera.positionCartographic.height;
        changeLegend(height);
        // let showfirstLisData = [];
        // LegendListArray.map((item) => {
        //     showfirstLisData.push({
        //         title: item.title,
        //         legendList: item.data[0].level,
        //     });
        // });
        // showLegendInfo(showfirstLisData);
    }
};
