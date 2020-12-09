import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers'
import { composeWithDevTools } from "redux-devtools-extension";


const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)
// composeWithDevTools 를 사용하여 리덕스 개발자 도구 활성화
ReactDOM.render(
  <React.StrictMode>
      <Provider store={ createStoreWithMiddleware(Reducer,
          composeWithDevTools()

      ) }>
          <App/>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
