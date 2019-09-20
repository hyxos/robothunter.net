import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Logo from "../components/Logo";
import useDebounce from "../hooks/useDebounce";
import Head from 'next/head'
import './robothunter.css'

function arrayBufferToBase64(buffer) {
  let binary = "";
  let bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}

const fetchRobot = async function (term) {
  const result = await fetch(`https://robohash.org/${term}.datauri?size=250x250`);
  return result.arrayBuffer().then(buffer => {
    let base64Flag = "data:image/png;base64,";
    let imageStr = arrayBufferToBase64(buffer);
    return base64Flag + imageStr;
  });
};

function App() {
  const [term, setTerm] = useState("");
  const [name, setName] = useState("");
  const [buffered, setBuffered] = useState("");
  const [error, setError] = useState("A robot has no name?");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(term, 500);

  const normalizeString = string => string.split(" ").join("-");
  const handleSubmit = event => {
    event.preventDefault();
    if (!term) {
      setError("A robot has no name?");
    } else {
      setIsSearching(true);
      fetchRobot(normalizeString(term)).then(img => {
        setIsSearching(false);
        setError("");
        setBuffered(img);
        setName(term);
        setTerm("");
      });
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      fetchRobot(normalizeString(debouncedSearchTerm)).then(img => {
        setIsSearching(false)
        setError("");
        setBuffered(img);
        setName(debouncedSearchTerm);
      });
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="App">
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1"/>
          <link href="./styles.css" rel="stylesheet" />
          <title>Robot Hunter</title>
      </Head>
        <nav className="nav">
          <Logo />
          <h1>obot Hunter</h1>
        </nav>
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="What is your robot's name?"
              value={term}
              onChange={e => setTerm(e.target.value)}
            />
            <div className="spacer" />
            <button type="submit">
              <span role="img" aria-label="robot">
                🤖
            </span>
            </button>
          </form>
        </div>
        <div className="portrait-wrapper">
          <img
            alt="robot"
            src={buffered ? buffered : "https://robohash.org/gravity?set=set5&size=250x250"}
          />

          <div className={error ? "name error" : "name"}>
            {error ? error : name}
          </div>
          <div className="searching">{isSearching && "Searching ..."}</div>
        </div>
        <footer>Finding Robots since 2019</footer>
    </div>
      );
    }
    
    export default App
