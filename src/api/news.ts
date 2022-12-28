import axios from "axios";
import { Request, Response } from "express";

//newscatcher API
export function getNews(request: Request, response: Response) {
    const API_KEY = "";
    const searchTerms = "Apple Microsoft Google";
    const newsCatcherUrl = `https://api.newscatcherapi.com/v2/search?q=${searchTerms}`;
    axios.get(newsCatcherUrl, {
        method: "GET",
        headers: {
            'x-api-key':`${API_KEY}`
        }
    }).then(result => response.send(result.data));


}