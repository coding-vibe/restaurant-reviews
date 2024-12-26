import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';

interface Props {
  children?: ReactNode;
}

function App({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default App;
