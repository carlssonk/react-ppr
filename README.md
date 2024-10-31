### PPR (Partial Prerendering) Example

Framework: React

Bundler: Vite

Routing: Tanstack Router

#### PPR Flow
1. User makes request to `/` or `/about`
2. Request hits a Cloudflare Worker, prerendered HTML gets sent back instantly, at the same time the request gets forwarded to a Lambda function
3. Browser receives the prerendered HTML and it gets displayed to the user
4. Browser makes the necessary requests for static assets and JS for hydration, page gets repainted and the button gets hydrated
5. Cloudflare Worker receives server rendered HTML from the lambda and streams it down to the browser
6. Dynamic content gets injected to the HTML document, page repaints, and potential hydration happens
7. Done

Inspired by https://github.com/threepointone/react-ppr-workers