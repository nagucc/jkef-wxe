import { expect } from 'chai';
// import { shallow } from 'enzyme';
import {getStatByProject} from './fetch-data';

describe('stat-by-project Fetch data', function () {
  this.timeout(15000)
  // 使用HTTP可以获取正确的数据
  it('get stat result by project via http', async () => {
    let data = await getStatByProject();
    expect(data.length).to.be.above(0);
    expect(data[0]._id).to.be.not.null;
  })
});
