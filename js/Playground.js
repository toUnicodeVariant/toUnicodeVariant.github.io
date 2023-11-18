/*
	(c) David Konrad, 2023- present
*/

"use strict";

const Playground = (function(toUnicodeVariant, Base) {
	const qall = (sel) => { return document.querySelectorAll(sel) }	// eslint-disable-line no-unused-vars
	const gebi = (id) => { return document.getElementById(id) }	// eslint-disable-line no-unused-vars

	const playground_variants = gebi('playground-variants')
	const playground_combinings = gebi('playground-combinings')
	const playground_spaces = gebi('playground-spaces')
	const input = gebi('playground-input')
	const output = gebi('playground-output')

	const init = function() {
		if (playground_variants) {
			initPlaygroundVariants()
			initPlaygroundCombinings()
			initPlaygroundFontSize()
			initInput()
		}
	}

/*
	playgroundConvert
*/
	const playgroundConvert = function() {
		const variant = playground_variants.querySelector('[name="playground-variant"]:checked').getAttribute('data-variant')

		const combinings = []
		qall('[name="playground-combining-diacritic"]:checked').forEach(function(check) {
			combinings.push(check.getAttribute('data-diacritic'))
		})
		if (combinings.length) Base.storage({ 'current-combinings': combinings.join(',') })

		const value = (function(value) {
			if (['r'].includes(variant)) return parseInt(value)
			return value			
		})(input.value)  

		logConversion(output.innerText, variant, combinings)

		output.innerText = toUnicodeVariant(value, variant, combinings)
		input.focus()
	}

/* 
	logConversion 
*/
	const logConversion = function(text, variant, combinings) {
		if (!text) return
		const alert = 
			`<div class="alert alert-light alert-dismissible fade show" role="alert">
				<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
				<p>${text}</p>
				<hr>
				<small class="mb-0">${variant}, ${combinings.join(',')}</small>
			</div>`

		gebi('conversion-log').insertAdjacentHTML('beforeend', alert)
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

		const current_variant = Base.storage('current-variant') || 'i'
		playground_variants.querySelectorAll('[name="playground-variant"]').forEach(function(radio) {
			if (current_variant === radio.getAttribute('data-variant')) radio.checked = true
			radio.onclick = function() {
				Base.storage({ 'current-variant': this.getAttribute('data-variant') })
				playgroundConvert()
			}
		})
	}

/*
	initInput
*/
	const initInput = function() {
		input.value = Base.storage('current-input') || 'unicode'
		input.focus()
		input.oninput = function() {
			playgroundConvert()
			Base.storage({ 'current-input': input.value })
		}
	}

/*
	initPlaygroundCombinings
*/
	const initPlaygroundCombinings = function() {
		const playground_combinings = gebi('playground-combinings')
		playground_combinings.addEventListener('shown.bs.collapse', function() {
			gebi('toggle-combinings').setAttribute('aria-expanded', 'false')
			Base.storage({ 'playground-combinings-collapsed': 'no' })
		})
		playground_combinings.addEventListener('hidden.bs.collapse', function() {
			gebi('toggle-combinings').setAttribute('aria-expanded', 'true')
			Base.storage({ 'playground-combinings-collapsed': 'yes' })
		})

		const combinings_collapsed = Base.storage('playground-combinings-collapsed') || 'yes'
		if (combinings_collapsed === 'yes') {
			playground_combinings.classList.add('collapse')
		} else {
			playground_combinings.classList.remove('collapse')
		}

		let current_combinings = Base.storage('current-combinings') || ''
		current_combinings = current_combinings.split(',')

		let form = '<div class="container">'
		form += '<div class="row">'
		for (const diacritic in Test.combinings) {
			const checked = current_combinings.includes(diacritic) ? 'checked' : ''
			form += '<div class="col-md-2 col-sm-6 col-xs-6">'
			form += `<div class="form-check">
			  <input class="form-check-input" type="checkbox" name="playground-combining-diacritic" data-diacritic="${diacritic}" id="diacritic-${Test.combinings[diacritic].short}" ${checked}>
			  <label class="form-check-label text-nowrap" for="diacritic-${Test.combinings[diacritic].short}" title="Enable the combining ${diacritic}">
					${diacritic}
			  </label>
			</div>`
			form += '</div>'
		}
		form += '</div>'
		form += '</div>'
		playground_combinings.insertAdjacentHTML('beforeend', form)

		qall('[name="playground-combining-diacritic"]').forEach(function(check) {
			if (current_combinings.includes(check.getAttribute('data-diacritic'))) check.checked = true
			check.onclick = playgroundConvert
		})
	
	}

/* 
	initPlaygroundFontSize
*/
	const initPlaygroundFontSize = function() {
		let current_font_size = Base.storage('current-font-size') || 4
		const font_size = gebi('current-font-size')

		const updateFontSize = function() {
			font_size.setAttribute('data-value', current_font_size)
			font_size.innerHTML = '&times;' + Math.abs(current_font_size - 7)
			output.classList.remove('fs-1', 'fs-2', 'fs-3', 'fs-4', 'fs-5', 'fs-6')
			output.classList.add('fs-' + current_font_size)
		}

		gebi('btn-larger-font').onclick = function() {
			current_font_size = current_font_size - 1
			if (current_font_size === 1) this.setAttribute('disabled', 'disabled')
			gebi('btn-smaller-font').removeAttribute('disabled')
			updateFontSize()
		}

		gebi('btn-smaller-font').onclick = function() {
			current_font_size = current_font_size + 1
			if (current_font_size === 6) this.setAttribute('disabled', 'disabled')
			gebi('btn-larger-font').removeAttribute('disabled')
			updateFontSize()
		}

	}

	return {
		init
	}

})(toUnicodeVariant, Base);

document.addEventListener("DOMContentLoaded", function(){
	Playground.init()
});


