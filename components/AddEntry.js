import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue,
  clearLocalNotification,
  setLocalNotification,
} from "../utils/helpers";
import UdaciSlider from "./UdaciSlider";
import UdaciStepper from "./UdaciStepper";
import DateHeader from "./DateHeader";
import TextButton from "./TextButton";
import { submitEntry, removeEntry } from "../utils/api";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { addEntry } from "../actions";
import { white, purple } from "../utils/colors";

const SubmitBtn = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={
        Platform.OS === "ios" ? styles.iosSubmitBtn : styles.androidSubmitBtn
      }
      onPress={onPress}
    >
      <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
  );
};

const AddEntry = (props) => {
  const [run, setRun] = useState(0);
  const [bike, setBike] = useState(0);
  const [swim, setSwim] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [eat, setEat] = useState(0);

  const increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);
    let count;
    if (metric === "run") {
      count = run + step;
      setRun(count > max ? max : count);
    } else if (metric === "bike") {
      count = bike + step;
      setBike(count > max ? max : count);
    } else if (metric === "swim") {
      count = swim + step;
      setSwim(count > max ? max : count);
    }
  };

  const decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric);
    let count;
    if (metric === "run") {
      count = run - step;
      setRun(count < 0 ? 0 : count);
    } else if (metric === "bike") {
      count = bike - step;
      setBike(count < 0 ? 0 : count);
    } else if (metric === "swim") {
      count = swim - step;
      setSwim(count < 0 ? 0 : count);
    }
  };

  const slide = (metric, value) => {
    if (metric === "sleep") {
      setSleep(value);
    } else if (metric === "eat") {
      setEat(value);
    }
  };

  const toHome = () => {
    props.navigation.goBack();
  };

  const submit = () => {
    const key = timeToString();
    const entry = [
      {
        run,
        bike,
        swim,
        sleep,
        eat,
      },
    ];

    //Update Redux
    props.dispatch(
      addEntry({
        [key]: entry,
      })
    );

    setRun(0);
    setBike(0);
    setSwim(0);
    setSleep(0);
    setEat(0);

    //Navigate to Home
    toHome();
    //save to DB
    submitEntry({ key, entry });

    //clear local notification
    clearLocalNotification().then(setLocalNotification);
  };

  const reset = () => {
    const key = timeToString();

    //Update Redux
    props.dispatch(
      addEntry({
        [key]: getDailyReminderValue(),
      })
    );

    //Route to home

    removeEntry(key);
  };

  const metaInfo = getMetricMetaInfo();

  if (props.alreadyLogged) {
    return (
      <View style={styles.center}>
        <Ionicons
          name={Platform.OS === "ios" ? "ios-happy" : "md-happy"}
          color={"black"}
          size={100}
        />
        <Text>You already logged your information today</Text>
        <TextButton style={{ padding: 10 }} onPress={reset}>
          Reset
        </TextButton>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <DateHeader date={new Date().toLocaleDateString()} />
      {Object.keys(metaInfo).map((key) => {
        const { getIcon, type, ...rest } = metaInfo[key];
        let value;
        if (key === "run") {
          value = run;
        } else if (key === "bike") {
          value = bike;
        } else if (key === "swim") {
          value = swim;
        } else if (key === "sleep") {
          value = sleep;
        } else if (key === "eat") {
          value = eat;
        }

        return (
          <View key={key} style={styles.row}>
            {getIcon()}
            {type === "slider" ? (
              <UdaciSlider
                value={value}
                onChange={(value) => slide(key, value)}
                {...rest}
              />
            ) : (
              <UdaciStepper
                value={value}
                onIncrement={() => increment(key)}
                onDecrement={() => decrement(key)}
                {...rest}
              />
            )}
          </View>
        );
      })}
      <SubmitBtn onPress={submit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: white,
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30,
  },
});

function mapStateToProps(state) {
  const key = timeToString();

  return {
    alreadyLogged: state[key][0] && typeof state[key][0].today === "undefined",
  };
}

export default connect(mapStateToProps)(AddEntry);
