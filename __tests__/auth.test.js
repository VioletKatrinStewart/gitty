const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('auth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should redirect to the github oauth page upon login', async () => {
    const req = await request(app).get('/api/v1/github/login');
    expect(req.header.location).toMatch(
      'http://localhost:7890/api/v1/github/login/callback'
    );
  });

  it('should login and redirect users to posts', async () => {
    const req = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    expect(req.req.path).toEqual('/api/v1/posts');
  });

  it('should logout user with delete', async () => {
    const res = await request.agent(app).delete('/api/v1/github');
    expect(res.body).toEqual({
      message: 'Signed out',
      success: true,
    });
  });
});
