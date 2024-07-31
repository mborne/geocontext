import logger from '../logger.js';

/**
 * Get altitude for a given location.
 * 
 * @param {number} lon 
 * @param {number} lat 
 * @returns 
 */
export async function getAltitudeByLocation(lon, lat) {
    const url = `https://data.geopf.fr/altimetrie/1.0/calcul/alti/rest/elevation.json?lon=${lon}&lat=${lat}&resource=ign_rge_alti_wld`;
    logger.info(`[HTTP-GET] ${url} ...`);
    const json = await fetch(url).then(res => res.json());
    return {
        lon: lon,
        lat: lat,
        altitude: json.elevations.length == 0 ? null : json.elevations[0].z,
        source: "Géoplateforme (altimetrie)"
    };
}



const ADMINEXPRESS_TYPES = [
    'commune', 
    'canton',
    'collectivite_territoriale',
    'epci',
    'departement',
    'region', 
    'arrondissement'
];

/**
 * Get administrative units (commune, departement,...) intersecting a given location
 *
 * @param {number} lon 
 * @param {number} lat 
 * @returns 
 */
export async function getAdminUnits(lon, lat) {
    // note that EPSG:4326 means lat,lon order for GeoServer -> flipped coordinates...
    const cql_filter = `INTERSECTS(geom,Point(${lat} ${lon}))`;

    // TODO : avoid useless geometry retrieval at WFS level
    const url = 'https://data.geopf.fr/wfs?' + new URLSearchParams({
        service: 'WFS',
        request: 'GetFeature',
        typeName: ADMINEXPRESS_TYPES.map((type) => { return `ADMINEXPRESS-COG.LATEST:${type}` }).join(','),
        outputFormat: 'application/json',
        cql_filter: cql_filter
    }).toString();

    logger.info(`[HTTP-GET] ${url} ...`);

    const featureCollection = await fetch(url).then(res => res.json());
    return featureCollection.features.map((feature) => {
        // parse type from id (ex: "commune.3837")
        const type = feature.id.split('.')[0];
        // ignore geometry and extend properties
        return Object.assign({
            type: type,
            id: feature.id,
            bbox: feature.bbox,
            source: "Géoplateforme (WFS, ADMINEXPRESS-COG.LATEST)",
        }, feature.properties);
    });
}

// CADASTRALPARCELS.PARCELLAIRE_EXPRESS:
// https://data.geopf.fr/wfs/ows?service=WFS&version=2.0.0&request=GetCapabilities
const PARCELLAIRE_EXPRESS_TYPES = [
    'arrondissement', 
    'commune',
    'feuille',
    'parcelle',
    'subdivision_fiscale'
];

/**
 * Get administrative units (commune, departement,...) intersecting a given location
 *
 * @param {number} lon 
 * @param {number} lat 
 * @returns 
 */
export async function getParcellaireExpress(lon, lat) {
    // note that EPSG:4326 means lat,lon order for GeoServer -> flipped coordinates...
    const cql_filter = `INTERSECTS(geom,Point(${lat} ${lon}))`;

    // TODO : avoid useless geometry retrieval at WFS level
    const url = 'https://data.geopf.fr/wfs?' + new URLSearchParams({
        service: 'WFS',
        request: 'GetFeature',
        typeName: PARCELLAIRE_EXPRESS_TYPES.map((type) => { return `CADASTRALPARCELS.PARCELLAIRE_EXPRESS:${type}` }).join(','),
        outputFormat: 'application/json',
        cql_filter: cql_filter
    }).toString();

    logger.info(`[HTTP-GET] ${url} ...`);

    const featureCollection = await fetch(url).then(res => res.json());
    return featureCollection.features.map((feature) => {
        // parse type from id (ex: "commune.3837")
        const type = feature.id.split('.')[0];
        // ignore geometry and extend properties
        return Object.assign({
            type: type,
            id: feature.id,
            bbox: feature.bbox,
            source: "Géoplateforme (WFS, CADASTRALPARCELS.PARCELLAIRE_EXPRESS)",
        }, feature.properties);
    });
}



