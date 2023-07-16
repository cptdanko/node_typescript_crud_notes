import fetch from 'node-fetch';
import { Request, Response } from "express"
import "dotenv/config";

const API_KEY = process.env.EXCHANGERATES_API_KEY; 
const COUNTRY_CODE_DEFAULT = process.env.COUNTRY_CODE_DEFAULT ?? "aud";
const BASE_URL = "https://v6.exchangerate-api.com/v6/";


export function getDefaultExchangeRates(request: Request, response: Response) {
    const url = `${BASE_URL}/${API_KEY}/latest/${COUNTRY_CODE_DEFAULT}`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        response.status(200).send(data);
    });
}

export function getExchangeRateFor(request: Request, response: Response) {
    const cCode = (request.params && request.params.country_code) ?? COUNTRY_CODE_DEFAULT;
    const url = `${BASE_URL}/${API_KEY}/latest/${cCode}`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        response.status(200).send(data);
    });

}


export async function convertAmount(request: Request, response: Response) {
    const fromCode = request.params && request.params.from_code;
    let toCode = request.params && request.params.to_code;
    let amount = request.params && request.params.amount;
    if(!fromCode || !toCode || !amount) {
        response.status(400).send("Insufficient params supplied");
    }
    
    //const amount
    const url = `${BASE_URL}/${API_KEY}/latest/${fromCode}`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        const conversionRate = data.conversion_rates[toCode.toUpperCase()];
        const convertedVal = Number(amount) * Number(conversionRate);
        response.status(200).send({"conversion": convertedVal});
    });
}