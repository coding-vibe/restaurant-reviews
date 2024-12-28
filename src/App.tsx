import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import Test from './components/Test';

interface Props {
  children?: ReactNode;
}

function App({ children }: Props) {
  return (
    <ApolloProvider client={client}>
      {children}
      <Test />
    </ApolloProvider>
  );
}

export default App;
