import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { receiveEntries, addEntry } from "../actions";
import { timeToString, getDailyReminderValue } from "../utils/helpers";
import { fetchCalendarResults } from "../utils/api";
//import UdaciFitnessCalendar from "udacifitness-calendar-fix";
import { Agenda as UdaciFitnessCalendar } from "react-native-calendars";
import { white } from "../utils/colors";
import DateHeader from "./DateHeader";
import MetricCard from "./MetricCard";
import { AppLoading } from "expo";

const History = (props) => {
  const [ready, setReady] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  useEffect(() => {
    fetchCalendarResults()
      .then((entries) => props.dispatch(receiveEntries(entries)))
      .then(({ entries }) => {
        if (!entries[timeToString()]) {
          props.dispatch(
            addEntry({
              [timeToString()]: getDailyReminderValue(),
            })
          );
        }
      })
      .then(() => setReady(true));
  }, []);
  const renderItem = (dateKey, { today, ...metrics }, firstItemInDay) => {
    return (
      <View style={styles.item}>
        {today ? (
          <View>
            {/* <DateHeader /> */}
            <Text style={styles.noDataText}>{today}</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("Entry Detail", {
                entryId: dateKey,
              })
            }
          >
            <MetricCard metrics={metrics} />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };
  const renderEmptyDate = (formattedDate) => {
    return (
      <View style={styles.item}>
        <DateHeader date={formattedDate} />
        <Text style={styles.noDataText}>
          You didn't log any data on this day.
        </Text>
      </View>
    );
  };
  const { entries } = props;
  if (ready === false) {
    return <AppLoading />;
  }
  return (
    <UdaciFitnessCalendar
      items={entries}
      onDayPress={onDayPress}
      renderItem={(item, firstItemInDay) =>
        renderItem(selectedDate, item, firstItemInDay)
      }
      renderEmptyDate={renderEmptyDate}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    padding: 20,
    borderRadius: Platform.OS === "ios" ? 16 : 2,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: "center",
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: "rgba(0,0,0,0.24)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

function mapStateToProps(entries) {
  return {
    entries,
  };
}

export default connect(mapStateToProps)(History);
