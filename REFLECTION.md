# Week 1 reflection

1. What is the difference between building a UI imperatively
   (plain DOM code) and declaratively (React)?

With plain DOM code, I write the steps to change the page.
With React, I describe what should appear, and React handles
updating the page.

2. Why must a component name start with a capital letter?

React uses capital letters to recognise custom components.
A lowercase name is treated as an HTML tag instead.

3. What does a fragment <>...</> do, and why not just use a <div>?

A fragment groups several elements so a component can return
them together. Unlike a div, it does not add an extra element
to the page.

4. Name one benefit of splitting the UI into small components.

It makes the code easier to manage. For example, I can edit
the Header component without changing the food card code.