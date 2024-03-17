import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/KhelKhojLogo.png";
import axios from "axios";
import Swal from "sweetalert2";
import "../Styles/Wallet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";

function ClubWallet() {
  const [walletBalance, setWalletBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [visibleTransactions, setVisibleTransactions] = useState(5); // State to manage visible transactions

  const navigate = useHistory();

  const fetchWalletBalance = () => {
    axios
      .get("http://localhost:3001/club/wallet/balance")
      .then((res) => {
        if (res.data.status === "Success") {
          setWalletBalance(res.data.wallet_balance);
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
      .get(`http://localhost:3001/club/transactions`)
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

  console.log(transactions);
  useEffect(() => {
    fetchWalletBalance();
    fetchTransactions();
  }, []);

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
            <Link to="/welcomeClub" className="links">
              Home
            </Link>
          </ul>
        </div>
      </div>
      <div className="walletPageContainer">
        <h1 style={{ marginLeft: "3%", marginTop: "2%" }}>
          Transaction history
        </h1>
        <div className="addBalanceContainer">
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
        </div>
        <div className="transactionsContainer">
          {transactions.length > 0 ? (
            <table className="transactionsTable">
              <thead>
                <tr>
                  <th>Transaction Time</th>
                  <th>Transaction Type</th>
                  <th>Transaction Amount</th>
                  <th>Action</th>
                  <th>User</th>
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
                      </td>
                      <td>{transaction.user_name}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="noTransactions">
              <h3>There are no previous transactions to show at the moment.</h3>
            </div>
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

export default ClubWallet;
