import React from 'react';
import { Button, Icon, Form, Message, Menu, Progress } from 'semantic-ui-react';
import { Link } from '../routes';


export default () => {
    return (
        <div>
            <div align='center'>
            <Link route='/'>
                <Button primary className='medium'>Add Account</Button>
            </Link>
            <Link route='/add-account'>
                <Button primary className='medium'>Claim Rewards</Button>
            </Link>
            </div>
        </div>
    );
};