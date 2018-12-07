let loader_text = document.getElementById('loader-text');
let $spans = document.getElementsByTagName('span');
let page_preloader = document.getElementById('preloader');
let page_wrapper = document.getElementById('wrapper');
let page_bg_noise = document.getElementById('bg-audio-container');

function randomFade(elements) {
  let shownCount = 0,
  indexes = [];
  function appear(el) {
    setTimeout(function() {
      let count = 10, i = setInterval(function() {
        el.style.opacity = (parseFloat(el.style.opacity) || 0) + 0.1;
          if (!count--) 
             clearInterval(i);
        }, 50);
    }, shownCount++*100); 
  }
  function shuffle(o){
    for(let j, x, i = o.length; i; j = Math.floor(Math.random() * i), 
      x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };
  for (let i = elements.length; i--;) indexes.push(i);
  indexes = shuffle(indexes);
  for (let f = indexes.length; f--;) appear(elements[indexes[f]]);
}

window.addEventListener('load', function() {
  page_bg_noise.style.opacity = 1;
	page_preloader.style.opacity = 1;
	page_wrapper.style.opacity = 1;
});

randomFade($spans);


