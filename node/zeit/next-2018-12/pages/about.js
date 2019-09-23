// import React from 'react';

export default class extends React.Component {
    static getInitialProps({req, url}) {
        return { servers: req ? true : false, url2: url, query: req.query };
    }
    // constructor() {
    //     this.setState({aaa : 10});
    // }
    render() {
        return <div>
            <h1>about 4: </h1>
            <pre>{JSON.stringify(this.props, null, '    ')}</pre>
        </div>;
    }
}
