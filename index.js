const fs = require('fs-extra')
const path = require('path')
const imgPrefix = '/img2/'

let markupJson
let cssJsList = []
const result = { "sense": {}, "not_sense": {} }
const startTime = Date.now()
let endTime


fs.readFile('./data/data.json', (err, data) => {
	if( err ) {
		console.log(err)
		return
	}
	markupJson = JSON.parse(data.toString())
})


function readStylesAndScripts() {
	const allCss = fs.readFileSync('./result/all_css.txt')
	const allJS = fs.readFileSync('./result/all_js.txt')

	allCss.toString().split('\n').map(i => {
		if( !i ) return

		const fileBody = fs.readFileSync(i.trim())
		cssJsList.push({
			filename: i.trim(),
			body: fileBody.toString()
		})
	})

	allJS.toString().split('\n').map(i => {
		if( !i ) return

		const fileBody = fs.readFileSync(i.trim())
		cssJsList.push({
			filename: i.trim(),
			body: fileBody.toString()
		})
	})
}


function getOnlyFilename(string) {
	return string.replace(__dirname, '').replace(/\\/g,"/").replace(imgPrefix, '').trim()
}


function start() {
	fs.readFile('./result/all_files.txt', (err, data) => {
		if( err ) {
			console.log(err)
			return
		}
		splitRows(data.toString())
	})
}


function splitRows(text) {
	const arrayOfFiles = text.split('\n')
	readStylesAndScripts()

	for(let i = 0; i < 500; i++) {
		const format = getOnlyFilename(arrayOfFiles[i])
		findInMarkup(format)
		findInStylesAndScripts()
		// console.log('Current index: ', i, '-------------', format)
	}

	fs.writeJSON('./result/result.json', result, (err) => {
		if( err ) throw err

		endTime = Date.now()
		console.log('JSON SAVED')
		console.log('\n Time elapsed: ' +  ((endTime - startTime) / 1000 ).toFixed(2) )
	})
}

function findInMarkup(filename) {
	markupJson.data.map(i => {
		const meta = { kind: i.kind, id: i.id }
		findMatch(i.markup, filename, meta)
	})
}

function findInStylesAndScripts() {
	cssJsList.map(item => {
		if( !item ) return

		const meta =  { file: item.filename }
		const filename = item.filename.match(/[^\\/]+$/)[0]
		// const destination = getOnlyFilename(path.resolve(item.filename))

		findMatch(item.body, filename, meta)
	})
}


function writeToJson(sense, key, value) {
	const sensKey = sense ? "sense" : "not_sense"
	if( !result[sensKey].hasOwnProperty(key) ) {
		result[sensKey][key] = []
	}

	result[sensKey][key].push(value)
}



function findMatch(string, filename, meta) {
	if( !string ) return

	if( filename.indexOf('+') > -1 ) {
		filename = filename.split('+').join('\\\\+')
	}

	const sensitive = string.match( new RegExp(filename) )
	let notSensitive = null

	if( !sensitive ) {
		notSensitive = string.match( new RegExp(filename, 'i') )
	}

	if( sensitive || notSensitive) {

		writeToJson( sensitive ? true : false, filename, meta)

		// const source = path.join(__dirname, imgPrefix, destination)
		// const dest = path.join(__dirname, 'result', sensitive ? 'sens' : 'not_sens', destination )

		// fs.copySync(source, dest)

		// if( writeMeta ) {
		// 	fs.appendFileSync(dest + ".meta.json", meta)
		// }
	}
}

setTimeout(() => {
	start()
}, 100)
