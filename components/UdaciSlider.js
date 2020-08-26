import React from "react";
import { View, Text, Slider, StyleSheet } from "react-native";
import { gray } from "../utils/colors";

const UdaciSlider = (props) => {
  return (
    <View style={styles.row}>
      <Slider
        style={{ flex: 1 }}
        step={props.step}
        value={props.value}
        maximumValue={props.max}
        minimumValue={0}
        onValueChange={props.onChange}
      />
      <View style={styles.metricCounter}>
        <Text style={{ fontSize: 24, textAlign: "center" }}>{props.value}</Text>
        <Text style={{ fontSize: 18, color: gray }}>{props.unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  metricCounter: {
    width: 85,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UdaciSlider;
