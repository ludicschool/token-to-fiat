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
            return (
                <div className="col text-center">
                    <h4>cargando!</h4>
                    </div>
                )
        }
        var precioDogma = process.env.REACT_APP_PRICE;
        var fiat = this.state.price
        const price = fiat / precioDogma        
        return (
            <div>
                <section>
                    <div className="product">
                        <form action="/create-checkout-session" method="POST">
                            <img
                                className="logo"
                                src={'../assets/Ludic.png'}
                                alt="Ludic School Logo"
                            />
                            <div className="description">
                                <h4>Precio Ludic: { precioDogma = process.env.REACT_APP_PRICE} $</h4>
                                <div>
                            </div>
                            <h6>
                            Cantidad a comprar en dolares: 
                            </h6>
                                <label>
                                    <input
                                        type="number" 
                                        name="price" 
                                        id="price" 
                                        placeholder='0'
                                        onChange={event => this.priceToState(event.target) }/>
                                </label>
                            </div>
                            <div>
                                <h4>
                                Total Ludic: { price } Ludic
                                </h4>
                            </div>
                            <div>
                            <h6>
                            Wallet conectada actualmente: 
                            </h6>
                                <label>
                                    <input type="text" name="wallet" id="wallet" value={this.props.children[1]}/>
                                </label>
                            <h6>
                            {this.props.children[1]}
                            </h6>
                            </div>
                            <button className='button' type="submit">
                                Comprar
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        )
    }
}
