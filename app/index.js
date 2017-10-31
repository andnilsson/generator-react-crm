var Generator = require('yeoman-generator')
const _ = require('lodash');
const mkdirp = require('mkdirp');
const path = require('path');
const extend = require('deep-extend');
const superb = require('superb');

module.exports = class extends Generator {
    initializing() {
        this.props = {};
    }

    prompting() {
        return this.prompt([{
            type: 'input',
            name: 'name',
            message: 'Your web resource name',
            default: _.kebabCase(path.basename(process.cwd())) // Default to current folder name,
        }, {
            type: 'input',
            name: 'namespace',
            default: 'stq_',
            message: 'What is your crm default publisher prefix?'
        }, {
            type: 'input',
            name: 'port',
            message: 'Which port do you want to run webpack-dev-server on?',
            default: '8085',
            validate: str => {
                return parseInt(str) !== NaN
            }
        }]).then((answers) => {
            this.props.name = answers.name;
            this.props.namespace = answers.namespace;
            this.props.outputfolder = answers.namespace + '/build/' + answers.name + '/';
            this.props.htmlfolder = answers.namespace + '/html/';
            this.props.srcfolder = 'src/' + answers.name + '/';
            this.props.port = parseInt(answers.port)
        });
    }

    writing() {

        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath(this.props.htmlfolder + this.props.name + '.html'),
            {
                title: this.props.name
            }
        );

        this.fs.copyTpl(
            this.templatePath('index.tsx'),
            this.destinationPath(this.props.srcfolder + 'index.tsx'),
            {
                title: this.props.name
            }
        );

        this.fs.copyTpl(
            this.templatePath('example.tsx'),
            this.destinationPath(this.props.srcfolder + 'example.tsx'),
            {
                title: this.props.name
            }
        );

    }



    writeTsconfig() {
        const cfg = this.fs.readJSON(this.destinationPath('tsconfig.json'), {});

        extend(cfg, {
            "compilerOptions": {
                "outDir": "./stq_/build/",
                "sourceMap": true,
                "noImplicitAny": true,
                "module": "commonjs",
                "target": "es6",
                "jsx": "react"
            },
            "exclude": [
                "node_modules",
                "wwwroot"
            ]
        });

        this.fs.writeJSON(this.destinationPath('tsconfig.json'), cfg);
    }

    writingwebpack() {
        this.fs.copyTpl(
            this.templatePath('webpack.config.txt'),
            this.destinationPath(`webpack.${this.props.name}.config.js`),
            {
                title: this.props.name,
                namespace: this.props.namespace,
                port: this.props.port,
            }
        );

    }

    writingpackage() {
        const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

        extend(pkg, {
            dependencies: {
                "crm-common-js": "^2.7.0",
                "react": "^16.0.0",
                "react-dom": "^16.0.0"
            },
            devDependencies: {
                "dyn365-dev-proxy": "^1.0.0",
                "@types/react": "^16.0.13",
                "@types/react-dom": "^16.0.1",
                "babel-core": "^6.26.0",
                "babel-loader": "^7.1.2",
                "extract-text-webpack-plugin": "^3.0.1",
                "path": "^0.12.7",
                "source-map-loader": "^0.2.2",
                "ts-loader": "^3.0.2",
                "typescript": "^2.5.3",
                "uglifyjs-webpack-plugin": "^1.0.0-beta.3",
                "webpack": "^3.8.0",
                "webpack-dev-server": "^2.9.3",
                "dyn365-deploy-cli": "^1.0.102",
                "webpack-visualizer-plugin": "^0.1.11",
                "concurrently": "^3.5.0",
            },
            scripts: {
                webpackdev: `webpack-dev-server --config webpack.${this.props.name}.config.js --open --open-page stq_/html/${this.props.name}.html --hot --inline`,
                proxy: "node .\\node_modules\\dyn365-dev-proxy\\server.js",
                ["start-" + this.props.name]: "concurrently \"npm run webpackdev\" \"npm run proxy\"",
                ["build-" + this.props.name]: `webpack -p --config webpack.${this.props.name}.config.js`,
                ["deploy-" + this.props.name]: `npm run build-${this.props.name} && crm-deploy deploy ${this.props.name}`
            }
        });

        this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }

    install() {
        this.installDependencies({ bower: false });
    }

    end() {
        this.log("installation successful");
        this.log(`start the application by running: 'npm run start-${this.props.name}'`)
    }

}
