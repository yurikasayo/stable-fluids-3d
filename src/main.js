import "./style.css";
import { MyApp } from "./app/app";

const canvas = document.querySelector('canvas.webgl');
const myApp = new MyApp(canvas, true);