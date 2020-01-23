import React from 'react';
import Header from './Header';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Navbar from './Navbar';

export default props => {
    return (
        <Container>
        <Head>
            <title>Reward Based AD System</title>
            <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
            />
        </Head>
            <br />
            <Header />
            <Navbar />
            {props.children}
        </Container>
    );
};
