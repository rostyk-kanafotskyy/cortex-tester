import * as React from 'react';
import * as cortex from '@elasticpath/cortex-client';
import './DataTable.css'
import { ClientContext } from '../ClientContext';
import ReactJson from 'react-json-view'
import Zoom from '../zoom'
import Loading from './Loading';

interface DataTableState {
  data: any;
  zoom: string;
  loading: boolean;
  error: string;
}

class DataTable extends React.Component<any, DataTableState> {
  static contextType = ClientContext;
  static zoomKey = 'zoom';

  constructor(props: any) {
    super(props);
    const zoomString = localStorage.getItem('zoomKey');
    const zoom = zoomString ? JSON.parse(zoomString) : Zoom;
    this.state = {
      data: [],
      zoom: JSON.stringify(zoom, null, 2),
      loading: false,
      error: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // @ts-ignore
  client: cortex.IClient;

  async componentDidMount() {
    const { zoom } = this.state;
    this.client = this.context;
    try {
      this.setState({ loading: true });
      const root = await this.client.root().fetch(JSON.parse(zoom));
      this.setState({
        data: root,
        loading: false
      });
    } catch (e) {
      this.setState({ loading: false });
    }
  }

  handleChange(event: any) {
    let value = event.target.value;
    this.setState({zoom: value});
  }

  async handleSubmit(event: any) {
    event.preventDefault();
    const { zoom } = this.state;
    try {
      this.setState({ loading: true });
      const json = JSON.parse(zoom);
      const pacedJson = JSON.stringify(json, null, 2);
      // @ts-ignore
      const root = await this.client.root().fetch(JSON.parse(zoom));
      localStorage.setItem('zoomKey', pacedJson);
      this.setState({
        data: root,
        zoom: pacedJson,
        loading: false,
        error: ''
      });
    } catch (e) {
      this.setState({ loading: false, error: e.message });
    }
  }

  render() {
    const { data, zoom, loading, error } = this.state;
    return (
      <div className="data-container border-radius">
        <form className="input-data" onSubmit={this.handleSubmit}>
          <label>
            Zoom:
            <span className="error border-radius">{error}</span>
            <textarea name="zoom" className="border-radius" value={zoom} onChange={this.handleChange} />
          </label>
          <button className="border-radius" type="submit" disabled={loading}>
            { loading ? <Loading/> : 'Send' }
          </button>
        </form>

        <div className="json-data border-radius">
          <ReactJson src={data} />
        </div>
      </div>
    );
  }
}

export default DataTable;
