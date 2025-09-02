import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import Store from './src/redux/store';
import RootContainer from './src/containers/root';
import { SafeAreaProvider } from 'react-native-safe-area-context';
;
import { SocketProvider } from './src/hooks/useSocket';



const App = () => {

  return (
    <>
      <SafeAreaProvider>

        <Provider store={Store}>
          <SocketProvider>
            <RootContainer />
          </SocketProvider>
        </Provider>

      </SafeAreaProvider>

    </>
  )
};
export default App;
