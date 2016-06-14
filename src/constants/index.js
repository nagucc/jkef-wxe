export const SET_RUNTIME_VARIABLE = 'SET_RUNTIME_VARIABLE';

// 开始获取acceptors数据
export const FETCHING_ACCEPTORS_LIST = 'FETCHING_ACCEPTORS_LIST';

// 成功获取到了acceptors数据
export const FETCHED_ACCEPTORS_LIST = 'FETCHED_ACCEPTORS_LIST';

// 获取数据失败
export const FETCH_FAILED = 'FETCH_FAILED';

// 清空acceptors数据
export const CLEAN_ACCEPTORS_LIST = 'CLEAN_ACCEPTORS_LIST';

// 获取当前用户的登录信息
export const FETCHED_ME = 'FETCHED_ME';

// 获取当前用户信息失败
export const ME_FETCHED_FAILED = 'ME_FETCHED_FAILED';

// 用户是普通游客
export const USER_IS_GUEST = 'USER_IS_GUEST';

// 用户是普通已登录用户
export const USER_IS_MEMBER = 'USER_IS_MEMBER';

// 用户是supervisor
export const USER_IS_SUPERVISOR = 'USER_IS_SUPERVISOR';

// 用户是Manager
export const USER_IS_MANAGER = 'USER_IS_MANAGER';


/*
acceptors/registration 页面
 */

// 显示acceptors/registration页面
export const SHOW_ACCEPTORS_REGISTRATION = 'SHOW_ACCEPTORS_REGISTRATION';

// 设置证件类型
export const SET_IDCARD_TYPE = 'SET_IDCARD_TYPE';

// 设置受赠者类型为“个人”
export const SET_IDCARD_TYPE_PERSON = 'SET_IDCARD_TYPE_PERSON';

// 设置受赠者类型为团体
export const SET_IDCARD_TYPE_GROUP = 'SET_IDCARD_TYPE_GROUP';

// 保存新的受赠者信息到服务器
export const PUT_NEW_ACCEPTOR = 'PUT_NEW_ACCEPTOR';


/*
acceptors/detail:/:id 页面
 */
export const SHOW_ACCEPTOR_DETAIL = 'SHOW_ACCEPTOR_DETAIL';

export const FETCH_ACCEPTOR_BY_ID = 'FETCH_ACCEPTOR_BY_ID';

export const FETCHING_ACCEPTOR_BY_ID = 'FETCHING_ACCEPTOR_BY_ID';

export const FETCHED_ACCEPTOR_BY_ID = 'FETCHED_ACCEPTOR_BY_ID';

export const FETCH_ACCEPTOR_BY_ID_FAILED = 'FETCH_ACCEPTOR_BY_ID_FAILED';

/*
acceptors/edit/:id 页面
 */
export const UNAUTHORIZED = 'UNAUTHORIZED';

export const INIT_ACCEPTOR_EDU_HISTORY = 'INIT_ACCEPTOR_EDU_HISTORY';

export const ADDED_ACCEPTOR_EDU = 'ADDED_ACCEPTOR_EDU';

export const DELETED_ACCEPTOR_EDU = 'DELETED_ACCEPTOR_EDU';
