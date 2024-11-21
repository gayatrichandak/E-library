//here we define our route
import React from "react";
// BrowserRouter as Router (here "as" is used for making an alias[nickname]).
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import Createbook from "./pages/Createbook.jsx";
import AllBooks from "./pages/AllBooks.jsx";

const App = ()=>{
  return(
    <Router>
      <Routes>
        <Route path="/create-book" element={<Createbook/>} />
        <Route path="/" element={<AllBooks/>} />
      </Routes>
    </Router>
  )
}


export default App;