const fetch = require('cross-fetch');

const exchangeCodeForToken = (code) => {
  return fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    }),
  })
    .then((res) => res.json())
    .then(({ access_token }) => access_token);
};

const getGithubProfile = (token) => {
  return fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  })
    .then((profileResp) => profileResp.json())
    .then(({ email, avatar_url, login }) => {
      return { login, avatar_url, email };
    });
};

module.exports = { exchangeCodeForToken, getGithubProfile };
