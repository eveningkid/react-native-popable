import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Popable, usePopable } from 'react-native-popable';

export default function App() {
  const [ref, { hide }] = usePopable();

  return (
    <View style={styles.container}>
      <Popable ref={ref} content="See profile">
        <Text onPress={hide}>@eveningkid</Text>
      </Popable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
