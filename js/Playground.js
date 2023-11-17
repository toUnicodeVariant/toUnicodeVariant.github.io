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
	const special_capital_chars = gebi('table-special-capital-chars')
	const combinings = gebi('table-combinings')
	const combinings_less_supportive = gebi('table-combinings-less-supportive')
	const spaces = gebi('table-spaces')

	const init = function() {
		if (special_chars) {
			initSpecialChars()
			initSpecialCapitalChars()
		}
		if (combinings) initCombinings()
		if (spaces) initSpaces()
		if (playground_variants) {
			initPlaygroundVariants()
			initPlaygroundCombinings()
		}
	}

/*
	initSpecialChars
*/
	const initSpecialChars = function() {
		const not_supporting = ['p', 'q', 'qn', 'o', 'on', 'w', 'f', 'nd', 'nc', 'ndc']
		let head = '<thead><tr><th class="table-shaded"></th>'
		for (const variant in Test.variants) {
			if (!not_supporting.includes(Test.variants[variant]))	{
				head += '<th title="' + toUnicodeVariant(variant, variant) + '" class="table-primary align-middle"><small>' + toUnicodeVariant(Test.variants[variant], variant) + '</small></th>'
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

/*
	initSpecialCapitalChars
*/
	const initSpecialCapitalChars = function() {
		const not_supporting = ['p', 'q', 'qn', 'o', 'on', 'w', 'f', 'nd', 'nc', 'ndc']
		let head = '<thead><tr><th class="table-shaded"></th>'
		for (const variant in Test.variants) {
			if (!not_supporting.includes(Test.variants[variant]))	{
				head += '<th title="' + toUnicodeVariant(variant, variant) + '" class="table-primary align-middle"><small>' + toUnicodeVariant(Test.variants[variant], variant) + '</small></th>'
			}
		}
		head += '</thead>'
		special_capital_chars.insertAdjacentHTML('beforeend', head)
		let tbody = '<tbody>'
		for (const char of Test.special_capital_chars) {		
			let row = '<tr>'
			row += '<td class="table-primary">' + char + '</td>'
			for (const variant in Test.variants) {
				if (!not_supporting.includes(Test.variants[variant])) row += '<td title="Small letter ' + char +'">' + toUnicodeVariant(char.toUpperCase(), variant) + '</td>'
			}
			row += '</tr>'
			tbody += row
		}
		tbody += '</tbody>'
		special_capital_chars.insertAdjacentHTML('beforeend', tbody)
	}

/*
	initCombinings
*/
	const initCombinings = function() {

		const less_supportive = ['squared', 'squared negative', 'circled', 'circled negative', 'fullwidth', 'flags', 
														'parenthesis', 'roman', 'numbers dot', 'numbers comma', 'numbers double circled']

		const most_supportive = Object.keys(Test.variants).filter(function(v) {
			if (!less_supportive.includes(v)) return v
		})

		const populate = function(table, variants) {
			let head = '<thead><tr>'
			head += '<th>Combining</th>'
			head += '<th>Short</th>'
			for (const variant of variants) {
				head += '<th title="' + toUnicodeVariant(variant, variant) +'" class="text-center">' + toUnicodeVariant(Test.variants[variant], variant) + '</th>'
			}
			head += '</tr></thead>'
			table.insertAdjacentHTML('beforeend', head)
			let rows = ''
			for (const diacritic in Test.combinings) {
				const diacritics = [diacritic]
				if (diacritic.indexOf('enclose') === 0) diacritics.push('space-en')
				if (diacritic.indexOf('halo') === 0) diacritics.push('space-figure')
				let sup = diacritic.indexOf('enclose') === 0 ? '<sup class="text-muted">1</sup>' : ''
				if (diacritic.indexOf('halo') === 0) sup = '<sup class="text-muted">2</sup>'

				rows += '<tr><td><code class="text-nowrap">' + diacritic + sup + '</code></td><td><code class="text-nowrap">' + Test.combinings[diacritic].short + '</code></td>' 
				for (const variant of variants) {
					const sample = ['roman', 'numbers dot', 'numbers comma', 'numbers double circled'].includes(variant) 
						? variant === 'roman' ? 42 : '42' 
						: 'abc'

					const test_support = toUnicodeVariant(sample, variant, diacritics)
					if (true) {
						rows += '<td title="' + diacritic + ', ' + variant + '" class="text-center text-nowrap">' + test_support + '</td>'
					} else {
						rows += '<td title="' + test_support + '" class="table-shaded text-center text-nowrap">' + test_support.slice(0,4) + '&hellip;' + '</td>'
					}
				}
				rows += '</tr>'
			}
			let tbody = '<tbody>' + rows + '</tbody>'
			table.insertAdjacentHTML('beforeend', tbody)
			table.insertAdjacentHTML('afterend', '<small class="d-block Xfloat-start"><sup>2</sup> enriched with <code>space-figure</code> for better rendering</small>')
			table.insertAdjacentHTML('afterend', '<small class="d-block Xfloat-start"><sup>1</sup> enriched with <code>space-en</code> for better rendering</small>')
		}

		populate(combinings, most_supportive)
		populate(combinings_less_supportive, less_supportive)

/*
		let head = '<thead><tr>'
		head += '<th>Combining</th>'
		head += '<th>Short</th>'
		for (const variant of most_supportive) {
			head += '<th title="' + toUnicodeVariant(variant, variant) +'" class="text-center">' + toUnicodeVariant(Test.variants[variant], variant) + '</th>'
		}
		head += '</tr></thead>'
		combinings.insertAdjacentHTML('beforeend', head)
		let rows = ''
		for (const diacritic in Test.combinings) {
			const diacritics = [diacritic]
			if (diacritic.indexOf('enclose') === 0) diacritics.push('space-en')
			if (diacritic.indexOf('halo') === 0) diacritics.push('space-figure')
			rows += '<tr><td><code class="text-nowrap">' + diacritic + '</code></td><td><code class="text-nowrap">' + Test.combinings[diacritic].short + '</code></td>' 
			for (const variant of most_supportive) {
				const test_support = toUnicodeVariant('abc', variant, diacritics)
				let sample = 'abc'
				if (true) {
					rows += '<td title="' + diacritic + ', ' + variant + '" class="text-center text-nowrap">' + test_support + '</td>'
				} else {
					rows += '<td title="' + test_support + '" class="table-shaded text-center text-nowrap">' + test_support.slice(0,4) + '&hellip;' + '</td>'
				}
			}
			rows += '</tr>'
		}
		let tbody = '<tbody>' + rows + '</tbody>'
		combinings.insertAdjacentHTML('beforeend', tbody)
*/

	}

/*
	initSpaces
*/
	const initSpaces = function() {
		let head = '<thead><tr><th class="table-shaded"></th>';
		for (const diacritic in Test.spaces) {
			head += '<th title="' + diacritic + '" class="table-primary"><small>' + diacritic.replace('space-', '*-') + '</small></th>'
		}
		head += '</tr></thead>'
		spaces.insertAdjacentHTML('beforeend', head)
		let rows = []
		for (const variant in Test.variants) {
			let caption = Test.variants[variant]
			let title = toUnicodeVariant(variant, variant)
			if (variant === 'squared negative') caption += '<sup>1</sup>'
			rows[variant] = '<tr><td class="table-primary" title="' + title +'"><small>' + caption + '</small></td>'
			for (const diacritic in Test.spaces) {
				let td_start = '<td title="' + toUnicodeVariant(variant, variant) + ' ' + diacritic +'">'
				if (variant === 'flags') {
					rows[variant] += td_start + toUnicodeVariant('ab', variant, diacritic) + '</td>'
				} else if (variant === 'squared negative') {
					rows[variant] += td_start + toUnicodeVariant('qn', variant, diacritic) + '</td>'
				} else if (variant.indexOf('numbers') === 0) {
					rows[variant] += td_start + toUnicodeVariant('42', variant, diacritic) + '</td>'
				} else if (variant === 'roman') {
					rows[variant] += td_start + toUnicodeVariant(42, variant, diacritic) + '</td>'
				} else {				
					rows[variant] += td_start + toUnicodeVariant('ab', variant, diacritic) + '</td>'
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


