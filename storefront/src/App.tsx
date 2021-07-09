import React, { useState } from 'react';
import { useAuth } from "@saleor/sdk";
import { Switch, Route, useLocation} from 'react-router-dom';

import { SearchContainer } from './components/SearchContainer/SearchContainer';
import { ProductDetail } from './components/ProductDetail/ProductDetail'
import { NavBar } from './components/NavBar/NavBar';
import { HomePage } from './components/HomePage/HomePage';
import { useAccountConfirmationMutation} from './generated/graphql'
import { CategoryPage } from './components/CategoryPage/CategoryPage'

import './App.scss';

function App() {
  const [errors, setErrors] = useState()
  const { authenticated, user, signIn, signOut, registerAccount } = useAuth();
  const handleSignIn = async (email: string, password: string) => {
    const { data, dataError } = await signIn(email, password);

    if (dataError) {
      /**
       * Unable to sign in.
       **/
      setErrors(dataError.error);
      console.log("Sign In Error:", dataError);
    } else if (data) {
      /**
       * User signed in successfully.
       **/
      console.log("Sign In Successful:", data);
    }
  };

  const handleRegistration = async (email: string, password: string) => {
    const {data, dataError} = await registerAccount(email, password, 'http://localhost:3000/')
    return dataError ? { data: dataError} : {data}
  }
  const search = useLocation()?.search
  const email = new URLSearchParams(search)?.get('email')
  const token = new URLSearchParams(search)?.get('token')
  const [confirmAccount, {data}] = useAccountConfirmationMutation({
  })

  if (email && token) {
    confirmAccount({
      variables: { email, token}
    })
    if (data?.confirmAccount?.errors.length === 0) {
      console.log('Account confirmed')
    } else {
      console.error(data?.confirmAccount?.errors)
    }
  }

  return(
      authenticated && user ? (
          <>
          <NavBar signOut={signOut} />
          <Switch>
            <Route exact path="/search" component={SearchContainer} />
            <Route exact path="/products/:id" component={ProductDetail} />
            <Route exact path="/categories/:id" component={CategoryPage} />
          </Switch>
          </>
        ): (
          <HomePage 
            handleSignIn={handleSignIn}
            handleRegistration={handleRegistration}
            errors={errors}/>
        )
  );
}

export default App;
