import AppContainer from '@components/AppContainer';
import {Provider} from 'react-redux';
import AppNavigator from 'src/navigation';
import store from 'src/store';

interface Props {}

const App = () => {
  return (
    <Provider store={store}>
      <AppContainer>
        <AppNavigator />
      </AppContainer>
    </Provider>
  );
};

export default App;
