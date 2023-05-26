import React from 'react';
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import Footer from "./footer";

export default function Home() {
  const [years, setYears] = useState();
  const [title, setTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [error, setError] = useState(null); // Add error state

  async function onSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }
    setLoading(true);

    // Check if fields are blank
    if (!years || !title) {
      setError("Please complete both fields before submitting");
      setLoading(false);
      return;
    }

    setError(null); // Clear previous error


    try {
      const response = await fetch("/api/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ years, title }),
      });


      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      // set getReader() to progressively add date to our current state as it comes in.


      setResult(data.result);

      setLoading(false);

      
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }


  return (
    <div>
      <Head>
        <title>Recruiting Assistant</title>
        <link rel="icon" href="/recruitment.png" />
      </Head>

      <main className={styles.main}>
        <img src="/recruitment.png" className={styles.icon} />
        <h3>Recruiting Assistant</h3>
          <div className={styles.typewriter}>
            <p className={styles.ai}>Powered by OpenAI</p>
          </div>

        <form onSubmit={onSubmit}>
        <label>Job Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter job title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Years In Industry</label>
          <input
            type="number"
            min={1}
            max={99}
            name="years"
            placeholder="Enter the years in industry"
            value={years}
            onChange={(e) => setYears(Number.parseInt(e.target.value))}
          />

          <input type="submit" value="Generate Questions" />

        </form>

        {error && <div className={styles.error}>{error}</div>}
    
        {loading && (
          <div>
            <h4>...generating candidate questions</h4>
          </div>
        )}
       <div
        className={styles.result}
        dangerouslySetInnerHTML={{ __html: result }}
        />
      </main>
      <Footer/>
    </div>
  );
}
