import Mongoose from 'mongoose';

// 创建fundInfos集合的model
const Registration = Mongoose.Schema({
  name: String,
  sex: String,
  id: String,
  style: String,
  graduation: String,
  grade: Number,
  university: String,
  major: String,
  degree: String,
});

const FundInfo = Mongoose.model('FundInfo', Registration);
export default FundInfo;
