import React from "react";
import styled from "styled-components";
import ProductDisplay from "../components/ProductDisplay";
import { useMoralis } from "react-moralis";

const BuyPage = () => {
  const { authenticate, isAuthenticated, user } = useMoralis();
  if (!isAuthenticated) {
    return (
      <StyledExamplePage>
        <div>
          <img
            src={"../assets/Plant.png"}
            alt="Ludic School Logo"
            className="planta"
          />
        </div>
        <Heading className="animate__animated animate__fadeInLeft">
          No estas autenticado
        </Heading>
        <button onClick={() => authenticate()}>Authenticate</button>
      </StyledExamplePage>
    );
  } else {
    return (
      <StyledExamplePage>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 d-flex align-items-center justify-content-center">
              <div className=" d-none d-lg-block">
                <img
                  className="image"
                  src={"../assets/Plant.png"}
                  alt="Ludic School Logo"
                />
              </div>
            </div>
            <div className="col-lg-6 col-sm-12 col-md-12 col-xs-12">
              <div className="row">
                <Heading className="animate__animated animate__fadeInLeft bbb">
                  Compra Ludic
                </Heading>
              </div>
              <ProductDisplay> {user.get("ethAddress")} </ProductDisplay>
            </div>
            <div className="col-lg-3 d-flex align-items-center justify-content-center">
              <div className=" d-none d-lg-block">
                <img
                  className="image"
                  src={"../assets/Plant.png"}
                  alt="Ludic School Logo"
                />
              </div>
            </div>
          </div>
        </div>
      </StyledExamplePage>
    );
  }
};

const StyledExamplePage = styled.div`
  min-height: 100vh;
  width: 100vw;

  background-color: #afe1f7;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  -ms-flex-align: center;
`;

const Heading = styled.h1`
  font-size: clamp(3rem, 5vw, 7vw);
  color: #242d60;
  font-weight: 700;
  margin: 0;
  padding: 0;
  text-align: center;
  margin-bottom: 0.5rem;

  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
`;

export default BuyPage;
