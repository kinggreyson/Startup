import React, { useState, useEffect } from 'react';

export function About() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Mock API call - simulates fetching from a 3rd party API
    const quotes = [
      'Do...or do not... there is no try',
      'Never tell me the odds.',
      'Youve failed, your Highness. I am a Jedi. Like my father before me'
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <main>
      <h2>About</h2>
      <p>Tier list ranking is a common form of rankings among friends to indicate how users feel about a given topic. For example it could be favorite foods as the topic with different food items to be ranked.</p>

      <h3>Random Quote</h3>
      <p>{quote || 'Loading quote...'}</p>
      <p>(Quote from 3rd party API *not implemented*)</p>

      <h3>Example Tier list image</h3>
      <img src="image.png" width="400" alt="Tier list example" />
    </main>
  );
}