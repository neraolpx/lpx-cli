const which = require('which');

/**
 * 运行终端命令
 * @param {*} cmd
 * @param {*} args
 * @param {*} fn
 * @returns 
 */
function runCmd(cmd, args, fn) {
  args = args || [];
  // 创建子进程
  const runner = require('child_process').spawn(
    cmd,
    args, {
    stdio: 'inherit'
  });
  runner.on('close', function(code) {
    if (fn) fn(code); // 进程关闭时 执行回调
  }) 
}

/* 找到npm */
function findNpm() {
  const npms = process.platform === 'win32' ? ['npm.cmd'] : ['npm'];
  for (let i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i]);
      console.log('use npm:' + npms[i]);
      return npms[i];
    } catch (error) {
    }
  }
  throw new Error('plase install npm')
}

/**
 * @param {*} installArg 执行命令 命令行组成的数组 默认为install
 */
module.exports = function (installArg = ['install']) {
  /* 闭包保存npm */
  const npm = findNpm();
  return function (done) {
    /* 执行命令 done为执行完成后的回调*/
    runCmd(which.sync(npm), installArg, () => done && done())
  }
}