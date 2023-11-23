import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { getDocs, collection, where, query } from "firebase/firestore";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";

const InvoiceHistory = () => {
  const [invoiceList, setInvoiceList] = useState([]);
  const [userEmail, setUserEmail] = useState(""); // State to store the user's email
  const navigate = useNavigate();

  const invoiceCollectionRef = collection(db, "invoice");

  const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date
    return date.toLocaleString(); // Format the date as a string
  };

  useEffect(() => {
    // Check if there is an authenticated user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUserEmail(user.email); // Set the user's email to state
      } else {
        // No user is signed in
        setUserEmail(""); // Reset the user's email if not signed in
      }
    });

    return () => unsubscribe(); // Unsubscribe when the component unmounts
  }, []); // Empty dependency array to run once when the component mounts

  useEffect(() => {
    if (userEmail) {
      const q = query(invoiceCollectionRef, where("email", "==", userEmail));

      const getinvoiceList = async () => {
        try {
          const data = await getDocs(q);

          const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            time: formatTimestamp(doc.data().time),
          }));

          setInvoiceList(filteredData);
        } catch (error) {
          console.error(error);
        }
      };

      getinvoiceList();
    }
  }, [userEmail, invoiceCollectionRef]); // Add userEmail to the dependency array to trigger the effect when userEmail changes

  return (
    <div>
      <div>
        <button
          onClick={() => navigate("/form")}
          className="btn btn-secondary rounded"
          style={{ marginRight: "10px" }}
        >
          Back To Home
        </button>
      </div>
      <h1>InvoiceHistory</h1>

      <hr />

      <div>
        {invoiceList.map((invoice) => (
          <div className="mt-3 d-flex justify-content-between align-items-center border border-dark rounded p-4">
            <div className="d-flex justify-content-between">
              <p>{invoice.time}</p>
              <h6 className="ms-4">{invoice.receiver}</h6>
            </div>
            <div>
              <button
                className="btn btn-primary"
                onClick={() => window.open(invoice.link, "_blank")}
              >
                View Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceHistory;
