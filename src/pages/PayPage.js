import React from 'react'
import styled from 'styled-components';
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

const PayPage = () => {

    const { authenticate, isAuthenticated, user } = useMoralis();
    const { data, error, fetch, isFetching, isLoading } = useWeb3ExecuteFunction({
        abi: "",
        contractAddress: "",
        functionName: "observe",
        params: {
            secondsAgos: [0, 10],
        },
    });

    if (!isAuthenticated) {
        return (
            <StyledContactPage>
                <Heading className="animate__animated animate__fadeInLeft">No estas autenticado</Heading>
                <button onClick={() => authenticate()}>Authenticate</button>
            </StyledContactPage>
        );
    } else {
        return (
            <StyledContactPage>
                <Heading className="animate__animated animate__fadeInLeft">Pay Page</Heading>
                <Content>
                    <h1>👋 Hola, tienes una deuda de: </h1>
                    <h2>  $<span></span></h2>
                    <button>Aprobar </button>
                    <button>Pagar</button>
                </Content>
            </StyledContactPage>
        )
    }

}

const StyledContactPage = styled.div`
    min-height: 100vh;
    width: 100vw;
    background-color: #282c34;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Heading = styled.h1`
    font-size: clamp(3rem, 5vw, 7vw);
    color: #eee;
    font-weight: 700;
    margin: 0;
    padding: 0;

    user-select: none; /* supported by Chrome and Opera */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
`;

const Content = styled.div`
    color: #eee;
    font-size: clamp(1.5rem, 2vw, 4vw);

    a {
        color: skyblue;
        text-decoration: none;
    }
`;

export default PayPage
