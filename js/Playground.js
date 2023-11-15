/*
	(c) David Konrad, 2023- present
*/

"use strict";

const Playground = (function(toUnicodeVariant) {
	//const qsel = (sel) => { return document.querySelector(sel) }	// eslint-disable-line no-unused-vars
	//const qall = (sel) => { return document.querySelectorAll(sel) }	// eslint-disable-line no-unused-vars
	const gebi = (id) => { return document.getElementById(id) }	// eslint-disable-line no-unused-vars

	const playground_variants = gebi('playground-variants')
	const playground_diacritics = gebi('playground-diacritics')
	const playground_spaces = gebi('playground-spaces')
	const input = gebi('playground-input')
	const output = gebi('playground-output')
	const special_chars = gebi('table-special-chars')
	const combinings = gebi('table-combinings')
	const spaces = gebi('table-spaces')

	const init = function() {
		if (special_chars) initSpecialChars()
		if (combinings) initCombinings()
		if (spaces) initSpaces()
		if (playground_variants) {
			initPlaygroundVariants()
			initPlaygroundCombinings()
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
				if (!not_supporting.includes(Test.variants[variant])) row += '<td title="Small letter ' + char +'">' + toUnicodeVariant(char + char.toUpperCase(), variant) + '</td>'
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
			let test 
			if (diacritic.indexOf('encl') === 0) {
				test = toUnicodeVariant('abc', 'italic', `${diacritic}, space-en`) 
			} else if (diacritic.indexOf('halo') === 0) {
				test = toUnicodeVariant('abc', 'sans', `${diacritic}, space-en`) 
			} else {
				test = toUnicodeVariant('abcdef', 'italic', diacritic)
			}
			rows += '<tr><td><code>' + diacritic + '</td><td><code>' + Test.combinings[diacritic].short + '</code></code></td><td>' + test + '</td></tr>'
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

/*
	playgroundConvert
*/
	const playgroundConvert = function() {
		const variant = playground_variants.querySelector('[name="playground-variant"]:checked').getAttribute('data-variant')
		const value = (function(value) {
			if (['r'].includes(variant)) return parseInt(value)
			return value			
		})(input.value)  
		output.value = toUnicodeVariant(value, variant)
	}

/*
	initPlaygroundVariants
*/
	const initPlaygroundVariants = function() {
		const variantName = function(variant) {
			if (variant === 'circled negative') return 'negative'
			if (variant === 'squared negative') return 'negative'
			if (variant === 'flags') return 'f l a g s'
			return variant
		}
		let form = '<div class="container">'
		form += '<div class="row">'
		for (const variant in Test.variants) {
			form += '<div class="col-md-2 col-sm-6 col-xs-6">'
			form += `<div class="form-check">
			  <input class="form-check-input" type="radio" name="playground-variant" data-variant="${Test.variants[variant]}" id="variant-${Test.variants[variant]}">
			  <label class="form-check-label" for="variant-${Test.variants[variant]}" title="Set variant to ${variant}">
					${toUnicodeVariant(variantName(variant), variant)}
			  </label>
			</div>`
			form += '</div>'
		}
		form += '</div>'
		form += '</div>'
		playground_variants.innerHTML = form
		playground_variants.querySelectorAll('[name="playground-variant"]').forEach(function(radio) {
			radio.onclick = playgroundConvert
		})
	}

	const initPlaygroundCombinings = function() {

	}

	return {
		init
	}

})(toUnicodeVariant);

document.addEventListener("DOMContentLoaded", function(){
	Playground.init()
});


