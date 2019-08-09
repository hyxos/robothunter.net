import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Logo from "../components/Logo";
import useDebounce from "../hooks/useDebounce";
import Head from 'next/head'
import './styles.css'

function arrayBufferToBase64(buffer) {
  let binary = "";
  let bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}

const fetchRobot = async function(term) {
  const result = await fetch(`https://robohash.org/${term}`);
  return result.arrayBuffer().then(buffer => {
    let base64Flag = "data:image/jpeg;base64,";
    let imageStr = arrayBufferToBase64(buffer);
    return base64Flag + imageStr;
  });
};

function App() {
  const [term, setTerm] = useState("");
  const [name, setName] = useState("");
  const [buffered, setBuffered] = useState("");
  const [error, setError] = useState("A robot has no name?");
  const debouncedSearchTerm = useDebounce(term, 300);

  const normalizeString = string => string.split(" ").join("-");
  const handleSubmit = event => {
    event.preventDefault();
    if (!term) {
      setError("A robot has no name?");
    } else {
      fetchRobot(normalizeString(term)).then(img => {
        setError("");
        setBuffered(img);
        setName(term);
        setTerm("");
      });
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchRobot(normalizeString(debouncedSearchTerm)).then(img => {
        setError("");
        setBuffered(img);
        setName(debouncedSearchTerm);
      });
    }
  }, [debouncedSearchTerm]);

  return (
    <>
    <Head>
      <link href="./styles.css" rel="stylesheet" />
    </Head>
    <div className="App">
      <nav>
        <Logo />
        <h1>Robot Hunter</h1>
      </nav>
      <h2>Finding Robots since 2019</h2>
      <img
        alt="robot"
        src={buffered ? buffered : "https://robohash.org/gravity?set=set5"}
      />
      <div>
        <div className={error ? "name error" : "name"}>
          {error ? error : name}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="What is your Robot's name?"
            value={term}
            onChange={e => setTerm(e.target.value)}
          />
          <button type="submit">
            <span role="img" aria-label="robot">
              🤖
            </span>
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

export default App
