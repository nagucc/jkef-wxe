import { expect } from 'chai';
// import { shallow } from 'enzyme';
import {getStatByProject, getStatByYear,
  findAcceptorsByProject} from './fetch-data';

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
  });

  it('find acceptors by project via http correctly', async() => {
    let data = await findAcceptorsByProject('奖学金');
    expect(data.length).to.be.above(0);

    expect(data[0]._id).to.be.not.null;


  });

  it('find acceptors by project via http 错误的项目或页码', async() => {
    let data = await findAcceptorsByProject('奖学金2', 0);
    expect(data.length).to.eql(0);

    data = await findAcceptorsByProject('奖学金', 9999);
    expect(data.length).to.eql(0);

    try {
      data = await findAcceptorsByProject('奖学金', -1);
      throw new Error('This is should not dispear');
    } catch(e)
    {
      expect(e).to.be.not.null;
    }
  })
});
