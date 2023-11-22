import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

function FavouriteContacts({ onFavouriteSelect }) {
    const [showAddFav, setShowAddFav] = useState(false);
    const [showSelectOption, setShowSelectOption] = useState(false);
    const [favourites, setFavourites] = useState([]);
    const [selectedFavourite, setSelectedFavourite] = useState(null);
    const [newFavourite, setNewFavourite] = useState({ name: '', email: '', billingAddress: '' });

    const handleShowAddFav = () => setShowAddFav(true);
    const handleCloseAddFav = () => setShowAddFav(false);
    const handleShowSelectOption = (fav) => {
        setSelectedFavourite(fav);
        setShowSelectOption(true);
    };
    const handleCloseSelectOption = () => setShowSelectOption(false);

    const handleInputChange = (event) => {
        setNewFavourite({ ...newFavourite, [event.target.name]: event.target.value });
    };

    const handleAddFavourite = () => {
        setFavourites([...favourites, newFavourite]);
        setNewFavourite({ name: '', email: '', billingAddress: '' });
        handleCloseAddFav();
    };

    const handleSelectFavourite = (option) => {
        onFavouriteSelect(selectedFavourite, option);
        handleCloseSelectOption();
    };

    return (
        <>
            <div className="favorite-section">
                <span className="fw-bold">My Favourite</span>
                <button className="plus-button" onClick={handleShowAddFav}>+</button>
            </div>
            <Modal show={showAddFav} onHide={handleCloseAddFav}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Favourite Contact</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                name="name"
                                value={newFavourite.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={newFavourite.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Billing Address</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Enter billing address"
                                name="billingAddress"
                                value={newFavourite.billingAddress}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleAddFavourite}>
                            Add
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showSelectOption} onHide={handleCloseSelectOption}>
                <Modal.Header closeButton>
                    <Modal.Title>Fill this favourite contact into column of:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="d-grid gap-2 col-6 mx-auto">
                        <Button class="btn btn-primary" onClick={() => handleSelectFavourite('billTo')}>
                            Bill To
                        </Button>
                        <Button class="btn btn-primary" onClick={() => handleSelectFavourite('billFrom')}>
                            Bill From
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <div>
                {favourites.map((fav, index) => (
                    <Button key={index} variant="outline-secondary" onClick={() => handleShowSelectOption(fav)}>
                        {fav.name}
                    </Button>
                ))}
            </div>
        </>
    );
}

export default FavouriteContacts;
