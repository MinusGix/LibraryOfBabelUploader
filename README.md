# Library of Babel Uploader

This is simply a concept, and the code all lies in index.js. It uses one of my other projects which lets me interact with the library of babel api some.

Currently no cli.

What this does:
	- Converts file given to it (you'll have to modify some code) into a hexadecimal representation
	- Replace all numbers with letters (this can work, because in hex, it only uses the letters a-f and 0-9 so we can use the rest of the alphabet)
	- Split all that 'text' up into 3000 char chunks (LoB supports 3200 char chunks, but I was gonna limit it so I could maybe later have info about the file stored with it)
	- Search each chunk on the site with their search function, and record the `!hex|wall|shelf|volume|pagenumber` into a string. This could be saved to a file or just used immediately.
	- Then you can look it up, by giving that text we just recorded to a different function, and it goes and accesses the pages and records the data.
	- Replaces all spaces (if you don't have a full 3000 characters in each chunk, then the end is padded with spaces. we can remove those as we're only using letters)
	- Stitches them all back together. Unconverts them (replacing the characters we used to represent numbers with numbers)
	- Converts it into a nodejs buffer. Then writes that buffer to file.

It seems to work, I uploaded some lorem ipsum (big enough to slice it repeatedly) and checked if they were equal and they were.
Also did a really simple elf executable (just returned 42 in the main), and it worked fine once it came back.

Bad things to note:
	- This will almost certainly generate a file larger than the original. It's possible it won't, but most of the hex's are huge.

The code could be made way better, here's some ideas that I'll likely never implement:
	- Compression. You'll have to stay within the bounds of the current code, so no spaces and nothing beyond what LoB supports, but you still have the rest of the alphabet and periods.
		If the compression was good enough it might drop the stored data below how much data is actually put up.
	- File data. Include various data about the file. This would enable people to share the babel data they got with others, and they wouldn't even need to know what it really is.
		- Like filename (Have to be careful about not letting it write to any directory)
		- Filesize? could be useful to know before you start downloading, but could easily be faked.. well you can just have code to count the number of chunks.
	- Use LoB's bookmark feature. I'm unsure how this works and for how long they stay, but if they stay long enough then it would be a great way of very quickly cutting down on the filesize of babelled data.
		- This would make it easy to bookmark chain. Save the last 100 chars for the bookmark, and all the file data goes before it. That way, if you know the first bookmark
			you can get every part of the file. This would decrease the size dramatically.
	- I had an idea of storing babelled data inside a babel entry and then retrieving that and it saw that it was more babel data and retrieved that, but the babelled data is often larger than the 3000 character limit.
