# CS 260 Notes

[My startup - Greyson King](https://github.com/kinggreyson/Startup)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## Github
Completed setup of main page alongside VS code to commit changes. I have used Github previously but have never setup my own page and connected it to VS Code. With the step by step process laid out it ended up being easier than expected.

## Startup Application
Coming up with the initial topic was a little tricky especially thinking of the details. After coming up with the broad idea of voting based custom tier lists making the sketch and filling in other requirements became far easier even if it was a bit time consuming.


## AWS

My IP address is: 100.27.88.19
My Domain Name is: https://rankingwithfriends.click
Launching an actual website using AWS was completely foreign to me, and I've never really done anything like it through any coding project. The instructions were very helpful and gave me a good view of where to actually go and what to do. With how much content is on AWS it was intimidating at first. 

## Caddy

I had no problems here and was surprised with how easy it was to get a secure website, really thankful for the monopoly breakup in 2014.  

## HTML

HTML actually went very smoothly, I really like how organized this code looks after finishing with it. It kind of just makes sense. The toughest part was just brainstomring how I wanted the actual setup to look so the simon example really helped me out with that. After thinking of all that it was just working through the code until it looked how it should. It does feel a little strange having a lot of temporary components or components who don't work yet but this does feel like the foundation.

## CSS

This took me a bit to understand how it worked but when I did it was easy to take off with. It took a lot of experimentation to get everything lined up how I wanted and I experienced many visual bugs especially early on such as the background color not working on one page. But it was satisfying to see the design start to line up and actually look good. I want to experiment more with animation in the future but I'm especially satisfied with how the buttons turned out changing color when highlighted with the mouse. I think that not only helps the user but makes the page much more professional looking.

## React Part 1: Routing

Setting up Vite and React was pretty simple. I had a bit of trouble because of conflicting CSS. This isn't as straight forward as you would find with Svelte or Vue, but I made it work in the end. If there was a ton of CSS it would be a real problem. It sure was nice to have the code structured in a more usable way.

## React Part 2: Reactivity

This was a lot of fun to see it all come together. I had to keep remembering to use React state instead of just manipulating the DOM directly.

Handling the toggling of the checkboxes was particularly interesting.

```jsx
<div className="input-group sound-button-container">
  {calmSoundTypes.map((sound, index) => (
    <div key={index} className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        value={sound}
        id={sound}
        onChange={() => togglePlay(sound)}
        checked={selectedSounds.includes(sound)}
      ></input>
      <label className="form-check-label" htmlFor={sound}>
        {sound}
      </label>
    </div>
  ))}
</div>
```
