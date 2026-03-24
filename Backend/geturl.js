const http = require('http');
http.get('http://127.0.0.1:4041/api/tunnels', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const fs = require('fs');
    fs.writeFileSync('tunnel.txt', json.tunnels[0].public_url);
  });
});
