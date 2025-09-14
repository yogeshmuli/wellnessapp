import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import Store from './src/redux/store';
import RootContainer from './src/containers/root';
import { SafeAreaProvider } from 'react-native-safe-area-context';
;
import { SocketProvider } from './src/hooks/useSocket';
import { ThemeProvider } from "./src/hooks/useTheme";


const App = () => {

  return (
    <>
      <SafeAreaProvider>
        <ThemeProvider>


          <Provider store={Store}>
            <SocketProvider>
              <RootContainer />
            </SocketProvider>
          </Provider>
        </ThemeProvider>

      </SafeAreaProvider>

    </>
  )
};
export default App;
