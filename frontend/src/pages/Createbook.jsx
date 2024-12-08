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
    bookType: '', // New state for book type
    subType: '', // New state for sub-type
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
      formData.append('bookType', bookDetails.bookType); // Append book type
      formData.append('subType', bookDetails.subType); // Append sub-type

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
      <h1 onClick={()=>navigate('/')}>E-Library</h1>

      {/* START: Search Functionality */}
      {/*
      // State for search input
      const [searchInput, setSearchInput] = useState('');

      // Handle search functionality
      const handleSearch = () => {
        console.log('Searching for:', searchInput); // Replace with actual search logic
        setSearchInput(''); // Clear search input
      };
      */}
      {/*
      // Add search functionality block in HTML:
      <div className="search-section">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for books"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      */}
      {/* END: Search Functionality */}

      <form onSubmit={handleSubmit}>
        {/* Success Message */}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={bookDetails.name}
          onChange={handleChange}
          placeholder="Enter the book name"
        />

        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={bookDetails.author}
          onChange={handleChange}
          placeholder="Enter the author's name"
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={bookDetails.description}
          onChange={handleChange}
          placeholder="Write a short description"
        />

        <div className="form-row">
          <div>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={bookDetails.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </div>

          <div>
            <label htmlFor="bookType">Book Type:</label>
            <select
              id="bookType"
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
        </div>

        {/* START: Sub-Type Dropdown */}
        {/*
        {bookDetails.bookType && (
          <div>
            <label htmlFor="subType">Sub-Type:</label>
            <select
              id="subType"
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
        )}
        */}
        {/* END: Sub-Type Dropdown */}

        <div className="form-row">
          <div className="form-column">
            <label htmlFor="coverImage" >Cover Image:</label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={handleCoverChange}
            />
          </div>
          {/* <div className="form-column">
            <label htmlFor="bookFile">Book PDF File:</label>
            <input
              type="file"
              id="bookFile"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </div> */}
        </div>

        <button type="submit">Add Book</button>
      </form>

      {/* <div className="footer">
        © 2024 Book Management System | Designed with ❤️
      </div> */}
    </div>
  );
};

export default Createbook;
