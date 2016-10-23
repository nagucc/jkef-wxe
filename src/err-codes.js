/*
定义用于返回的错误代码
 */

// 成功
export const SUCCESS = 0;

// 无权限访问
export const UNAUTHORIZED = 401;

// 服务器错误
export const SERVER_FAILED = 500;

// 其他错误
export const OTHER_ERROR = 999;

// 必须填写的字段
export const REQUIRED = 1001;

// 无效的电子邮件地址
export const INVALID_EMAIL_ADDRESS = 1002;

// 字符串太短
export const TOO_SHORT_CHARACTERS = 1003;

// 字符串太长
export const TOO_MANY_CHARACTERS = 1004;

// 不是数字型
export const INVALID_NUMBER = 1005;

// 不是整型数
export const INVALID_INTEGER = 1006;

// 数值太小
export const TOO_SMALL_NUMBER = 1007;

// 数值太大
export const TOO_LARGE_NUMBER = 1008;

// 对象没找到
export const OBJECT_IS_NOT_FOUND = 1009;

// 对象未定义或为空
export const OBJECT_IS_UNDEFINED_OR_NULL = 1010;

// 对象已存在
export const OBJECT_ALREADY_EXISTS = 1011;

// 未知错误
export const UNKNOWN_ERROR = -1;
