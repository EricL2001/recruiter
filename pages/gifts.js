import React from 'react';
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [gender, setGender] = useState('Man');
  const [age, setAge] = useState();
  const [priceMin, setPriceMin] = useState();
  const [priceMax, setPriceMax] = useState();
  const [hobbies, setHobbies] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/generate-gifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceMin, priceMax, gender, age, hobbies }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

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
        <title>Generate Xmas Gifts</title>
        <link rel="icon" href="/santa-claus.png" />
      </Head>

      <main className={styles.main}>
        <img src="/santa-claus.png" className={styles.icon} />
        <h3>Christmas Gift Generator</h3>
          <div className={styles.typewriter}>
            <p className={styles.ai}>Powered by OpenAI</p>
          </div>

        <form onSubmit={onSubmit}>
          <label className={styles.label}>Who is the gift for?</label>
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="man">Man</option>
            <option value="woman">Woman</option>
          </select>

          <label>Age</label>
          <input
            type="number"
            min={1}
            max={99}
            name="age"
            placeholder="Enter the age"
            value={age}
            onChange={(e) => setAge(Number.parseInt(e.target.value))}
          />

          <label>Minimum Price</label>
          <input
            type="number"
            min={1}
            name="priceMin"
            placeholder="Set minimum price"
            value={priceMin}
            onChange={(e) => setPriceMin(Number.parseInt(e.target.value))}
          />

          <label>Maximum Price</label>
          <input
            type="number"
            max={10000}
            name="priceMax"
            placeholder="Set maximum price"
            value={priceMax}
            onChange={(e) => setPriceMax(Number.parseInt(e.target.value))}
          />

          <label>Hobbies or Interests</label>
          <input
            type="text"
            name="hobbies"
            placeholder="Enter each seperated by comma"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
          />
          <input type="submit" value="Generate Gift Ideas" />
        </form>

        {loading && (
          <div>
            <h4>...searching for the best gift ideas 🎁</h4>
          </div>
        )}
        <div
          className={styles.result}
          dangerouslySetInnerHTML={{ __html: result }}
        />
      </main>
    </div>
  );
}
