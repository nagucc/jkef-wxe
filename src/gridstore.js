import { MongoClient, GridStore, ObjectId } from 'mongodb';

export const writeData = async (url, data, filename = null, options = {}) => {
  const fileId = new ObjectId();
  try {
    // 连接数据库
    const db = await MongoClient.connect(url);

    // 创建一个新文件用于写入
    const gs = new GridStore(db, fileId, filename, 'w', options);

    // 打开文件
    await gs.open();

    // 写入Buffer
    await gs.write(data);

    // 关闭文件
    await gs.close();

    // 返回文件Id
    return fileId;
  } catch (e) {
    throw e;
  }
};
