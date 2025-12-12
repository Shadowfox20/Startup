# CS 260 Notes

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)
- [W3 HTML tutorials](https://w3schools.com/html)

## Console Commands:
Using GitBash:
- `chmod`: **mod**ify file permissions
- `pwd`: "**p**rint **w**orking **d**irectory", returns the path to the current working directory
- `cd`: "**c**hange **d**irectory", moves to a specified directory
- `ls`: "**l**i**s**t contents", lists files within the current directory
    - `-a`: "**a**ll", shows hidden
    - `-l`: "**l**ong", shows metadata
    - `-h`: "**h**uman readable", makes meta data more readable (can be combined with `-l` as `-lh`).
- `vim`/`nano`: text editors. Specify file name.
- `mkdir`: "**m**a**k**e **dir**ectory", creates a new folder within the current directory. Specify name.
- `mv`: "**m**o**v**e", change address or name of a file. Specify file and new directory/file name.
- `rm`: "**r**e**m**ove", removes a file. Specify file name.
- `man`: similar to `--help`, returns overview and usage of a command.
- `ssh`: "remote shell session", connects to a website. specify user(ubuntu)@host and key.
- `ps`: "**p**rocess **s**tatus", displays information about currently running processes
- `wget`: "**w**eb **get**", downloads a file from the web.
- `sudo`: "**s**uper **u**ser **do**", executes a command with maximum permissions.

## GitHub:
Updating GitHub with changes made locally (using the terminal):

- `git add <filename>` - uploads the file to GitHub repo
- `git commit -am "<notes>"` - commits the changes
- `git push` - pushes the commit to the branch
- `git fetch` - checks for updates to GitHub repo
- `git status` - describes updates found
- `git pull` - updates local repo with GitHub changes
- `git checkout <branch-name>` - switches active branch

## AWS:
### To create an IP address:
- In the EC2 menu, "launch instance"
- Make sure to keep the key pair somewhere secure (you can reuse a key pair for multiple instances)

### DNS - Domain Name Service:
- A DNS A record points to the IP address
- Register a domain using the Route 53 dashboard
- To connect to an IP, go to "create record" within the hosted zone on AWS
- A URL is structured: security//:subdomain.root.TLD/file(s)...

### Ports and Security:
- Port 443: HTTPS (encrypted)
- Port 80: HTTP (unencrypted)
- Port 22: SSH (secure shell - logins and file transfers)

## HTML:
- The basic skeleton of the page
- Use tags to indicate different page elements
    - the `<div>` tag allows you to create custom elements
- Structure tags:
    - `<head>`
        - `<title>`
        - `<link>` - can link a css doc
    - `<body>`
        - `<header>`
            - `<nav>`
        - `<main>`
            - `<section>` - creates a different section within the body
        - `<footer>`
- Other important tags:
    - `<a href="...">` - creates a link
    - `<p>` - paragraph tag
    - `<ul>` - starts a list
    - `<li>` - a list item

## CSS:
- Specifies the styling and formatting of different HTML elements
- Syntax:
```
element {
    spec: value;
}
```
- can use `.class-name` to edit values for a specific clas (as might be specified with a `<div class="...">` tag in the HTML)
- can use `@media (spec) {}` to specify formatting changes based on window size
    - `max-width: ___px` or `max-height: ___px`
    - `orientation: portrait` or `landscape`
    - `prefers-color-scheme: light` or `dark`
- `display: flex` allows for the size of each item within the element to be specified
    - `flex: _` allows you to assign values to indicate how large each item should be
- `element:nth-child(x)` allows you to make specifications for a specific object, the xth instance of the element

## React:
### In index.html: 
- Add the `<head>` content
- a `<script>` element linking to index.jsx:
```
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <script type="module" src="/index.jsx"></script>
</body>
```

### In index.jsx:
- link to app.jsx:
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### In app.jsx:
- Imports:
    - React from "https://esm.sh/react"
    - ReactDOM from "https://esm.sh/react-dom/client"
    - Specific functions from "https://esm.sh/react-router-dom"
    - Page content, syntax: `import { Page-name } from './folder/file'`
    - CSS from app.css
- create a function `App()` which returns:
    - a `<BrowserRouter>` tag that contains all elements
        - if you want to add CSS styling for the whole page (e.g. to use flex), put it in a `<div className="app-body">`
    - a `<nav>` element that contains `<NavLink to="/page-name">` elements for each page
    - a `<Routes>` element (acts like a navbar) which contains `<Route path="/page-name" element={Page-name} />` elements
- Ends with:
```
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
```

### In each page's .jsx file:
- import the CSS file
- create a function `Page-name()` which returns the content of the page

### Important functions:
- `React.useState()` returns a special react object type that can dynamically update
- Hooks:
    - Ref hooks aren't used for rendering
        - `React.useRef` declares a ref
    - Effect hooks connect to external systems, such as WebSocket or backend
        - `React.useEffect (() => {/insert code})` uses the code

## Node.js:
- Create endpoints in `service/index.js` to allow front end to connect back end
- Format endpoints:
```
app.<function>('<dir>', async (req, res) => {
    //insert code
});
```
- In front end:
```
const res = await fetch('<dir>', {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ <data> }),
});
const data = await res.json();
```

## Mongo.db
### In `service/dbConfig.json`: 
```
{
  "hostname": "<cluster name>.<code>.mongodb.net",
  "userName": "<username>",
  "password": "<password>"
}
```

### In `service/index.js`:
```
const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('<database name>');
const collection = db.collection('<collection name>');
```

### Retrieving data:
- `collection.findOne({ attr: val })` finds the first object in the collection with the specified attribute (e.g. username or token)
- `collection.find({ attr: val })` finds all objects in the collection with the specified attributes
    - you can replace `val` with `{ $lt : val }` (less than) or `{ $gt : val }` (greater than)
    - optionally you can sort with `.sort({ attr: direction })`, with `1` indicating ascending and `-1` indicating descending
    - format the data as an array with `.toArray()`

### Sending data:
- `collection.insertOne({ })` adds a new object to the collection
- `userCollection.updateOne({ <find values> }, { $set: { attr: value } })`

## WebSocket
### What is it?
- live peer-to-peer connections

### Backend:
Initialize with `const socketServer = new WebSocketServer({ server: httpServer });`

```
socket.on(connection, (socket) => {
    socket.isAlive = true;
    socket.on('message', async function myFunction(data) {
        /insert code to format a "message"
        socketServer.clients.forEach((client) => {
          if (client !== socket && client.readyState === 1) {
            client.send(message);
          }5
        });
    });
    
```

### Frontend:
```
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
const wsHost = isLocalhost ? `${window.location.hostname}:4000` : window.location.hostname;
const wsUrl = `${proto}://${wsHost}/ws`;
this.socket = new WebSocket(wsUrl);
this.socket.onopen = () => {
  while (this.messageQueue.length) { this.socket.send(this.messageQueue.shift()); }
};
this.socket.onmessage = async (msg) => {
    //insert code to handle recieving a message
}
```
to send a message:
```
const msg = JSON.stringify(obj);
this.socket.send(msg);
```

## Final Exam Review
Status Code:
- 200: Success
- 3XX: Redirects (not usually an error)
- 4XX: Client Error (not found, auth error)
- 5XX: Server Error

HTTP headers:
- `content-type` explains what format the content is in (e.g. `application/json` or `image`);  helps to identify errors

Cookie types:
- Secure cookie: sent over https
- Http-only cookie: can't be modified
- Same-site cookie: can't be used on another site
- None are default, but one cookie can have all

HTTP requests:
- POST (add): create a resource, send a body
- GET: access a resource
- DELETE: delete a resource
- PUT (edit): update a resource

Security:
- Passwords: salt (slight edit, unique to user) and hash (scramble)

Acronyms:
- JSX: JavaScript XML (react
- JS: JavaScript
- AWS: Amazon Web Services
- NPM: Node Package Manager
- NVM: Node Version Manager

Important systems:
- node.js is for backend javascript
- pm2 is a Daemon that runs our JS
- Vite builds the JS into something that the computer can run; builds typescript into JS
