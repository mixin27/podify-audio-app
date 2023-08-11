import colors from '@utils/colors';
import {FC} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import Loader from './Loader';

interface Props {
  title: string;
  onPressed?(): void;
  busy?: boolean;
  borderRadius?: number;
}

const AppButton: FC<Props> = ({title, busy, onPressed, borderRadius}) => {
  return (
    <Pressable
      onPress={onPressed}
      style={[
        styles.container,
        {
          borderRadius: borderRadius || 25,
        },
      ]}>
      {!busy ? <Text style={styles.title}>{title}</Text> : <Loader />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default AppButton;
