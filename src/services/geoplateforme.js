import logger from '../logger.js';

export async function getAltitudeByLocation(lon,lat){
    const url = `https://data.geopf.fr/altimetrie/1.0/calcul/alti/rest/elevation.json?lon=${lon}&lat=${lat}&resource=ign_rge_alti_wld`;
    logger.info(`[HTTP-GET] ${url} ...`);
    const json = await fetch(url).then(res => res.json());
    return {
        lon: lon,
        lat: lat,
        altitude: json.elevations.length == 0 ? null : json.elevations[0].z,
        source: "data.geopf.fr - altimetrie"
    };
}




