import { BookOutlined } from "@material-ui/icons";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { UserContext } from "../../App";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const loadingToken = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };
  useEffect(() => {
    fetch(
      "http://localhost:5000/bookings?email=" + loggedInUser.email,
      loadingToken
    )
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, []);
  return (
    <div style={{ padding: "20px" }}>
      <h3>You have {bookings.length} bookings.</h3>
      {bookings.map((book) => (
        <li key={book.id}>
          {book.name} from: {new Date(book.checkIn).toDateString("dd/MM/yyyy")}{" "}
          To: {new Date(book.checkOut).toDateString("dd/MM/yyyy")}
        </li>
      ))}
    </div>
  ); 
};

export default Bookings;
