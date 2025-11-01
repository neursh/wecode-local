# WeCode client

The name is NO LONGER misleading, I stripped like almost everything, only the assignments feature will receive the most support. Other stuff on the site? idc. So I'd say this is the selling point-

A MORE FOCUSED WECODE. Without the annoying slow page load time. This is competitive programming, after all.

This client will only support dark theme. I don't care enough to make light theme.

## Preview
This is only a development build, the core features (template handling, code submission, languages) are still missing. This is just a show on how it would feels like to use the client.

<p align="center">
  <video src="https://github.com/user-attachments/assets/61d445bd-beba-48d0-b794-7b054a4243e0" />
</p>
<sup>Running on Linux, using WebKitGTK</sup>

## Display problem compatibility
The hard part is how can I display the problems. Some problems use pure inline CSS, featuring many styles that overrides the client's style, so I had no choice but to contain it inside an iframe.

There are also some math equations that requires a math rendering engine, I chose Katex, Katex doesn't cause jank as much, or at all, compared to Mathjax (which is the engine that those math equations wrote in, but I didn't find any problem using Katex).

Then there's the color problem, since the client is dark themed, displaying a white iframe like a flashbang is not the best practice, I thought about using invert filter, but there are images in the problems, the inline CSS is also not helping, so yea... I had to use hacky solution, use the inline CSS to edit every single elements inside the page to have transparent background color (some texts got white bakground color, like whyy??), and change text color to white, and the table outline too.

All of this gets injected inside the problem's HTML, Katex, CSS edit, force background color to make the problems look nice on the client.

<sub>
  Made with Rust in the back 🫀 so you know it's good.
</sub>
