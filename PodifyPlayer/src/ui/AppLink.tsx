import colors from '@utils/colors';
import {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

interface Props {
  title: string;
  onPressed?(): void;
  active?: boolean;
}

const AppLink: FC<Props> = ({title, active = true, onPressed}) => {
  return (
    <Pressable
      onPress={active ? onPressed : null}
      style={{opacity: active ? 1 : 0.4}}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.SECONDARY,
  },
});

export default AppLink;
