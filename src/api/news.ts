import axios from "axios";
import { Request, Response } from "express";

//newscatcher API
export function getNews(request: Request, response: Response) {
    console.log("In getNews function");
    const API_KEY = process.env.NEWS_CATCHER_KEY;
    const searchTerms = "Apple Microsoft Google";
    const newsCatcherUrl = `https://api.newscatcherapi.com/v2/search?q=${searchTerms}`;
    console.log(newsCatcherUrl);
    axios.get(newsCatcherUrl, {
        headers: {
            'x-api-key':`${API_KEY}`
        }
    })
    .then(result => {
        response.json(result.data).status(200);
    })
    .catch(err => {
        console.log("got error");
        response.send(JSON.stringify(err));
        response.json(err.message).status(err.status);
    });
}