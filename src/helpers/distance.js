import { distance as distancePointToPoint } from "@turf/distance";
import { pointToLineDistance } from "@turf/point-to-line-distance";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import {point,lineString, polygon} from "@turf/turf";

function pointToPolygonDistance(gA,gB){
    if ( booleanPointInPolygon(gA,gB) ){
        return 0.0;
    }
    let result = Number.POSITIVE_INFINITY;
    for ( const coordinates of gB.coordinates ){
        result = Math.min(
            result,
            pointToLineDistance(gA,lineString(coordinates))
        );
    }
    return result;
}

function distancePointToMultiPoint(gA,gB){
    let result = Number.POSITIVE_INFINITY;
    for ( const coordinates of gB.coordinates ){
        result = Math.min(
            result,
            distancePointToPoint(gA,{
                type: "Point",
                coordinates: coordinates
            })
        );
    }
    return result;
}

function distancePointToMultiLineString(gA,gB){
    let result = Number.POSITIVE_INFINITY;
    for ( const coordinates of gB.coordinates ){
        result = Math.min(
            result,
            pointToLineDistance(gA,{
                type: "LineString",
                coordinates: coordinates
            })
        );
    }
    return result;
}

function distancePointToMultiPolygon(gA,gB){
    let result = Number.POSITIVE_INFINITY;
    for ( const coordinates of gB.coordinates ){
        result = Math.min(
            result,
            pointToPolygonDistance(gA,{
                type: "Polygon",
                coordinates: coordinates
            })
        );
    }
    return result;
}

function distancePointToGeometry(gA,gB){
    if ( gB.type == "Point" ){
        return distancePointToPoint(gA,gB);
    }else if ( gB.type == "LineString" ){
        return pointToLineDistance(gA,gB);
    }else if ( gB.type == "Polygon" ){
        return pointToPolygonDistance(gA,gB);
    }else if ( gB.type == "MultiPoint" ){
        return distancePointToMultiPoint(gA,gB);
    }else if ( gB.type == "MultiLineString" ){
        return distancePointToMultiLineString(gA,gB);
    }else if ( gB.type == "MultiPolygon" ){
        return distancePointToMultiPolygon(gA,gB);
    }else{
        throw new Error("gB type not suppport ("+gB.type+")");
    }
}

export default function distance(gA,gB){
    if ( gA.type != "Point" ){
        throw new Error("gA must be of type Point");
    }
    return distancePointToGeometry(gA,gB);
}

