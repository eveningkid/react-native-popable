import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Popable } from 'react-native-popable';

export default function App() {
  return (
    <View style={styles.container}>
      <Popable content="See profile">
        <Text>@eveningkid</Text>
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
