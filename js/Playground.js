/*
	(c) David Konrad, 2023- present
*/

"use strict";

const Playground = (function(toUnicodeVariant) {
	const qsel = (sel) => { return document.querySelector(sel) }	// eslint-disable-line no-unused-vars
	const qall = (sel) => { return document.querySelectorAll(sel) }	// eslint-disable-line no-unused-vars
	const gebi = (id) => { return document.getElementById(id) }	// eslint-disable-line no-unused-vars

	const special_chars = gebi('table-special-chars')
	const combinings = gebi('table-combinings')
	const spaces = gebi('table-spaces')

	const init = function() {
		if (special_chars) initSpecialChars()
		if (combinings) initCombinings()
		if (spaces) initSpaces()
	}

	const getVariantSection = function() {
		for (const variant in Test.variants) {
			console.log(variant)
		}
	}

	const initSpecialChars = function() {
		const not_supporting = ['p', 'q', 'qn', 'o', 'on', 'w', 'f', 'nd', 'nc', 'ndc']
		let head = '<thead><tr><th class="table-shaded"></th>'
		for (const variant in Test.variants) {
			if (!not_supporting.includes(Test.variants[variant]))	{
				head += '<th title="' + variant + '" class="table-primary align-middle"><small>' + toUnicodeVariant(Test.variants[variant], variant) + '</small></th>'
			}
		}
		head += '</thead>'
		special_chars.insertAdjacentHTML('beforeend', head)
		let tbody = '<tbody>'
		for (const char of Test.special_chars) {		
			let row = '<tr>'
			row += '<td class="table-primary">' + char + '</td>'
			for (const variant in Test.variants) {
				if (!not_supporting.includes(Test.variants[variant])) row += '<td title="Small letter ' + char +'">' + toUnicodeVariant(char, variant) + '</td>'
			}
			row += '</tr>'
			tbody += row
		}
		tbody += '</tbody>'
		special_chars.insertAdjacentHTML('beforeend', tbody)
	}

	const initCombinings = function() {
		let head = '<thead><tr>'
		head += '<th>Combining</th>'
		head += '<th>Short</th>'
		head += '<th>Sample (italic variant)</th>'
		head += '</thead>'
		combinings.insertAdjacentHTML('beforeend', head)
		let rows = ''
		for (const diacritic in Test.combinings) {
			//if (diacritic.indexOf('space') === -1 && (diacritic.indexOf('-above') === -1 || diacritic === 'cross-above')) {
				let test 
				if (diacritic.indexOf('encl') === 0) {
					test = toUnicodeVariant('abc', 'italic', `${diacritic}, space-en`) 
				} else if (diacritic.indexOf('halo') === 0) {
					test = toUnicodeVariant('abc', 'sans', `${diacritic}, space-en`) 
				} else {
					test = toUnicodeVariant('abcdef', 'italic', diacritic)
				}
				rows += '<tr><td><code>' + diacritic + '</td><td><code>' + Test.combinings[diacritic].short + '</code></code></td><td>' + test + '</td></tr>'
			//}
		}
		let tbody = '<tbody>' + rows + '</tbody>'
		combinings.insertAdjacentHTML('beforeend', tbody)
	}

	const initSpaces = function() {
		let head = '<thead><tr><th class="table-shaded"></th>';
		for (const diacritic in Test.spaces) {
			head += '<th title="' + diacritic + '" class="table-primary"><small>' + diacritic.replace('space-', '*-') + '</small></th>'
		}
		head += '</tr></thead>'
		spaces.insertAdjacentHTML('beforeend', head)
		let rows = []
		for (const variant in Test.variants) {
			let caption = toUnicodeVariant(Test.variants[variant], variant)
			if (variant === 'squared negative') caption += '<sup>1</sup>'
			rows[variant] = '<tr><td class="table-primary">' + caption + '</td>'
			for (const diacritic in Test.spaces) {
				if (variant === 'flags') {
					rows[variant] += '<td>' + toUnicodeVariant('ab', variant, diacritic) + '</td>'
				} else if (variant === 'squared negative') {
					rows[variant] += '<td>' + toUnicodeVariant('qn', variant, diacritic) + '</td>'
				} else if (variant.indexOf('numbers') === 0) {
					rows[variant] += '<td>' + toUnicodeVariant('42', variant, diacritic) + '</td>'
				} else if (variant === 'roman') {
					rows[variant] += '<td>' + toUnicodeVariant(42, variant, diacritic) + '</td>'
				} else {				
					rows[variant] += '<td>' + toUnicodeVariant('ab', variant, diacritic) + '</td>'
				}
			}
		}
		let tbody = '<tbody>'
		for (const row in rows) {
			tbody += rows[row] + '</tr>'
		}
		tbody += '</tbody></table>'
		spaces.insertAdjacentHTML('beforeend', tbody)
	}

	return {
		init
	}

})(toUnicodeVariant);

document.addEventListener("DOMContentLoaded", function(){
	Playground.init()
});


