import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {}

const Profile: FC<Props> = props => {
  return (
    <View style={styles.container}>
      <Text>Profile Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Profile;
