import React, { useState } from 'react';
import '../css/Createbook.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Createbook = () => {
  // State to hold book details
  const [bookDetails, setBookDetails] = useState({
    id: '',
    name: '',
    author: '',
    description: '',
    price: '',
    cover: null,
    bookFile: null,
    bookType: '',   // New state for book type
    subType: '',    // New state for sub-type
  });

  const navigate = useNavigate();

  // State for success message
  const [successMessage, setSuccessMessage] = useState('');

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookDetails({
      ...bookDetails,
      [name]: value,
    });
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    setBookDetails({
      ...bookDetails,
      bookFile: e.target.files[0],
    });
  };

  const handleCoverChange = (e) => {
    setBookDetails({
      ...bookDetails,
      cover: e.target.files[0],
    });
  };

  // Handle book type selection
  const handleBookTypeChange = (e) => {
    setBookDetails({
      ...bookDetails,
      bookType: e.target.value,
      subType: '', // Reset sub-type when main type changes
    });
  };

  const handleSubTypeChange = (e) => {
    setBookDetails({
      ...bookDetails,
      subType: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required fields are filled
    if (bookDetails.name && bookDetails.author && bookDetails.description && bookDetails.price && bookDetails.cover) {
      // Create FormData and append all fields
      const formData = new FormData();
      formData.append('name', bookDetails.name);
      formData.append('author', bookDetails.author);
      formData.append('description', bookDetails.description);
      formData.append('price', bookDetails.price);
      formData.append('cover', bookDetails.cover);
      formData.append('bookFile', bookDetails.bookFile);
      formData.append('bookType', bookDetails.bookType);  // Append book type
      formData.append('subType', bookDetails.subType);    // Append sub-type

      try {
        // Make the API request
        const response = await axios.post('http://localhost:8080/book/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Log the response data
        console.log(response.data);

        // Set the success message
        setSuccessMessage('Your book has been added successfully!');

        // Clear the form after successful submission
        setBookDetails({
          name: '',
          author: '',
          description: '',
          price: '',
          cover: null,
          bookFile: null,
          bookType: '',
          subType: '',
        });

        // Delay navigation to allow success message display
        setTimeout(() => {
          navigate('/');
        }, 1000);

      } catch (error) {
        console.error('Error uploading book:', error);
      }
    } else {
      alert('Please fill in all fields!');
    }
  };

  return (
    <div className="container">
      <h1>Book Management System</h1>

      <div className="form-section">
        <h2>Add a Book</h2>

        {/* Display success message if exists */}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={bookDetails.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Author:</label>
            <input
              type="text"
              name="author"
              value={bookDetails.author}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              rows="4"
              value={bookDetails.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={bookDetails.price}
              onChange={handleChange}
            />
          </div>

          {/* Book Type selection */}
          <div>
            <label>Book Type:</label>
            <select
              name="bookType"
              value={bookDetails.bookType}
              onChange={handleBookTypeChange}
            >
              <option value="">Select Book Type</option>
              <option value="fiction">Fiction</option>
              <option value="comedy">Comedy</option>
              <option value="selfcare">Selfcare Journal</option>
              <option value="financial">Financial Goal</option>
              <option value="historical">Historical Research</option>
              <option value="art">Art Journal</option>
              <option value="biography">Biography</option>
            </select>
          </div>

          {/* Conditionally render sub-types based on book type */}
          {bookDetails.bookType === 'fiction' || bookDetails.bookType === 'biography' ? (
            <div>
              <label>Sub-Type:</label>
              <select
                name="subType"
                value={bookDetails.subType}
                onChange={handleSubTypeChange}
              >
                <option value="">Select Sub-Type</option>

                {bookDetails.bookType === 'fiction' && (
                  <>
                    <option value="romantic">Romantic</option>
                    <option value="adventure">Adventure</option>
                  </>
                )}
                {bookDetails.bookType === 'biography' && (
                  <>
                    <option value="celebrity">Celebrity</option>
                    <option value="popularPerson">Popular Person</option>
                  </>
                )}
              </select>
            </div>
          ) : null}

          {/* Cover Image and PDF File Upload */}
          <div>
            <label>Cover Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
            />
          </div>
          <div>
            <label>Book PDF File:</label>
            <input
              type="file"
              accept="application/pdf/*"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit">Add Book</button>
        </form>
      </div>
    </div>
  );
};

export default Createbook;
