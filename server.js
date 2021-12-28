require('dotenv').config()
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const express = require('express');
const app = express();
app.use(express.static('public'));
const Web3 = require("web3");
const axios = require('axios');
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

const changeContract = new web3.eth.Contract(ChangetokenAbi, process.env.contractChangeToken);
const YOUR_DOMAIN = process.env.domain;

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
      axios.get(process.env.pancakeUrl)
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
            console.log('New object created with objectId: ' + pay.id);
            res.setHeader("Content-Type", "text/html");
            
            var address = clienteReference
            price = session.amount_total / 100;
            dogma = price / precioDogma;

          //Funcion de moralis para calcular token con 18 decimales
            var dogmaSend = Moralis.Units.ETH(dogma);
            var priceSend = Moralis.Units.ETH(price);

            changeContract.methods.buy(priceSend,dogmaSend,address).send({from: '0x228caE4c3e91548AE04906b83d8041FE705AA977'}, function(error, result){
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
