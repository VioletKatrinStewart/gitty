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

const getGithubProfile = async (token) => {
  const resp = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  const { avatar_url, login, email } = await resp.json();
  return { avatar_url, login, email };
};

module.exports = { exchangeCodeForToken, getGithubProfile };
