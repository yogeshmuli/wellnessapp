import React from 'react';
import { Provider } from 'react-redux';
import Store from './src/redux/store';
import RootContainer from './src/containers/root';
import Config from 'react-native-config';

const App = () => {
  return (
    <Provider store={Store}>
      <RootContainer />
    </Provider>
  );
};
export default App;
