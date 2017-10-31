import * as React from 'react'
import { common } from 'crm-common-js'

interface state {
    accounts: any[];
    isLoading: boolean;
    filter: string;
}

class Example extends React.Component<{}, state> {

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: true,
            accounts: [],
            filter: "?$orderby=createdon desc&$select=name&$top=10"
        }
    }

    componentDidMount() {
        this.fetch();
    }

    fetch() {
        this.setState({ isLoading: true, accounts: [] });
        common.webapi.retrievemultiplerecords("accounts", this.state.filter, (data: any[]) => {
            this.setState({
                accounts: data,
                isLoading: false,
            });
        });
    }

    render() {
        return (
            <div>
                <h1>Example crm react component with data from dyn 365 odata</h1>

                <div style={{ maxWidth: "450px" }}>
                    <p>
                        This is a skeleton application to be used as a crm webresource inside dynamics 365. A quick and dirty example is provided to
                        show how to get started
                        </p>
                    <p>
                        If <a href="https://www.npmjs.com/package/dyn365-deploy-cli" target="_blank">dyn365-deploy-cli</a> is installed and correctly setup, a node express proxy is running from the node_modules dir, which authorizes
                        and delegates all request to '/api' to the dyn365 instance. This is to be able to make requests against the dyn 365 odata api while
                        developing on localhost.
                        </p>

                    <p>
                        Available operations via npm:
                            <ul>
                            <li><i>npm run start-<%= title %></i> <span style={{color: "red"}}>runs weppack-dev-server and the dev proxy. Transpilation is only in memory, i.e. cannot be uploaded to crm</span></li>
                            <li><i>npm run build-<%= title %></i> <span style={{color: "red"}}>transpiles the 'app' into the 'build' folder</span></li>
                            <li><i>npm run deploy-<%= title %></i> <span style={{color: "red"}}>runs build command, and then upload the files into crm and publishes the customizations. The html-file needs to be added to something inside crm. Mostly this would be a web resouce on a form</span></li>                            
                        </ul>
                    </p>

                </div>

                <div style={{
                    backgroundColor: "red",
                    margin: "5px",
                    padding: "5px"
                }}>
                    filter:<br />
                    <input style={{ width: "700px" }} value={this.state.filter} onChange={(e) => this.setState({ filter: e.target.value })} />
                    <br />
                    <button onClick={() => this.fetch()}>update filter</button>
                </div>

                {this.state.isLoading ? "Loading...." : null}
                {this.state.accounts.map((a, i) => {
                    return (
                        <div key={i} style={{
                            margin: "2px",
                            padding: "4px",
                            backgroundColor: (i === 0 || !!(i && !(i % 2))) ? 'white' : '#ccc'
                        }}>
                            {Object.keys(a).map((key, index) => {

                                return (
                                    <span style={{
                                        marginRight: "10px"
                                    }} key={index}><b>{key}:</b> {(a as any)[key]}</span>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Example