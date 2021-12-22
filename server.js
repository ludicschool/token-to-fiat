require('dotenv').config()
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const e = require('express');
const express = require('express');
const app = express();
app.use(express.static('public'));
const Web3 = require("web3");
const { create, globSource } = require('ipfs-http-client')
const ipfs = create('http://127.0.0.1:5002')
const NFTAbi = require('./NFT.json')
const fs = require('fs');
const axios = require('axios');
const BigNumber = require('bignumber.js');

const ChangetokenAbi = require('./Changetoken.json')

const HDWalletProvider = require("@truffle/hdwallet-provider");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Moralis = require('moralis/node');
const serverUrl = process.env.serverUrl;
const appId = process.env.appId;
const masterKey = process.env.masterKey;  
Moralis.start({ serverUrl, appId, masterKey });
const mnemonic = process.env.mnemonic;

var precioDogma
var price
var dogma
var api

const provider = new HDWalletProvider(mnemonic, "https://data-seed-prebsc-1-s1.binance.org:8545");
const web3 = new Web3(provider);

const changeContract = new web3.eth.Contract(ChangetokenAbi, "0x031c0BCa1dBDE2A9D14b72f27c3Fb109334ac29e");
const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {

        price_data: {
          currency: "USD",
          unit_amount: req.body.price * 100,
          product_data: {
            name: "NFT"
          }
        },
        quantity: 1,
      },

    ],
    client_reference_id: req.body.wallet,
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

app.get('/order/success', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer);
  console.log(session.status);
  if (session.status == "complete") {

    try {
      const idSession = session.id;
      const clienteReference = session.client_reference_id;
      const paymentIntent = session.payment_intent;
      const Payment = Moralis.Object.extend("Payment");
      const query = new Moralis.Query(Payment);
      query.equalTo("idSession", idSession);
      query.equalTo("clienteReference", clienteReference);
      query.equalTo("paymentIntent", paymentIntent);
      const results = await query.find();

          
      axios.get('https://api.pancakeswap.info/api/v2/tokens/0xdee10834f93eaccfa2a35be0caebb91dda1ff09b')
      .then(function (response) {
      api = response.data.data.price;
      })
      .catch(function (error) {
      console.log(error);
      })
      .then(function () {
      precioDogma = api;
      
      });

            
      if (results.length > 0) {
        res.setHeader("Content-Type", "text/html");
        res.write(`<html><body><h1>Esta transaccion ya fue hecha!</h1></body></html>`);
      } else {
        const pay = new Payment();
        pay.set("idSession", idSession);
        pay.set("clienteReference", clienteReference);
        pay.set("paymentIntent", paymentIntent);
        pay.save()
          .then((pay) => {
            // Execute any logic that should take place after the object is saved.
            console.log('New object created with objectId: ' + pay.id);
            res.setHeader("Content-Type", "text/html");
            
            var address = clienteReference
            price = session.amount_total / 100;
            console.log('price', price);
            dogma = price / precioDogma;
            console.log('dogma', dogma);

          //Funcion de moralis para calcular token con 18 decimales
            var dogmaSend = Moralis.Units.ETH(dogma);
            var priceSend = Moralis.Units.ETH(price);

            console.log('dogmaSend', dogmaSend);
            console.log('priceSend', priceSend);

            changeContract.methods.buy(priceSend,dogmaSend,address).call({from: '0x2C464075B2da12cd146C7F51dDcBBfCf523cEfba'}, function(error, result){
              console.log('error aqui',error);
              console.log('resultado aqui',result);
            });
            res.write(`<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`);
          }, (error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            console.log('Failed to create new object, with error code: ' + error.message);
          });
      }
    }
    catch (e) {
      console.log(e);
    }

  } else {
    res.send(`<html><body><h1>La transaccion fue rechazada!</h1></body></html>`);
  }




});


class Payment extends Moralis.Object {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Payment');

  }
}

app.listen(4242, () => console.log('Running on port 4242'));
