/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button, TextInput, ScrollView } from "react-native";
import { Overlay, Alert, Loading, Toast } from "rn-notifier";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android: "Double tap R on your keyboard to reload,\n" + "Shake or press menu button for dev menu"
});

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Button onPress={() => this.ref1.show()} title="Show overlay" />
        <Button onPress={() => this.ref2.show()} title="Show overlay as modal" />
        <Button
          onPress={() => this.ref3.show("", () => setTimeout(() => this.ref3.hide(), 3000))}
          title="Show loading and hide after 3s"
        />
        <Button
          onPress={() =>
            this.ref4.show("This is a message", () => setTimeout(() => this.ref4.hide(), 3000))
          }
          title="Show loading with message and hide after 3s "
        />
        <Button onPress={() => this.alert.show("", "This is a message")} title="Show alert" />
        <Button
          onPress={() =>
            this.alert.show(
              "",
              "This is a message",
              () => console.log("OK"),
              () => console.log("Cancel")
            )
          }
          title="Show alert confirm"
        />
        <Button
          onPress={() =>
            this.alert.show(
              "Title",
              "This is a message",
              () => console.log("OK"),
              () => console.log("Cancel")
            )
          }
          title="Show alert with title"
        />
        <Button
          onPress={() => this.toast.show("Title", "This is a message", "Error", 3000)}
          title="Show toast error"
        />
        <Button
          onPress={() => this.toast.show("Title", "This is a message", "Warn", 3000)}
          title="Show toast warn"
        />
        <Button
          onPress={() => this.toast.show("Title", "This is a message", "Info", 3000)}
          title="Show toast info"
        />
        <Button
          onPress={() => this.toast.show("Title", "This is a message", "Success")}
          title="Show toast success"
        />
        <Toast ref={r => (this.toast = r)} />
        <Alert ref={r => (this.alert = r)} />
        <Overlay
          contentStyle={{ height: 400 }}
          animationType="scale"
          ref={r => (this.ref1 = r)}
          onPressOutside={() => {}}
        >
          <View>
            <ScrollView>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.instructions}>{instructions}</Text>
              <TextInput placeholder="Text input" />
            </ScrollView>
          </View>
        </Overlay>

        <Overlay
          contentStyle={{ height: 500 }}
          animationType="scale"
          ref={r => (this.ref2 = r)}
          onPressOutside={() => {}}
          useModal
        >
          <View>
            <ScrollView>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.instructions}>{instructions}</Text>
              <TextInput placeholder="Text input" />
            </ScrollView>
          </View>
        </Overlay>

        <Loading ref={r => (this.ref3 = r)} />
        <Loading useModal ref={r => (this.ref4 = r)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
