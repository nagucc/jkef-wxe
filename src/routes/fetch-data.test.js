import { expect } from 'chai';
// import { shallow } from 'enzyme';
import {getStatByProject, getStatByYear} from './fetch-data';

describe('Fetch data from client', function () {
  this.timeout(15000)
  // 使用HTTP可以获取正确的数据
  it('get stat result by project via http', async () => {
    let data = await getStatByProject();
    expect(data.length).to.be.above(0);
    expect(data[0]._id).to.be.not.null;
  })

  // 使用HTTP可以获取正确的数据
  it('get stat result by year via http', async () => {
    let data = await getStatByYear();
    expect(data.length).to.be.above(0);
    expect(data[0]._id).to.be.not.null;
  })
});
