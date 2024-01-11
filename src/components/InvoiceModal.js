import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiPaperPlane, BiCloudDownload, BiPlusCircle } from "react-icons/bi";
import jsPDF from "jspdf";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp, doc, getDoc } from "firebase/firestore";
import { db, auth, storage } from "../firebase";
import emailjs from "@emailjs/browser";

function GeneratePDF() {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [612, 792],
  });

  const source = document.getElementById("invoiceCapture");
  const contentHeight = source.offsetHeight;
  const scaleFactor = 342 / contentHeight;
  return { pdf, source, scaleFactor };
}

async function GenerateInvoice(billTo) {
  return new Promise((resolve, reject) => {
    const { pdf, source, scaleFactor } = GeneratePDF();

    pdf.html(source, {
      callback: async function (pdf) {
        const totalPages = pdf.internal.getNumberOfPages();

        // Remove extra pages after the first page
        for (let i = totalPages; i > 1; i--) {
          pdf.deletePage(i);
        }
        // Get the PDF as a data URL directly
        const pdfDataUrl = pdf.output("datauristring");

        // Save the PDF data URL to Firebase Storage
        try {
          const currentDate = new Date().toISOString();
          const storageRef = ref(
            storage,
            `${
              auth.currentUser ? auth.currentUser.email : "GUEST"
            }/${currentDate}.pdf`
          );
          await uploadString(storageRef, pdfDataUrl, "data_url");
          const downloadURL = await getDownloadURL(storageRef);

          if (auth.currentUser) {
            // Save the PDF URL to Firestore if not guest user
            const pdfID = await savePdfUrlToFirestore(downloadURL, billTo);
          }
          resolve(downloadURL);
        } catch (error) {
          console.error("Error saving PDF to storage:", error);
          reject(error);
        }
      },
      x: 0,
      y: 0,
      html2canvas: {
        scale: scaleFactor,
      },
    });
  });
}

async function savePdfUrlToFirestore(pdfUrl, billTo) {
  const invoicesCollectionRef = collection(db, "invoice");
  var myTimestamp = Timestamp.fromDate(new Date());

  try {
    const docRef = await addDoc(invoicesCollectionRef, {
      email: auth.currentUser ? auth.currentUser.email : "GUEST",
      receiver: billTo,
      time: myTimestamp,
      link: pdfUrl,
    });
    return docRef.id;
  } catch (error) {
    console.error(error);
  }
}

async function savePdfToStorage() {
  const { pdf, source, scaleFactor } = GeneratePDF();

  pdf.html(source, {
    callback: async function (pdf) {
      const totalPages = pdf.internal.getNumberOfPages();

      // Remove extra pages after the first page
      for (let i = totalPages; i > 1; i--) {
        pdf.deletePage(i);
      }
      pdf.save("invoice-001.pdf");
    },
    x: 0,
    y: 0,
    html2canvas: {
      scale: scaleFactor,
    },
  });
}

async function SendInvoice(
  pdfURL,
  billFrom,
  billTo,
  billFromEmail,
  billToEmail
) {
  try {
    emailjs
      .send(
        "service_sk0273i",
        "template_edd8fcq",
        {
          billFrom: billFrom,
          billTo: billTo,
          billFromEmail: billFromEmail,
          billToEmail: billToEmail,
          message: pdfURL,
        },
        "a-mqEqfLpAycZy9yF"
      )
      .then((response) => {
        alert("Email sent successfully!");
      })
      .catch((error) => {
        alert("Email error: " + error);
      });
  } catch (error) {
    alert("PDF link is generating, click again to send the email");
  }
}

class InvoiceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoiceGenerated: false, // Track if invoice has been generated and stored
      currentPdfID: null,
    };
  }

  async setInvoiceID(billTo) {
    await GenerateInvoice(billTo).then((pdfURL) => {
      this.setState({ invoiceGenerated: true });
      this.setState({ currentPdfURL: pdfURL });
      console.log("Invoice URL is set to: " + this.state.currentPdfURL);
    });
  }

  async CheckGenerate(billTo) {
    if (!this.state.invoiceGenerated) {
      // Set invoiceGenerated state to true to prevent further duplication
      await this.setInvoiceID(billTo);
    }
    savePdfToStorage();
  }

  async CheckSend(billFromEmail, billToEmail, billFrom, billTo) {
    if (!this.state.invoiceGenerated) {
      alert("A moment, we are generating your pdf..");
      await this.setInvoiceID(billTo);
    }
    alert("Sending your email...");
    SendInvoice(
      this.state.currentPdfURL,
      billFrom,
      billTo,
      billFromEmail,
      billToEmail
    );
  }

  render() {
    return (
      <div>
        <Modal
          show={this.props.showModal}
          onHide={this.props.closeModal}
          size="lg"
          centered
        >
          <div id="invoiceCapture">
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h4 className="fw-bold my-2">
                  {this.props.info.billFrom || "John Uberbacher"}
                </h4>
                <h6 className="fw-bold text-secondary mb-1">
                  Invoice #: {this.props.info.invoiceNumber || ""}
                  {this.currentPdfID}
                </h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                <h5 className="fw-bold text-secondary">
                  {" "}
                  {this.props.currency} {this.props.total}
                </h5>
              </div>
            </div>
            <div className="p-4">
              <Row className="mb-4">
                <Col md={4}>
                  <div className="fw-bold">Billed to:</div>
                  <div>{this.props.info.billTo || ""}</div>
                  <div>{this.props.info.billToAddress || ""}</div>
                  <div>{this.props.info.billToEmail || ""}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold">Billed From:</div>
                  <div>{this.props.info.billFrom || ""}</div>
                  <div>{this.props.info.billFromAddress || ""}</div>
                  <div>{this.props.info.billFromEmail || ""}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold mt-2">Date Of Issue:</div>
                  <div>{this.props.info.dateOfIssue || ""}</div>
                </Col>
              </Row>
              <Table className="mb-0">
                <thead>
                  <tr>
                    <th>QTY</th>
                    <th>DESCRIPTION</th>
                    <th className="text-end">PRICE</th>
                    <th className="text-end">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.items.map((item, i) => {
                    return (
                      <tr id={i} key={i}>
                        <td style={{ width: "70px" }}>{item.quantity}</td>
                        <td>
                          {item.name} - {item.description}
                        </td>
                        <td className="text-end" style={{ width: "100px" }}>
                          {this.props.currency} {item.price}
                        </td>
                        <td className="text-end" style={{ width: "100px" }}>
                          {this.props.currency} {item.price * item.quantity}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Table>
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "100px" }}>
                      SUBTOTAL
                    </td>
                    <td className="text-end" style={{ width: "100px" }}>
                      {this.props.currency} {this.props.subTotal}
                    </td>
                  </tr>
                  {this.props.taxAmmount != 0.0 && (
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: "100px" }}>
                        TAX
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {this.props.currency} {this.props.taxAmmount}
                      </td>
                    </tr>
                  )}
                  {this.props.discountAmmount != 0.0 && (
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: "100px" }}>
                        DISCOUNT
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {this.props.currency} {this.props.discountAmmount}
                      </td>
                    </tr>
                  )}
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "100px" }}>
                      TOTAL
                    </td>
                    <td className="text-end" style={{ width: "100px" }}>
                      {this.props.currency} {this.props.total}
                    </td>
                  </tr>
                </tbody>
              </Table>
              {this.props.info.notes && (
                <div className="bg-light py-3 px-4 rounded">
                  {this.props.info.notes}
                </div>
              )}
            </div>
          </div>
          <div className="pb-4 px-4">
            <Row>
              <Col md={4}>
                <Button
                  variant="outline-primary"
                  className="d-block w-100"
                  onClick={() =>
                    this.CheckSend(
                      this.props.info.billFromEmail,
                      this.props.info.billToEmail,
                      this.props.info.billFrom,
                      this.props.info.billTo
                    )
                  }
                >
                  <BiPaperPlane
                    style={{ width: "15px", height: "15px", marginTop: "-3px" }}
                    className="me-2"
                  />
                  Send Invoice
                </Button>
              </Col>
              <Col md={4}>
                <Button
                  variant="outline-primary"
                  className="d-block w-100 mt-3 mt-md-0"
                  onClick={() => this.CheckGenerate(this.props.info.billTo)}
                >
                  <BiCloudDownload
                    style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                    className="me-2"
                  />
                  Download Copy
                </Button>
              </Col>
              <Col md={4}>
                <Button
                  variant="primary"
                  className="d-block w-100 mt-3 mt-md-0"
                  onClick={() => window.location.reload()}
                >
                  <BiPlusCircle
                    style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                    className="me-2"
                  />
                  Create New
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        <hr className="mt-4 mb-3" />
      </div>
    );
  }
}

export default InvoiceModal;
