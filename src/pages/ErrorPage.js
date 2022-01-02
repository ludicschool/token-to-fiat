import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';



const ErrorPage = () => {
return (
<StyledErrorPage>
<section>
        <div className="container"> 
        <div className="row"> 
        <div className="col-lg-3 d-flex align-items-center justify-content-center"> 
            <div className=" d-none d-lg-block"> 
            <img
            className="image"
            src={'../assets/Plant.png'}
            alt="Ludic School Logo"
            />
            </div> 
            </div>
        <div className="col-lg-6 col-sm-12 col-md-12 col-xs-12 text-center"> 
        <div className="row"> 
  
            <h2 className="animate__animated animate__fadeInLeft">Ooops. Ha Ocurrido Un Error!</h2>
            <h3 className="animate__animated animate__fadeInLeft">Vuelva a intentar su transacción</h3>
            <Link to="/" className='btn btn-primary'>
            Volver a intentar
                </Link>
        </div>
        </div>
        <div className="col-lg-3 d-flex align-items-center justify-content-center"> 
                <div className=" d-none d-lg-block"> 
                <img
                className="image"
                src={'../assets/Plant.png'}
                alt="Ludic School Logo"
                />
                </div> 
                </div>
        </div>
        </div> 
        </section>
</StyledErrorPage>
)}
const StyledErrorPage = styled.div`
    min-height: 100vh;
    width: 100vw;
    background-color: #AFE1F7;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;


export default ErrorPage
