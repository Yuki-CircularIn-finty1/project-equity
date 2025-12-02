# How to Share Your Game

To let your friends play your game easily, you can publish it online for free.

## Option 1: Netlify Drop (Easiest)

1.  Locate the **`dist`** folder in your project directory:
    `e:\downloads_E\me_1125\sound-novel-game\dist`
2.  Go to [Netlify Drop](https://app.netlify.com/drop).
3.  Drag and drop the **`dist`** folder onto the page.
4.  Netlify will generate a link (e.g., `https://random-name-12345.netlify.app`).
5.  Send this link to your friends!

## Option 2: Local File Sharing

Since we configured the game to use relative paths (`base: './'`), you _might_ be able to run it locally, but modern browsers often block audio and other features when opening `index.html` directly due to security restrictions.

**Recommended**: Use Option 1 for the best experience.
