# CS 260 Notes

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)
- [W3 HTML tutorials](https://w3schools.com/html)

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
- Register a domain using the Route 53 dashboard
- To connect to an IP, go to "create record" within the hosted zone on AWS

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
- Imports:
    - React from "https://esm.sh/react"
    - ReactDOM from "https://esm.sh/react-dom/client"
    - Specific functions from "https://esm.sh/react-router-dom"
- create a function `Page()` which returns the content of the page
- create a function `App()` which returns:
    - a `<BrowserRouter>` tag that contains all elements
    - a `<nav>` element that contains `<NavLink to="/page-name">` elements for each page
    - a `<main>` element that contains:
        - a `<Routes>` element (acts like a navbar) which containes `<Route path="/page-name" element={Page} />` elements
- Ends with
```
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
```