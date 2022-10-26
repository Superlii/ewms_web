// --------------------引入请求方式


import {
  get,
  get1,
  post,
  post1,
  post2,
  Delete,
  put
} from './http'

import axios from 'axios'

// --------------------创建后端接口api

//上传、下载------
const downFile = post1('/minio/download') //下载
const downFile2 = post2('/minio/download') //下载
const uploadFile = post('/minio/upload') //上传

//----------登录

const loginIn = post('/sys/login') //登录
const loginOut = get('/sys/logout') //登出
const loginCheckVc = get('/sys/util/checkVc') //验证码校验
const loginVc = get('/sys/util/getImgVc') //验证码获取

//基础数据- 客户信息

const cusInfoList = post('/sys/cusInfo') // 客户信息列表
const cusInfoDel = Delete('/sys/delCusInfo') // 删除客户信息
export function cusInfoOpen(data) {
  return axios.post('/sys/cusInfoOpen', data)
} // 启用客户信息
const cusAdd = post('/sys/cusAdd') // 添加客户信息
const cusEdit = put('/sys/cusEdit') // 修改客户信息
const cusDetail = get('/sys/cusDetail') // 获取客户所属组织数据

//基础数据- 仓库

const reservoirList = post('/sys/reservoirList') // 库区信息列表
const reservoirInfoDel = Delete('/sys/reservoirInfoDel') // 删除库区信息
const reservoirOpen = post('/sys/reservoirOpen') // 启用库区信息
const reservoirAdd = post('/sys/reservoirAdd') // 添加库区信息
const reservoirEdit = put('/sys/reservoirEdit') // 修改库区信息
const reservoirDetail = get('/sys/reservoirDetail') // 获取库区所属组织数据


//----------菜单管理

const menuList = get('/sys/menu') //菜单列表
const menuTree = get('/sys/menu/tree') //菜单树
const menuAdd = post('/sys/menu') //菜单新增
const menuEdi = put('/sys/menu') //菜单修改
const menuDel = Delete('/sys/menu') //菜单删除

//----------部门管理

const deptList = get('sys/department/list')
const deptTree = get('/sys/department/tree'); //部门树请求
const deptAdd = post('/sys/department'); //部门新增
const deptEdi = put('/sys/department'); //部门修改
const deptDel = Delete('/sys/department'); //部门删除


//----------日志管理
const bussinessLoggertList = get('/log/work'); //业务日志分页
const dataLoggertList = get('/log/data'); //数据日志分页
const dataLoggertListById = get('/log/data'); //数据日志id---查询
const loggerDao = post1('/log/data/downExcl') //日志表格导出



//----------用户管理

const userLoginInfo = get('/sys/user/getLoginUser') //登录用户信息
const userRegiste = post('/sys/user/register') //用户注册
const userAdd = post('/sys/user/') //用户新增
const userEdi = put('/sys/user') //用户修改
const userDel = Delete('/sys/user/') //用户删除
const userDetail = get1('/sys/user/') //用户详情
const userLogger = get('/sys/user/log') //用户日志
const userList = get('/sys/user') //用户列表分页
const restUserPassword = get('/sys/user/restPassword') //重置用户密码
const updateUserPassword = post('/sys/user/updatePassword') //修改用户密码
const restUserRole = post('/sys/role/reset') //重置用户角色
const restUserDept = post('/sys/department/reset') //重置用户部门


//----------角色管理

const roleList = get('/sys/role') //角色列表
const roleAdd = post('/sys/role') //角色添加
const roleDel = Delete('/sys/role') //角色删除
const roleEdi = put("/sys/role") //角色修改
const restRoleMenu = post("/sys/menu/reset") //重置角色菜单列表


//----------字典管理

const dictList = get('/sys/dictionaries') //字典列表
const dictAdd = post('/sys/dictionaries') //字典新增
const dictEdi = put('/sys/dictionaries') //字典修改
const dictDel = Delete('/sys/dictionaries') //字典删除


//----------文件管理

const fileList = get('/minio/page') //分页




//--------------------导出api
export {
  cusInfoList,
  cusInfoDel,
  cusAdd,
  cusEdit,
  cusDetail,
  reservoirList,
  reservoirInfoDel,
  reservoirOpen,
  reservoirAdd,
  reservoirEdit,
  reservoirDetail,
  downFile,
  downFile2,
  uploadFile,
  fileList,
  bussinessLoggertList,
  dataLoggertList,
  dataLoggertListById,
  loggerDao,
  dictAdd,
  dictEdi,
  dictDel,
  deptAdd,
  deptEdi,
  deptDel,
  deptList,
  updateUserPassword,
  restUserPassword,
  userRegiste,
  userLogger,
  userAdd,
  userEdi,
  userDel,
  menuAdd,
  menuEdi,
  loginIn,
  loginOut,
  loginVc,
  loginCheckVc,
  menuList,
  menuTree,
  menuDel,
  deptTree,

  roleList,
  roleAdd,
  roleDel,
  roleEdi,
  restRoleMenu,
  userDetail,
  userLoginInfo,
  userList,
  restUserRole,
  restUserDept,
  dictList
}