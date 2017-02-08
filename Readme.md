[TableMaths](https://traction.github.io/)
==========
Sanity check for table-based HTML emails by [Traction](https://tractionco.com).

## Installation

Create a bookmarklet from this code:

```
javascript:(function(){t=document.createElement('script');t.setAttribute('src','https://traction.github.io/TableMaths/tablemaths.js');document.body.appendChild(t);})()
```
## The problem
HTML emails are, by necessity, chock-full of ugly, deeply nested, brain-scarring table constructions. Getting all the math right on your first try is both difficult, and painful. Tables just plain suck, and it's not like Outlook 2007 is helping anything.

## The solution
Table Maths! A little JavaScript bookmarklet that looks through your code and lets you know when something ain't right. Place it in your bookmarks bar and you'll have one-click access to a status report on any table or td tags that have incorrect or suspicious widths.

## Bonus
The little report window is draggable and resizable so you can get it out of your way. Hover over any of the tags listed in the report and they're magically highlighted on the page!

## Compatibility
Currently tested in Firefox, Safari, and Chrome.


## Contributors

* [Gabriel Gilder](https://github.com/ggilder)
* [John "Seg" Seggerson](https://github.com/theseg)

&copy; 2010-2017 Traction Co.
