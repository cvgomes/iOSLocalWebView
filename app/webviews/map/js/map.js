(function(wvi) {
    
    var map, marker;

    window.init = function(language,x,y,zoom){
        initMap(language, [x,y], zoom);
        initInteractions();
    }

    window.centerMap = function(x,y){
        marker.getGeometry().setCoordinates([x,y]);
        map.getView().setCenter([x,y]);
    };


    //Style definition for OL
    function getStyles(feature){
        return new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: 'images/pin.png'
            }))
        });
    };

    function initMap(language, coordinate, zoom){

        //Configure projection
        proj4.defs(
            'EPSG:31370',
            '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013'
            +
            '+y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs'
        );
        ol.proj.setProj4(proj4);
        

        //Create marker
        marker = new ol.Feature({
            geometry: new ol.geom.Point(coordinate)
        });


        //Create vector layer to hold marker
        var vectorLayerSource = new ol.source.Vector({});    
        vectorLayerSource.clear;(true);
        vectorLayerSource.addFeatures([marker]);


        //Create base WMS layer
        var baseLayerSource = new ol.source.TileWMS({
                url: "https://geoservices-urbis.irisnet.be/geoserver/wms",
                params: {'LAYERS': 'urbis'+language.toUpperCase()},
                projection: 'EPSG:31370',
                serverType: 'geoserver'
            });


        //Create Map
        map = new ol.Map({
                target: 'map',
                layers: [
                    new ol.layer.Tile({
                        source: baseLayerSource
                    }),
                    new ol.layer.Vector({
                        source: vectorLayerSource,
                        style: getStyles
                    })
                ],
                view: new ol.View({
                    projection: 'EPSG:31370',
                    center: coordinate,
                    zoom: zoom,
                    minZoom: 12,
                    maxZoom: 19
                }),
                controls: []
            }); 
        //map.getView().fit(vectorLayerSource.getExtent(), map.getSize());  
    }





    function initInteractions(){
        wvi.emit("log","@initInteractions");
        //center map where user taps somewhere
        map.on("click", function(e){
            marker.getGeometry().setCoordinates(e.coordinate);
            map.getView().animate({
                center: marker.getGeometry().getCoordinates(),
                duration: 200
            });
            wvi.emit('newCoordinate', e.coordinate);
        });


        //Allow the marker to be moved and center the map where user drops it
        var modifyInteraction = new ol.interaction.Modify({
                    features: new ol.Collection([ marker ]),
                    pixelTolerance: 50,
                    style: getStyles
                });

        modifyInteraction.on("modifyend", function(e){
            var coordinate = marker.getGeometry().getCoordinates();
            map.getView().animate({
                center: coordinate,
                duration: 200
            });
            wvi.emit('newCoordinate', coordinate);
        });
        map.addInteraction(modifyInteraction);
    }

})(nsWebViewInterface);