# OpenLayers OSMWaySnap

[OpenLayers](https://openlayers.org/) extension for drawing line string with snapping to way elements from [OpenStreetMap](https://wiki.openstreetmap.org/wiki/About_OpenStreetMap) using [OverpassAPI](https://wiki.openstreetmap.org/wiki/Overpass_API).

## Instructions

```bash
npm install ol-osmwaysnap
```

Create an instance of class `OSMWaySnap` and add it to map. (Default snapping to OSM roads)

```ts
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { OSMWaySnap } from 'ol-osmwaysnap';

const targetLayer = new VectorLayer<VectorSource<Feature<LineString>>>({
  source: new VectorSource<Feature<LineString>>()
});
map.addLayer(targetLayer);

// Default: Snap to roads (OSM highway)
const interaction = new OSMWaySnap({
  source: targetLayer.getSource(),
  maximumResolution: 5,
  fetchBufferSize: 250,
  overpassEndpointURL: 'https://...' // Choose one instance from https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances
});
map.addInteraction(interaction);
```

Or specify a custom OverpassQL for different way elements, for example to railways.

```ts
// Snap to railways
const interaction = new OSMWaySnap({
  source: targetLayer.getSource(),
  maximumResolution: 5,
  fetchBufferSize: 250,
  overpassQuery: '(way["railway"];>;);',
  overpassEndpointURL: 'https://...' // Choose one instance from https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances
});
map.addInteraction(interaction);
```

Or use a custom vector source (not OSM) for snapping.

```ts
const interaction = new OSMWaySnap({
  source: targetLayer.getSource(),
  waySource: someVectorSource,
  maximumResolution: 5,
  fetchBufferSize: 250
});
map.addInteraction(interaction);
```

## Constructor Options

- `autoFocus?: boolean` - True to automatically fit map view to next candidantes. (default: true)
- `focusPadding?: number` - Used with autoFocus, specify number to add padding to view fitting. (default: 50 !PROJECTION SENSITIVE!)
- `sketchStyle?: StyleLike` - Style of sketch features (default is predefined, overwrite if necessary)
- `source: VectorSource<Feature<LineString>>` - Target source of edition
- `waySource?: VectorSource<Feature<LineString>>` - Ways source for snapping (default to a new instance of OSMOverpassWaySource)
- `createAndAddWayLayer?: boolean` - Create a new way layer from way source (if provided) and add to map (default: true)
- `wrapX?: boolean` - WrapX

If `waySource` is not provided, `OSMOverpass` will be used as source for snapping, so the constructor options for `OSMWaySnap` will be extended to include [thoses options from `OSMOverpassSourceBase`](https://github.com/ponlawat-w/ol-osmoverpass#constructor-options).

## Examples

[Full page example using the library from CDN](./examples/index.html)

### Using as module

```ts
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString'; 
import OSMWaySnap from 'ol-osmwaysnap';

const basemap = new TileLayer({ source: new OSM() });
const targetLayer = new VectorLayer<VectorSource<Feature<LineString>>>({
  source: new VectorSource()
});

const view = new View({
  center: [11018989, 2130015],
  zoom: 16
});
const map = new Map({
  target: 'map',
  layers: [basemap, targetLayer],
  view
});

const interaction = new OSMWaySnap({
  source: targetLayer.getSource(),
  maximumResolution: 5,
  fetchBufferSize: 250,
  overpassEndpointURL: 'https://...' // Choose one instance from https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances
});
mao.addInteraction(interaction);
```

### Using as CDN

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v8.2.0/ol.css">
    <style>
      #map {
        width: 100%;
        height: 90vh;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://cdn.jsdelivr.net/npm/ol@v8.2.0/dist/ol.js"></script>
    <script src="https://www.unpkg.com/ol-osmwaysnap/dist/webpack/index.js"></script>
    <script lang="js">
      const basemap = new ol.layer.Tile({ source: new ol.source.OSM() });

      const targetFeaturesLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            width: 4,
            color: '#ff0000'
          })
        })
      });

      const map = new ol.Map({
        target: 'map',
        layers: [basemap, targetFeaturesLayer],
        view: new ol.View({
          center: [11018989, 2130015],
          zoom: 16
        })
      });

      const interaction = new OSMWaySnap.OSMWaySnap({
        source: targetFeaturesLayer.getSource(),
        maximumResolution: 5,
        fetchBufferSize: 250,
        overpassEndpointURL: 'https://...' // Choose one instance from https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances
      });
      map.addInteraction(interaction);
    </script>
  </body>
</html>
```

---
