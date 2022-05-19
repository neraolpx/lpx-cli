#! /usr/bin/env node
'use strict';
const program = require('commander');
const inquirer = require('inquirer');
const create = require('../src/create');
const start = require('../src/start');
const consoleColors = require('../utils/index');

const { blue, yellow, red, green } = consoleColors;

const question = [
  {
    name: 'conf',
    type: 'confirm',
    message: '是否创建新的项目？'
  },{
    name: 'name',
    message: '请输入项目名称',
    when: res => Boolean(res.conf) /* 是否执行 */
  },{
    name: 'auther',
    message: '请输入作者',
    when: res => Boolean(res.conf) /* 是否执行 */

  },{
    type: 'list', /* 选择框 */
    message: '请选择公共管理状态',
    name: 'state',
    choices: ['mobx', 'redux'], /* 选项 */
    filter: function(val) {    /* 过滤 */
      return val.toLowerCase()
    },
    when: res => Boolean(res.conf)
  }
]

program
  .option('-d --debug', 'output extra debugging')
  .action(() => {
    blue('option is debug');
  });

program
  .version('0.0.1');

/* create a project */
program
  .command('create')
  .description('create a project')
  .action((source, destination) => {
    green('欢迎使用lpxcli, 轻松构建react + ts项目');
    inquirer.prompt(question).then(answer => {
      if (answer.conf)
        create(answer);
    });
  });

/* start project */
program
  .command('start')
  .description('start a project')
  .action((source, destination) => {
    green('--------运行项目--------');
    /* 运行项目 */
    start('start').then(() => green('------运行完成------'));
  });

/* build project */
program
  .command('build')
  .description('build a project')
  .action((source, destination) => {
    green('--------构建项目--------');
    /* 打包项目 */
    start('build').then(() => green('------构建完成------'));
  });

program.parse(process.argv);