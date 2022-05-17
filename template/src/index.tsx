import React from "react";
// import ReactDom from 'react-dom';
import { createRoot } from "react-dom/client"; // react 18 根API的渲染方式
import "./index.less";
import logo from "./assets/logo.svg";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="logo" className="App-logo" />
        <h1>myReactProgram</h1>
      </header>
    </div>
  );
}

interface LPX {
  name: string;
}

interface LPX {
  age: number;
}

const lpx: LPX = {
  name: "lpx",
  age: 26,
};

console.log(lpx);

const asd: any = 22;
console.log(asd);
const element: any = document.getElementById("root");

// 为提供的创建一个 React 根container并返回根。
const root = createRoot(element);
// 根可用于将 React 元素渲染到 DOM 中
root.render(<App />);

// 18版本之前 根api渲染方式
// ReactDom.render(
// <App/>,
// document.getElementById('root')
// );
