import { useCollection } from 'mongo-use-collection';
import { mongoUrl, writeData } from '../../config';
import { GridStore, ObjectId } from 'mongodb';

export const ZXJ_APPLY_COLLECTION = 'zxjApply';

export const useZxjApply = cb => useCollection(mongoUrl, ZXJ_APPLY_COLLECTION, cb);


// add, edit, reject, resolve, pay
export const add = zxjApply =>
  new Promise((resolve, reject) => useZxjApply(async (col, db) => {
    const { acceptorId, name, schoolName, degree, year, nation,
      familyIncomeIntro, publicActivtesIntro,
      idCardPhoto, stuCardPhotoes, otherPhotoes,
      scorePhotoes } = zxjApply;
    try {
      // 1. 添加图片到GridStore中
      const saveIdCardPhoto = writeData(idCardPhoto, 'idCardPhoto');
      const saveStuCardPhotoes = Promise.all(stuCardPhotoes.map((photo, i) =>
        writeData(photo, `stuCardPhoto_${i}`)));
      const saveScorePhotoes = Promise.all(scorePhotoes.map((photo, i) =>
        writeData(photo, `scorePhotoes_${i}`)));
      const saveOtherPhotoes = Promise.all(otherPhotoes.map((photo, i) =>
        writeData(photo, `otherPhotoes_${i}`)));
      const photoIds = await Promise.all([
        saveIdCardPhoto,
        saveStuCardPhotoes,
        saveScorePhotoes,
        saveOtherPhotoes,
      ]);

      // 2. 添加基本信息到zxjApply集合中
      await col.insertOne({
        acceptorId, name, schoolName, degree, year, nation,
        familyIncomeIntro, publicActivtesIntro,
        idCardPhotoId: photoIds[0],
        stuCardPhotoIds: photoIds[1],
        scorePhotoIds: photoIds[2],
        otherPhotoIds: photoIds[3],
      });
      resolve();
    } catch (e) {
      console.log(e); // eslint-disable-line
      reject(e);
    }
  }));
export const list = () =>
  new Promise((resolve, reject) => useZxjApply(async col => {
    try {
      const result = await col.find().toArray();
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }));
