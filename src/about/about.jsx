import React, { useState, useEffect } from 'react';

export function About() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    //API calling random star wars quotes
    fetch('https://dummyjson.com/quotes/random')
    .then(r => r.json())
    .then(data => setQuote(`"${data.content}" - ${data.author}`))
    .catch(() => setQuote('Could not load quote.'));
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <main>
      <h2>About</h2>
      <p>Tier list ranking is a common form of rankings among friends to indicate how users feel about a given topic. For example it could be favorite foods as the topic with different food items to be ranked.</p>

      <h3>Random Quote</h3>
      <p>{quote || 'Loading quote...'}</p>

      <h3>Example Tier list image</h3>
      <img src="image.png" width="400" alt="Tier list example" />
    </main>
  );
}