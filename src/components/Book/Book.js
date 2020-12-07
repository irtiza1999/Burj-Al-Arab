import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../App";

import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Bookings from "../Bookings/Bookings";

const Book = () => {
  const { bedType } = useParams();
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [selectedDate, setSelectedDate] = useState({
    checkIn: new Date(),
    checkOut: new Date(),
  });

  const handleCheckInDate = (date) => {
    const newDates = { ...selectedDate };
    newDates.checkIn = date;
    setSelectedDate(newDates);
  };
  const handleCheckOutDate = (date) => {
    const newDates = { ...selectedDate };
    newDates.checkOut = date;
    setSelectedDate(newDates);
  };

  const handleBooking = () => {
    const newBooking = { ...loggedInUser, ...selectedDate };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBooking),
    };
    fetch("http://localhost:5000/addBooking", options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>
        Hello, {loggedInUser.name} Let's book a {bedType} Room.
      </h1>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Check In Date"
            value={selectedDate.checkIn}
            onChange={handleCheckInDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Check Out Date"
            format="dd/MM/yyyy"
            value={selectedDate.checkOut}
            onChange={handleCheckOutDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </Grid>
        <Button onClick={handleBooking} variant="contained" color="primary">
          Book now
        </Button>
      </MuiPickersUtilsProvider>
      <p>
        Want a <Link to="/home">different room?</Link>{" "}
      </p>
      <Bookings></Bookings>
    </div>
  );
};

export default Book;
