import React, { Component } from 'react';
import { Button, Icon, Form, Message, Progress } from 'semantic-ui-react';
import Layout from '../components/Layout';
import Web3 from 'web3';
import { Router } from '../routes';
import Tx from 'ethereumjs-tx';

class make_transaction extends Component {

	state ={
		loading : false,
		errorMessage : '',
		ishidden : true
	}

	onSubmit = async event =>{
		event.preventDefault();
		this.setState({loading : true, errorMessage : ''});
		 try {
			const provider = 'https://rinkeby.infura.io/v3/78bf7bf684434eff9eb7604d50c80ae1';
			const web3 = new Web3(provider);
			const system_address = '0x0F841E2b6909F5370a42Cc6759bB4caE6D3678F7';
			const system_private_key = Buffer.from('EB7376A5ADB4C3EEBBE790CADE0F62E92085C1952B9DA58B0CB05ADB6E834AF7', 'hex');

			const publisher_address = '0x2dF318e9E6d337795F281782873A130EbeE6Aa55';
			const publisher_private_key = Buffer.from('90E6C08ABC29B69C3063090A78163458E05ED0FF16D0FC4E20457F18F112CB7C', 'hex');

			//Printing Before transaction

			await web3.eth.getBalance(system_address, ( err, bal ) => {
				console.log('BEFORE SYSTEM ACCOUNT BALANCE : ', web3.utils.fromWei(bal, 'ether'));
			});

			await web3.eth.getBalance(publisher_address, ( err, bal ) => {
				console.log('BEFORE PUBLISHER ACCOUNT BALANCE : ', web3.utils.fromWei(bal, 'ether'));
			});

			//Making a transaction
			await web3.eth.getTransactionCount( system_address, ( err, txCount ) => {
				console.log("x-x-x-x-x-x-MAKING TRANSACTION-x-x-x-x-x-x-x");
				
				//Building transaction 
				 const TxObject = {
					nonce : web3.utils.toHex(txCount),
					to : publisher_address,
					value : web3.utils.toHex( web3.utils.toWei('0.01', 'ether') ),
					gasLimit : web3.utils.toHex(210000),
					gasPrice : web3.utils.toHex( web3.utils.toWei( '10', 'gwei' ) )
				}

				//sign a transaction
				const tx = new Tx(TxObject);
				tx.sign(system_private_key);

				const serializedTransaction = tx.serialize();
				const rawTx = '0x' + serializedTransaction.toString('hex');

				// Broadcast transaction
				web3.eth.sendSignedTransaction( rawTx, ( err , txHash ) => {
					console.log('Transaction Hash : ', txHash);
				} ).then( async () => {
					//Printing After transaction
					await web3.eth.getBalance(system_address, ( err, bal ) => {
						console.log('AFTER SYSTEM ACCOUNT BALANCE : ', web3.utils.fromWei(bal, 'ether'));
					});

					await web3.eth.getBalance(publisher_address, ( err, bal ) => {
						console.log('AFTER PUBLISHER ACCOUNT BALANCE : ', web3.utils.fromWei(bal, 'ether'));
					});
					console.log("completed");
					this.setState({ loading: false });
				} );
			} );

			
		} catch (err) {
			this.setState({ errorMessage : err.message, ishidden : false });
		}
		//Router.pushRoute('/');
	}

	render(){
		return (
			<Layout>
				<br />
				<div align='center'>
					<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
						<div align='center'>
						<h2>You are just one step away from claiming rewards</h2>
						</div>
						<br />
						<div align='center'>
						<Message error header="Oops!" content={this.state.errorMessage} />
						<Button animated='fade' className='massive' loading={this.state.loading} primary>
							<Button.Content hidden>
								<Icon name='gift' />
							</Button.Content>
							<Button.Content visible>
								Claim Rewards
							</Button.Content>
						</Button>
						<br />
						<br />
						</div>
						<div hidden={this.state.ishidden}>
						
							<Progress percent={90} error align="left">
								There was an error. Redirecting to homepage....
							</Progress>

						</div>
					</Form>
					
				</div>
			</Layout>
		);
	}
}
export default make_transaction;

