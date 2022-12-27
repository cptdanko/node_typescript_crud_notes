import axios from "axios";
import { Request, Response } from "express";

//newscatcher API
export function getNews(request: Request, response: Response) {

    const API_KEY = "gftJDka4UDSVnFoB5HH2jtacaG29n42pe-hIg1ScikI";
    const searchTerms = "Apple Microsoft Google";
    const newsCatcherUrl = `https://api.newscatcherapi.com/v2/search?q=${searchTerms}`;
    console.log("about to search for url");
    const topic = "Sydney and NSW and Weather";
    const url = newsCatcherUrl;
    axios.get(newsCatcherUrl, {
        method: "GET",
        headers: {
            'x-api-key':`${API_KEY}`
        }
    }).then(result => response.send(result.data));


}