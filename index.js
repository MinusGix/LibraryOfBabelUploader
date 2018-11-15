const fs = require('fs');
let babel = require('libraryofbabel');

function _readFile (filename) {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, (err, data) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(data);
		});
	});
}

function _writeFile (filename, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(filename, data, (err) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(filename);
		})
	})
}

function _toHex (data) {
	if (!(data instanceof Buffer)) {
		if (typeof(data) === 'string') {
			data = Buffer.from(data);
		} else {
			throw new TypeError("Unknown data type");
		}
	}

	return data.toString('hex');
}

function _fromHex (data) {
	return Buffer.from(data, 'hex');
}

// Because babel doesn't support numbers
function convert (text) {
	return text.replace(/0/g, 'g')
		.replace(/1/g, 'h')
		.replace(/2/g, 'i')
		.replace(/3/g, 'j')
		.replace(/4/g, 'k')
		.replace(/5/g, 'l')
		.replace(/6/g, 'm')
		.replace(/7/g, 'n')
		.replace(/8/g, 'o')
		.replace(/9/g, 'p');
}

function unconvert (text) {
	return text.replace(/g/g, '0')
		.replace(/h/g, '1')
		.replace(/i/g, '2')
		.replace(/j/g, '3')
		.replace(/k/g, '4')
		.replace(/l/g, '5')
		.replace(/m/g, '6')
		.replace(/n/g, '7')
		.replace(/o/g, '8')
		.replace(/p/g, '9');
}

function convertFileToBabel (filename) {
	return _readFile(filename)
		.then(data => _toHex(data).toLowerCase());
}

function uploadFileToBabel (filename) {
	return convertFileToBabel(filename)
		.then(text => uploadTextToBabel(text));
}

function _toLooseData (data) {
	return `!${data.hex}|${data.wall}|${data.shelf}|${data.volume}|${data.page}`;
	//return [data.hex, data.wall, data.shelf, data.volume, data.page];
}

// upload in a rather loose sense
function uploadTextToBabel (text) {
	return babel.search(convert(text), true)
		.then(datas => datas.map(data => _toLooseData(data)).join(''));
}

// 'Uploads' the text, and saves the resultant data to a file
function uploadAndSaveTextToBabel (text) {
	return uploadTextToBabel(text)
		.then(data => {
			let filename = Math.random().toString(36).slice(2);

			return _writeFile('./babeled/' + filename + '.bab', data);
		});
}

function uploadAndSaveFileToBabel (filename) {
	return convertFileToBabel(filename)
		.then(text => uploadAndSaveTextToBabel(text));
}

function loadFromBabelText (text) {
	return Promise.all(
		text.split('!') // Since each section of hex|wall|shelve|volume|page starts with an ! we split
			.slice(1) // Since we used split, there'll be an extra blank section at the very start, cut that off
			.map(data => data.split('|'))
			.map(data => babel.getPageText(data[0], Number(data[1]), Number(data[2]), Number(data[3]), Number(data[4])))
	)
		.then(datas => {
			console.log('\n\n\n======\nData\n======', datas);
			return datas.reduce((prev, cur) => prev + unconvert(cur.replace(/ /g, '')), '')
		});
}

function loadFromBabelFile (filename) {
	return _readFile(filename)
		.then(data => loadFromBabelText(data.toString()));
}

_readFile('./test/test')
	.then(elfdata => {
		uploadFileToBabel('./test/test').then(data => {
			//console.log('upload text data:', data);
			return loadFromBabelText(data);
		}).then(data => {
			console.log('load from text:', data);
			console.log('is equal:', _fromHex(data).equals(elfdata));
			_writeFile('./output/test', _fromHex(data));
		});
	})

