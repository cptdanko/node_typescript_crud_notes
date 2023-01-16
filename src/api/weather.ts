import axios from "axios";
import { Request, Response } from "express";
/**
 * get weather from OpenWeatherMaps
 */


const OPEN_WEATHER_MAP_API = "https://api.openweathermap.org/data/2.5/weather";

export async function getWeather(request: Request, response: Response) {
    const city = request.query && request.query.city;
    const WEATHER_KEY = process.env.OPEN_WEATHER_MAP_KEY ?? "";
    const units = 'metric';
    const defaultLang = 'en';
    const url = `${OPEN_WEATHER_MAP_API}?q=${city}&appid=${WEATHER_KEY}&units=${units}&lang=${defaultLang}`;
    console.log(`Url used to get Weather => ${url}`);
    axios.get(url, {
        method: 'GET',
    }).catch((err:any) => {
        console.log("Error occured in FETCH WEATHER");
        console.log(url);
        console.log(JSON.stringify(err));
        response.json(err.message).status(err.status);
    }).then((res:any) => {
        response.json(res.data).status(200);
    });
}