import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;

  try {
    // Exchange the code for an access token
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, {
      headers: { Accept: 'application/json' }
    });

    const token = response.data.access_token;

    // Send the token back to the Decap CMS popup window
    const script = `
      <script>
        const receiveMessage = (message) => {
          if (message.data === "authorizing:github") {
            window.opener.postMessage(
              'authorization:github:success:{"token":"${token}","provider":"github"}',
              message.origin
            );
            window.removeEventListener("message", receiveMessage);
          }
        };
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      </script>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(script);
  } catch (error) {
    res.status(500).send('Authentication failed');
  }
}