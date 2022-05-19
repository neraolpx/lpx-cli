'use strict';
/* 启动项目 */
const child_process = require('child_process');
const fs = require('fs');
const { red } = require('../utils');

/* 找到项目中 lpx-react-webpack-plugin 的路径 */
const currentPath = process.cwd() + '/node_modules/lpx-react-webpack-plugin';

/**
 * @param {*} type start 本地启动 build 线上打包
 */
module.exports = function(type) {
  return new Promise((resolve, reject) => {
    /* 判断lpx-react-webpack-plugin 是否存在 */
    fs.access(currentPath, fs.constants.F_OK, (err) => {
      // 不存在 进行提示
      if (err) {
        console.log(res('lpx-react-webpack-plugin dose not exist, please install it'));
      } else { // 存在 启动子进程
        const child = child_process.fork(currentPath + 'index.js');
        
        /* 监听子进程信息 */
        child.on('message', (mes) => {
          if (mes.type === 'end') {
            child.kill();
            resolve();
          } else if (mes.type === 'error') {
            // 杀掉子进程
            child.kill();
            reject();
          }
        });

        /* 发送cwd路径 和 执行的操作类型 start或build */
        child.send(JSON.stringify({
          cwdPath: process.cwd(),
          type: type || 'build'
        }));
      }
    })
  })
}