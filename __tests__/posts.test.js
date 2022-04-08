const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('posts routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('does not create a post because you are not logged in', async () => {
    const expected = {
      text: 'how do you center a div?',
    };
    const res = await request(app).post('/api/v1/posts').send(expected);
    expect(res.body).toEqual({
      status: 401,
      message: 'You need to be signed in to view this page',
    });
  });

  it('creates a post because user is logged in', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const expected = {
      text: 'this is a funny tweet',
    };
    const res = await agent.post('/api/v1/posts').send(expected);
    expect(res.body).toEqual({
      ...expected,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('gets a list of posts', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const post1 = {
      text: 'this is a funny tweet',
    };
    await agent.post('/api/v1/posts').send(post1);

    const post2 = {
      text: 'this is an even funnier tweet',
    };
    await agent.post('/api/v1/posts').send(post2);
    const res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual([
      { ...post1, id: expect.any(String), createdAt: expect.any(String) },
      { ...post2, id: expect.any(String), createdAt: expect.any(String) },
    ]);
  });
});
