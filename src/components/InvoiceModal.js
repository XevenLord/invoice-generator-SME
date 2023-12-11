import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import { ref, uploadString, getDownloadURL  } from 'firebase/storage';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth, storage } from "../firebase";


// var userEmail = auth.currentUser ? auth.currentUser.email : 'GUEST';

function GenerateInvoice(billTo) {

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [612, 792],
  });

  const source = document.getElementById('invoiceCapture');
  
  // Determine the actual height of the content
  const contentHeight = source.offsetHeight;

  // Set a ratio to scale content to fit within the PDF page
  const scaleFactor = 342 / contentHeight; // Adjust 792 to the desired page height

  // Generate PDF with scaled content
  pdf.html(source, {
    callback: async function (pdf) {
      pdf.save('invoice-001.pdf');

      //save into firebase
      const pdfUrl = await savePdfToStorage(pdf);
      // alert(pdfUrl)
      await savePdfUrlToFirestore(pdfUrl, billTo);
    },
    x: 0,
    y: 0,
    html2canvas: {
      scale: scaleFactor,
    },
  });

}

async function savePdfToStorage(pdf) {

  try {
    // Generate data URL from the PDF blob
    const dataURL = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(pdf.output('blob'));
    });

    var currentDate = new Date().toISOString() // Format the current date
    // Save the PDF data URL to Firebase Storage
    const storageRef = ref(storage, `${auth.currentUser ? auth.currentUser.email : 'GUEST'}/${currentDate}.pdf`);
    await uploadString(storageRef, dataURL, 'data_url');

    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error saving PDF to storage:', error);
    throw error; // Re-throw the error for further handling
  }
}

async function savePdfUrlToFirestore(pdfUrl, billTo) {
  // Save the PDF URL to Firestore
  const invoicesCollectionRef = collection(db, 'invoice');
  var myTimestamp = Timestamp.fromDate(new Date());
  
  try {
    await addDoc(invoicesCollectionRef, { 
      email: auth.currentUser ? auth.currentUser.email : 'GUEST',
      receiver: billTo,
      time: myTimestamp,
      link: pdfUrl 
    });
    
  } catch (error) {
    console.error(error)
  }
}

// function GenerateInvoice() {
//   html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
//     const imgData = canvas.toDataURL('image/png', 1.0);
//     const pdf = new jsPDF({
//       orientation: 'portrait',
//       unit: 'pt',
//       format: [612, 792]
//     });
//     pdf.internal.scaleFactor = 1;
//     const imgProps= pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//     pdf.save('invoice-001.pdf');
//   });
// }

class InvoiceModal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
        <Modal show={this.props.showModal} onHide={this.props.closeModal} size="lg" centered>
          <div id="invoiceCapture">
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h4 className="fw-bold my-2">{this.props.info.billFrom||'John Uberbacher'}</h4>
                <h6 className="fw-bold text-secondary mb-1">
                  Invoice #: {this.props.info.invoiceNumber||''}
                </h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                <h5 className="fw-bold text-secondary"> {this.props.currency} {this.props.total}</h5>
              </div>
            </div>
            <div className="p-4">
              <Row className="mb-4">
                <Col md={4}>
                  <div className="fw-bold">Billed to:</div>
                  <div>{this.props.info.billTo||''}</div>
                  <div>{this.props.info.billToAddress||''}</div>
                  <div>{this.props.info.billToEmail||''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold">Billed From:</div>
                  <div>{this.props.info.billFrom||''}</div>
                  <div>{this.props.info.billFromAddress||''}</div>
                  <div>{this.props.info.billFromEmail||''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold mt-2">Date Of Issue:</div>
                  <div>{this.props.info.dateOfIssue||''}</div>
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
                        <td style={{width: '70px'}}>
                          {item.quantity}
                        </td>
                        <td>
                          {item.name} - {item.description}
                        </td>
                        <td className="text-end" style={{width: '100px'}}>{this.props.currency} {item.price}</td>
                        <td className="text-end" style={{width: '100px'}}>{this.props.currency} {item.price * item.quantity}</td>
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
                    <td className="fw-bold" style={{width: '100px'}}>SUBTOTAL</td>
                    <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.subTotal}</td>
                  </tr>
                  {this.props.taxAmmount != 0.00 &&
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{width: '100px'}}>TAX</td>
                      <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.taxAmmount}</td>
                    </tr>
                  }
                  {this.props.discountAmmount != 0.00 &&
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{width: '100px'}}>DISCOUNT</td>
                      <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.discountAmmount}</td>
                    </tr>
                  }
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{width: '100px'}}>TOTAL</td>
                    <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.total}</td>
                  </tr>
                </tbody>
              </Table>
              {this.props.info.notes &&
                <div className="bg-light py-3 px-4 rounded">
                  {this.props.info.notes}
                </div>}
            </div>
          </div>
          <div className="pb-4 px-4">
            <Row>
              <Col md={6}>
                <Button variant="primary" className="d-block w-100" onClick={() => GenerateInvoice(this.props.info.billTo)}>
                  <BiPaperPlane style={{width: '15px', height: '15px', marginTop: '-3px'}} className="me-2"/>Send Invoice
                </Button>
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={() => GenerateInvoice(this.props.info.billTo)}>
                  <BiCloudDownload style={{width: '16px', height: '16px', marginTop: '-3px'}} className="me-2"/>
                  Download Copy
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        <hr className="mt-4 mb-3"/>
      </div>
    )
  }
}

export default InvoiceModal;
