import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {}

const Home: FC<Props> = props => {
  return (
    <View style={styles.container}>
      <Text>Home Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Home;
