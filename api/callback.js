// import axios from 'axios';

// export default async function handler(req, res) {
//   const { code } = req.query;

//   try {
//     // Exchange the code for an access token
//     const response = await axios.post('https://github.com/login/oauth/access_token', {
//       client_id: process.env.GITHUB_CLIENT_ID,
//       client_secret: process.env.GITHUB_CLIENT_SECRET,
//       code,
//     }, {
//       headers: { Accept: 'application/json' }
//     });

//     const token = response.data.access_token;

//     // Send the token back to the Decap CMS popup window
//     const script = `
//       <script>
//         const receiveMessage = (message) => {
//           if (message.data === "authorizing:github") {
//             window.opener.postMessage(
//               'authorization:github:success:{"token":"${token}","provider":"github"}',
//               message.origin
//             );
//             window.removeEventListener("message", receiveMessage);
//           }
//         };
//         window.addEventListener("message", receiveMessage, false);
//         window.opener.postMessage("authorizing:github", "*");
//       </script>
//     `;
//     res.setHeader('Content-Type', 'text/html');
//     res.status(200).send(script);
//   } catch (error) {
//     res.status(500).send('Authentication failed');
//   }
// }


export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No authorization code provided by GitHub.');
  }

  try {
    // Using native fetch to avoid Vercel dependency bundling issues
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();

    // If GitHub rejected the exchange (e.g., bad secret or expired code)
    if (data.error) {
      console.error("GitHub OAuth Error:", data);
      return res.status(500).send(`GitHub Authorization Error: ${data.error_description}`);
    }

    const token = data.access_token;

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
    // This will print the exact crash reason in your Vercel logs
    console.error("Callback Function Crash:", error);
    res.status(500).send(`Serverless function failed: ${error.message}`);
  }
}