# A skeleton react webresource for Dynamics 365 crm in typescript
Develop a crm ready webresource in react with typescript.

 - hot reloading
 - the crm odata enpoint exposed to your localhost while developing


### prerequisits
A dyn365 instance is enough.

However, the developer experience is best if the [dyn365-deploy-cli](https://github.com/andnilsson/dyn365-deploy-cli) is used

### installation
Stand inside your project root:

`
npm install -g yo generator-react-crm
`

give your web resource a name and a namespace. Give the [crm-proxy](https://github.com/andnilsson/crm-proxy) a unused port

If you have a project.json and/or a tsconfig.json in your project root those files will be edited. **Nothing will be overwritten but some configurations till be added.** You´ll be prompted if there is a conflict

if the [dyn365-deploy-cli](https://github.com/andnilsson/dyn365-deploy-cli) is used, start the dev server:

`
npm run start-your-name
`

This will start [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) with the newly created webpack config with the same name as your resource in the project root

It will also start the [crm-proxy](https://github.com/andnilsson/crm-proxy) with the credentials configuration from the [dyn365-deploy-cli](https://github.com/andnilsson/dyn365-deploy-cli) 

A small example is provided on how you can query the crm odata endpoint from your localhost

when the time comes to upload you webresource to crm, run:

`
npm run deploy-your-name
`

this will transpile the "project" with the build configuration and upload all files to crm. Now it´s ready to be iframed onto a form. **No calls to the crm-proxy will occur. All calls will be to the actual odata endpoint**