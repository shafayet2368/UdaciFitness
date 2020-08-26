import React from "react";
import { View, Text } from "react-native";
import { purple } from "../utils/colors";

const DateHeader = (props) => {
  return (
    <View>
      <Text style={{ color: purple, fontSize: 25 }}>
        {new Date(props.date).toLocaleDateString()}
      </Text>
    </View>
  );
};

export default DateHeader;
