import data from "./history.json";
export interface HistoryEvent {id:string;year:string;part:number;title:string[];paragraphs:string[][];drawing:string;caption:string[];equation:string;related:string;sources:{label:string;url:string}[];note?:string[];photo?:{file:string;title:string;source:string;author:string;license:string;licenseUrl:string};}
export const historyEvents:HistoryEvent[]=data.events;
export const historyEras=data.eras;
export const historyIntro=data.intro;
