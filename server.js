require('dotenv').config()
const stripe = require('stripe')(process.env.stripeToken);
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
    cancel_url: `http://localhost:3000/cancel.html`,
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
        //precio si cuando funcione el api 
       //precioDogma = api;
        //precio sin el api
        precioDogma = process.env.priceWithoutApi

      
      });
      if (results.length > 0) {
        res.setHeader("Content-Type", "text/html");
        res.write(`<html><body > <div class="di"> <img src="https://ludic.school/wp-content/uploads/2021/12/Final-03-1536x469.png" alt="Logo"> <section> <div style=" text-align: center; justify-content: center; align-items: center; "> <div class="container"> <h1>Ooops. Ha Ocurrido Un Error!</h1> <h2>La transaccion ya fue realizada!</h2> <a href="https://ludic.school/" class="button">Volver a intentar</a> </div> </div> </section> </div> <style> body { background: #AFE1F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Ubuntu', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } h2,h1 { font-style: normal; font-size: 3rem; line-height: auto; color: #242d60; margin: 0; opacity: 0.5; } img { width: 45rem; } section{ background: #6FC5A8; display: block; position: relative; width: 100%; height: auto; border-radius: 1rem; padding: 1rem; margin:auto; margin-top: 0%; text-align:center; } .button { border-radius: 0.4rem; width: 20rem; font-size: 2rem; border: 0rem; margin-top: 1%; text-align:center; color: #fff; } button:hover { opacity: 10.5; cursor: pointer; box-shadow: -1px 1px 8px #AFE1F7; color: #AFE1F7; } .di{ min-height: 100vh; width: 100vw; background-color: #AFE1F7; display: flex; flex-direction: column; justify-content: center; align-items: center; } </style> </body></html>`);
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

            changeContract.methods.buy(priceSend,dogmaSend,address).send({from: process.env.walletOwner}, function(error, result){
              console.log('error aqui',error);
              console.log('resultado aqui',result);
            });
            res.write(`<html><body > <div class="di"> <img src="https://ludic.school/wp-content/uploads/2021/12/Final-03-1536x469.png" alt="Logo"> <section> <div style=" text-align: center; justify-content: center; align-items: center; "> <div class="container"> <h1>Gracias por su compra, ${customer.name}! </h1> <h2>La transaccion fue realizada con exito!</h2> <a href="https://ludic.school/" class="button">Volver a inicio</a> </div> </div> </section> </div> <style> body { background: #AFE1F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Ubuntu', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } h2,h1 { font-style: normal; font-size: 3rem; line-height: auto; color: #242d60; margin: 0; opacity: 0.5; } img { width: 45rem; } section{ background: #6FC5A8; display: block; position: relative; width: 100%; height: auto; border-radius: 1rem; padding: 1rem; margin:auto; margin-top: 0%; text-align:center; } .button { border-radius: 0.4rem; width: 20rem; font-size: 2rem; border: 0rem; margin-top: 1%; text-align:center; color: #fff; } button:hover { opacity: 10.5; cursor: pointer; box-shadow: -1px 1px 8px #AFE1F7; color: #AFE1F7; } .di{ min-height: 100vh; width: 100vw; background-color: #AFE1F7; display: flex; flex-direction: column; justify-content: center; align-items: center; } </style> </body></html>`);
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
    res.send(`<html><body > <div class="di"> <img src="https://ludic.school/wp-content/uploads/2021/12/Final-03-1536x469.png" alt="Logo"> <section> <div style=" text-align: center; justify-content: center; align-items: center; "> <div class="container"> <h1>Ooops. Ha Ocurrido Un Error!</h1> <h2>La transaccion fue rechazada!</h2> <a href="https://ludic.school/" class="button">Volver a intentar</a> </div> </div> </section> </div> <style> body { background: #AFE1F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Ubuntu', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } h2,h1 { font-style: normal; font-size: 3rem; line-height: auto; color: #242d60; margin: 0; opacity: 0.5; } img { width: 45rem; } section{ background: #6FC5A8; display: block; position: relative; width: 100%; height: auto; border-radius: 1rem; padding: 1rem; margin:auto; margin-top: 0%; text-align:center; } .button { border-radius: 0.4rem; width: 20rem; font-size: 2rem; border: 0rem; margin-top: 1%; text-align:center; color: #fff; } button:hover { opacity: 10.5; cursor: pointer; box-shadow: -1px 1px 8px #AFE1F7; color: #AFE1F7; } .di{ min-height: 100vh; width: 100vw; background-color: #AFE1F7; display: flex; flex-direction: column; justify-content: center; align-items: center; } </style> </body></html>`);
  }




});


class Payment extends Moralis.Object {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Payment');

  }
}

app.listen(4242, () => console.log('Running on port 4242'));
