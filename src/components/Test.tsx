import { useMutation, useLazyQuery } from '@apollo/client';
import Cookies from 'js-cookie';
import {
  LoginUserDocument,
  FindAllRestaurantsDocument,
  LoginUserInput,
} from '../__generated__/graphql';
import { useEffect } from 'react';

export default function Test() {
  const [login, { data: loginData }] = useMutation<LoginUserInput>(LoginUserDocument);
  const [findAllRestaurants, { data }] = useLazyQuery(FindAllRestaurantsDocument, {
    fetchPolicy: 'network-only',
  });

  console.log(loginData);

  if (data) {
    console.log(data);
  }

  useEffect(() => {
    if (loginData) {
      Cookies.set('accessToken', loginData.loginUser.accessToken, { expires: 1 });
      Cookies.set('refreshToken', loginData.loginUser.refreshToken, { expires: 1 });
    }
  }, [loginData]);

  return (
    <>
      <button
        onClick={() =>
          login({ variables: { input: { email: 'Clair22@hotmail.com', password: 'Qwerty123!' } } })
        }
      >
        Login
      </button>
      <button onClick={() => findAllRestaurants()}>Get resto</button>
    </>
  );
}
