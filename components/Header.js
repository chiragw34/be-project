import React from 'react';
import {Menu, Label, Header, Icon} from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return(
        <div>
            <Header as='h2' icon textAlign='center'>
                <Icon name='gift' circular />
                <Header.Content>Rewards Based AD System</Header.Content>
            </Header>
        </div>

    );
};
