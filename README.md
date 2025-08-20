# Server generated pdf solution with headless

quick and dirty draft for a dashboard to pdf feature

## Goal
To setup a module to render a protected route of a web domain and export it to pdf
without having to rely on a html-to-pdf lib (html2pdf) that generates a picture-in-pdf
or renderer lib (@react-pdf/renderer) that forces you to use solely its limited components

The solution needs to run in a lambda

## Solution
Use a headless browser (puppeteer-core and @sparticuz/chromium)
- can reuse react components
- no image-based pdf
- don't have to rely on browser's print feature (which is very limited)
- fully controls everything (footer, page dimension)

## Potential restrictions
Lambda has a strict function size, so puppeteer with normal chromium is out of the question (>300MB). Luckily, this is a common issue, so there are plenty of solutions.

puppeteer-core and @sparticuz/chromium is a well tested solution, but with some caveats to consider (reference sparticuz docs for version matching)

For protected route issue, need to either hijack access token and session token from client's request to feed to puppeteer or mint a new token. Either way, this can be an issue because puppeteer would need to reach outside of the private vpc lambda resides in without going through api gateway (TBD)

Besides version matching, there's also a common issue with missing binaries for specific ppt-core, sparticuz-chr, and nodejs runtime in lambda (Can also because the combos make the unzipping binaries process fail)

For nodejs20 and above, this works - https://github.com/Sparticuz/chromium/issues/285#issuecomment-2629211064

## Notes
The solution is done with the `serverless` framework and esbuild

Need to configure aws cli in local first to run this solution. This will deploy a cloudformation template to setup an api gateway with a lambda

To test, after running serverless, navigate to the generated endpoint, it works when you see an image of the frontpage of example.com domain
