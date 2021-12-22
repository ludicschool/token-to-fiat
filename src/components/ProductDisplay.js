import React, { Component } from 'react'

export default class ProductDisplay extends Component {
    constructor (props) {
        super (props)
        this.state = {
            api: "",
            price: "",
            contrato: "",
            isFetch: true,
        }
    }
        componentDidMount () {
        fetch("https://api.pancakeswap.info/api/v2/tokens/0xdee10834f93eaccfa2a35be0caebb91dda1ff09b")
        .then(valorApi => valorApi.json() )
        .then(apiJson => this.setState({api: apiJson.data.price, isFetch: false}) )
        .catch(error => alert('Error! ' + error.message))
    }
    priceToState = ({name, value}) => {
        this.setState(this.state = () => {
        return { [name]: value };
        });
    }
    render() {
        if (this.state.isFetch) {
            return 'loading...'
        }
        var precioDogma = this.state.api;
        var fiat = this.state.price
        const price = fiat / precioDogma        
        return (
            <div>
                <section>
                    <div className="product">
                        <form action="/create-checkout-session" method="POST">
                            <img
                                src="https://i.imgur.com/EHyR2nP.png"
                                alt="The cover of Stubborn Attachments"
                            />
                            <div className="description">
                                <h3>MY NFT</h3>
                                <h3>Precio DNA:</h3>
                                <h3>{ precioDogma = this.state.api } $</h3>
                                <div>
                            </div>
                                <label>
                                    Precio:
                                    <input
                                        type="number" 
                                        name="price" 
                                        id="price" 
                                        placeholder='0'
                                        onChange={event => this.priceToState(event.target) }/>
                                </label>
                            </div>
                            <div>
                                <label>
                                Total DNA:
                                </label>
                            </div>
                            <div>
                                <strong>
                                { price } DNA 
                                </strong>
                            </div>
                            <div>
                                <label>
                                    Wallet:
                                    <input type="text" name="wallet" id="wallet" value={this.props.children[1]}/>
                                </label>
                            </div>
                            <button type="submit">
                                Comprar
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        )
    }
}
