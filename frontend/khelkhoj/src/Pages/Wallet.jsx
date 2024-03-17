import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/KhelKhojLogo.png";
import axios from "axios";
import Swal from "sweetalert2";
import "../Styles/Wallet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";

function Wallet() {
  const [walletBalance, setWalletBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [visibleTransactions, setVisibleTransactions] = useState(5); // State to manage visible transactions
  const [values, setValues] = useState({
    amount: "",
  });
  const navigate = useHistory();

  const fetchWalletBalance = () => {
    axios
      .get("http://localhost:3001/user/wallet/balance")
      .then((res) => {
        if (res.data.status === "Success") {
          setWalletBalance(res.data.balance);
        } else {
          console.error("Error fetching wallet balance:", res.data.error);
        }
      })
      .catch((err) => {
        console.error("Error fetching wallet balance:", err);
      });
  };
  const fetchTransactions = () => {
    axios
      .get(`http://localhost:3001/user/transactions`)
      .then((res) => {
        if (res.data.status === "Success") {
          const sortedTransactions = res.data.transactions.sort((a, b) => {
            return new Date(b.transaction_time) - new Date(a.transaction_time);
          });
          setTransactions(sortedTransactions);
        } else {
          console.error("Error fetching transactions:", res.data.error);
        }
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
      });
  };

  useEffect(() => {
    fetchWalletBalance();
    fetchTransactions();
  }, []);

  const handleAmountChange = (e) => {
    setValues({ ...values, amount: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (walletBalance >= 10000) {
      Swal.fire({
        title: "Wallet Limit Reached!",
        text: "The maximum limit for your wallet balance is 10,000.",
        confirmButtonText: "OK",
        confirmButtonColor: "#f19006",
        icon: "warning",
      });
      return;
    }

    axios
      .post("http://localhost:3001/user/wallet/add", values)
      .then((res) => {
        if (res.data.status === "Success") {
          Swal.fire({
            title: "Amount Added to Wallet!",
            text: res.data.message,
            confirmButtonText: "Home",
            confirmButtonColor: "#f19006",
            icon: "success",
          }).then(() => {
            navigate.push("/welcomeUser");
          });
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          const errorMessage = err.response.data.error;
          if (errorMessage.includes("maximum")) {
            Swal.fire({
              title: "Wallet Limit Exceeded!",
              text: "The maximum limit for your wallet balance is 10,000.",
              confirmButtonText: "OK",
              confirmButtonColor: "#f19006",
              icon: "warning",
            });
            return;
          }
          console.error("Error:", errorMessage);
          if (errorMessage.includes("amount")) {
            Swal.fire({
              title: "Invalid amount!",
              text: "Kindly ensure the amount entered is between 100 and 10,000.",
              confirmButtonText: "OK",
              confirmButtonColor: "#f19006",
              icon: "warning",
            });
            return;
          }
        } else {
          console.error("Unexpected error occurred:", err);
        }
      });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleShowMore = () => {
    setVisibleTransactions((prevVisible) => prevVisible + 5);
  };

  return (
    <div className="container" style={{ paddingBottom: "6%" }}>
      <div className="header">
        <img className="logo" src={logo} alt="Khel-Khoj" />
        <Link style={{ textDecoration: "none" }} to="/">
          <p
            style={{
              color: "#F19006",
              fontFamily: "Quicksand",
              fontSize: "28px",
            }}
          >
            Khel-Khoj
          </p>
        </Link>
        <div className="nav-links">
          <ul className="ulLink">
            <Link to="/welcomeUser" className="links">
              Home
            </Link>
          </ul>
        </div>
      </div>
      <div className="walletPageContainer">
        <h1 style={{ marginLeft: "3%", marginTop: "2%" }}>Wallet</h1>
        <form onSubmit={handleSubmit} className="addBalanceContainer">
          <h2
            style={{
              marginLeft: "3%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            Balance{" "}
            <FontAwesomeIcon
              icon={faIndianRupeeSign}
              style={{ marginRight: "2px", marginLeft: "8%" }}
            />
            <span style={{ color: "#f99810" }}>{walletBalance}</span>
          </h2>
          <input
            onChange={handleAmountChange}
            type="number"
            id="amount"
            autoFocus
            min={100}
            max={10000}
            placeholder="0.00"
            className="balanceAddField"
          ></input>{" "}
          <button className="addAmountButton">Add amount</button>
        </form>
        <div className="transactionsContainer">
          {transactions.length > 0 ? (
            <table className="transactionsTable">
              <thead>
                <tr>
                  <th>Transaction Time</th>
                  <th>Transaction Type</th>
                  <th>Transaction Amount</th>

                  <th>Action</th>
                  <th>Club</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .slice(0, visibleTransactions)
                  .map((transaction, index) => (
                    <tr className="transaction" key={index}>
                      <td>{formatTimestamp(transaction.transaction_time)}</td>
                      <td>
                        {transaction.transaction_type === "debit"
                          ? "Debit"
                          : "Credit"}
                      </td>
                      <td
                        className={
                          transaction.transaction_type === "debit"
                            ? "debitAmount"
                            : "creditAmount"
                        }
                      >
                        {transaction.amount}
                      </td>

                      <td>
                        {transaction.operation === "booking" &&
                          "Ground Booking"}
                        {transaction.operation === "cancellation" &&
                          "Ground Cancellation"}
                        {transaction.operation === "recharge" &&
                          "Wallet Top Up"}
                      </td>
                      <td>{transaction.club_name}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <di className="noTransactions">
              <h3>There are no previous transactions to show at the moment.</h3>
            </di>
          )}
        </div>

        <div className="showMoreContainer">
          {transactions.length > visibleTransactions && (
            <button className="showMoreButton" onClick={handleShowMore}>
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wallet;
