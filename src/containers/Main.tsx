import * as React from 'react';
import Config from '../config';
import * as cortex from '@elasticpath/cortex-client';
import { ClientProvider } from '../ClientContext';
import DataTable from '../components/DataTable';

interface MainState {
  oAuthToken: string | null;
}

class Main extends React.Component<any, MainState> {
  constructor(props: any) {
    super(props);
    this.state = {
      oAuthToken: localStorage.getItem(`${Config.scope}_oAuthToken`)
    };
    this.login = this.login.bind(this);
  }

  async componentDidMount() {
    if (!this.state.oAuthToken) {
      await this.login();
    }
  }

  generateFormBody() {
    let userFormBody: any = [];
    const userDetails: any = {
      username: '',
      password: '',
      grant_type: '',
      role: 'PUBLIC',
      scope: Config.scope,
    };
    Object.keys(userDetails).forEach((encodedKey) => {
      const encodedValue = userDetails[encodedKey];
      userFormBody.push(`${encodedKey}=${encodedValue}`);
    });
    return userFormBody.join('&');
  };

  async login() {
    const res = await fetch(`${Config.path}/oauth2/tokens`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: this.generateFormBody(),
    });
    const resJson = await res.json();
    const token = `Bearer ${resJson.access_token}`;
    localStorage.setItem(`${Config.scope}_oAuthToken`, token);
    this.setState({ oAuthToken: token });
  };

  render() {
    const { oAuthToken } = this.state;
    const cortexClient = cortex.createClient({
      serverBaseUrl: Config.path,
      authHeader: () => this.state.oAuthToken ? this.state.oAuthToken : '',
    });

    return (
      <ClientProvider value={cortexClient}>
        <div>
          { oAuthToken
              ? <DataTable />
              : <button onClick={this.login}>Auth</button>
          }
        </div>
      </ClientProvider>
    );
  }
}

export default Main;
