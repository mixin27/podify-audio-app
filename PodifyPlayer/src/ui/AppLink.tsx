import colors from '@utils/colors';
import {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

interface Props {
  title: string;
  onPressed?(): void;
}

const AppLink: FC<Props> = ({title, onPressed}) => {
  return (
    <Pressable onPress={onPressed}>
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
