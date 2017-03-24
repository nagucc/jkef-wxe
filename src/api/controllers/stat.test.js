// /* eslint-env mocha */
// /* eslint-disable padded-blocks, no-unused-expressions */
//
// import 'babel-polyfill';
// import { expect } from 'chai';
// import { SUCCESS } from 'nagu-validates';
// import request from 'supertest';
// import app from '../express-for-test';
// import statCtrl from './stat';
//
// const routePath = '/api/stat';
// app.use(routePath, statCtrl);
//
// const agent = request.agent(app);
//
// describe('Acceptor Stat Middlewares', () => {
//   it('GET /by-project', async () => {
//     const res = await agent.get(`${routePath}/by-project`);
//     expect(res.body.ret).to.eql(SUCCESS);
//   });
//   it('GET /by-year', async () => {
//     const res = await agent.get(`${routePath}/by-year`);
//     expect(res.body.ret).to.eql(SUCCESS);
//   });
// });
