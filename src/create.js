
const fs = require('fs')
const utils = require('../utils');
const install = require('./npm');

let fileCount = 0, /* 文件数量 */
    dirCount = 0,  /* 文件夹数量 */
    flat = 0       /* readir数量 */
    isInstall = false /* 是否执行过install */

/**
 * 复制文件
 * @param {*} sourcePath  //template路径
 * @param {*} currentPath //当前项目路径
 * @param {*} cb          //复制完成回调
 * @returns 
 */
function copy(sourcePath, currentPath, cb) {
  flat++;
  /* 读取文件夹下面的文件 */
  fs.readdir(sourcePath, (err, paths) => {
    flat--;
    if (err) throw err;
    paths.forEach(path => {
      if (path !== '.git' && path !== 'package.json') fileCount++; // 排除 .git package.json
      const newSourcePath = sourcePath + '/' + path,
            newCurrentPath = currentPath + '/' + path;
      /* 判断文件信息 */
      fs.stat(newSourcePath, (err, stat) => {
        if (err) throw err;

        /* 判断是文件且不是 package.json */
        if (stat.isFile() && path !== 'package.json') {
          /* 创建读写流 */
          const readStream = fs.createReadStream(newSourcePath),
                writeStream = fs.createWriteStream(newCurrentPath);
          readStream.pipe(writeStream);
          utils.green(`创建文件：${newCurrentPath}`);
          fileCount--;
          completeCtrl(cb) // 创建完成后判断执行
        } else if (stat.isDirectory()) { // 处理文件夹
          if (path !== '.git' && path !== 'package.json') {
            dirCount++;
            dirExist(newSourcePath, newCurrentPath, cb); //处理文件夹
          }
        }
      })
    })
  })
}

/**
 * 处理文件夹复制
 * @param {*} sourcePath // 资源路径
 * @param {*} currentPath //目标路径
 * @param {*} cb // 复制完成后回掉
 * @returns 
 */
function dirExist(sourcePath, currentPath, cb) {
  // 检查当前目录中是否存在该文件。
  fs.access(currentPath, fs.constants.F_OK, (err) => {
    // 不存在 按说只要进来的都是不存在的 保险兜底把存在也加上
    if (err) {
      fs.mkdir(currentPath, () => {
        fileCount--;
        dirCount--;
        copy(sourcePath, currentPath, cb);
        utils.yellow(`创建文件夹：${currentPath}`);
        completeCtrl(cb);
      })
    } else {
      copy(sourcePath, currentPath, cb); //递归copy
    }
  });
}

/* 判断是否创建完成 */
function completeCtrl(cb) {
  if (fileCount === 0 && dirCount === 0 && flat === 0) {
    utils.green('------创建完成------');
    if (cb && !isInstall) { //自动install
      utils.blue('------开始安装依赖------')
      cb(() => {
        utils.blue('------依赖安装完成------');
        runProject(); // 运行项目
      });
    }
  }
}

/**
 * 修改package.json 
 * @param {Object} res //输入信息
 * @param {String} sourcePath //资源路径
 * */
function revisePackageJson(res, sourcePath) {
  return new Promise((resolve) => {
    /* 读取文件 */
    fs.readFile(sourcePath + '/package.json', (err, data) => {
      if (err) throw err;
      const {name, auther} = res;
      let json = data.toString();
      /* 替换模板信息 */
      json = json.replace(/demoName/g, name.trim());
      json = json.replace(/demoAuthor/g, auther.trim());
      const path = process.cwd() + '/package.json';
      /* 写入文件 */
      fs.writeFile(path, Buffer.from(json), () => {
        utils.green(`创建文件：${path}`);
        resolve();
      })
    })
  })
}

/**
 * 运行项目
 * @param {*} res 
 */
function runProject() {
  try {
    /* 调用npm执行 start命令 */
    const start = npm(['start']);
    start();
  } catch (error) {
    utils.red('自动启动失败，请手动执行 npm start 启动项目')
  }
}

module.exports = function (res) {
  /* 创建文件 */
  utils.green('------开始创建------');
  /* 找到template文件下的模板项目 */ 
  const sourcePath = __dirname.slice(0, -3) + 'template';
  utils.blue(`当前路径:${process.cwd()}`);
  /* 修改package.json */
  revisePackageJson(res, sourcePath).then(() => {
    copy(sourcePath, process.cwd(), install())
  })
}