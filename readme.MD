1.引入SupermapMapLayerCesiumLegend.js和legend.css文件
2. var legend = new SmpLegend(viewer, {
            mapUrls: ["http://hz.supermap.group:8092/iserver/services/map-HNJT_SY_2020_HD/rest/maps/SY_2020_HD_W"],
            maxHeight: 300,
            maxWidth: 300,
            minWidth: 100,
            minHeight: 100,
            title: "图例"
        })
传入参数 图例内容容器的最大最小宽高，图例标题title 地图服务地址数组
具体见接口注释和demo示例