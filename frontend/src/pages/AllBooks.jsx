import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AllBooks.css'; // import the CSS file
import { useNavigate } from 'react-router-dom';
const AllBooks = () => {
    const [books, setBooks] = useState([]); // Initialize books as an empty array
    const [bookName,setBookName] = useState('');
    const navigate = useNavigate();
    //const [page,setPage] = useState(1);
    
    const getBookData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/book/getallbooks`);//whenever variable is there that time we used this ``symbol
            setBooks(response.data.data);//This function sets the value of books from response got from server.
            // console.log(books);
        } catch (error) {
            console.log("This is an error", error);
        }
    };
    useEffect(()=>{
        getBookData();

    },[])
    
    const handleSearch = async () =>{
        try {
            console.log(bookName);
            const response = await axios.get(`http://localhost:8080/book/getbookbyname?BookName=${bookName}`);//whenever variable is there that time we used this ``symbol
            setBooks(response.data.data);
        } catch (error) {
            console.log("This is an error", error);
        }
    }
    const handleChange = (e) => {
        console.log(e.target);
        const { value } = e.target; // Get the value from the input field
        setBookName(value); // Set the value as the new book name
    };
    
    return (
        <div className="container">
            <div className="header">
            <h1 onClick={() => getBookData()}>Book Library</h1>
            <button  className="create-button" onClick={()=>{navigate('/create-book')}}> Create </button>

            <div className='search-div'>
                    <input  className= "search-input" type='text' value={bookName} onChange={handleChange} placeholder='Search'/>
                    <button className="search-button" onClick={handleSearch}>S</button>
                </div>
            </div>
            <div className="grid">
                {Array.isArray(books) && books.length > 0 ? ( // Check if books is an array and has items
                    books.map(book => (
                        <div key={book.id} className="card">
                            {book.cover && <img src={book.cover} alt={book.name} className="cover" />}
                            <div className="details">
                                <h2>{book.name}</h2>
                                <p>Author: {book.author}</p>
                                <p>Price: ₹{book.price}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No books available</p> // Fallback message when there are no books
                )}
            </div>
        </div>
    );
};

export default AllBooks;
