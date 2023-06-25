//(function() {
//	var bl = true;
//	var button = document.getElementById('burger');
//	button.addEventListener('click', function(event) { 
//		event.preventDefault();
//		var menu = document.getElementById('header_');
//		menu.classList.toggle('is-open');
//		var menu1 = document.getElementById('infor');
//		menu1.classList.toggle('is-open');
//		var p = document.getElementById('bur-p');
//		if (bl) {
//			bl=false;
//			p.textContent='✖';
//		}else{
//			bl=true;
//			p.textContent='☰';
//		}
//	});
//})();

function givEl(el) {
  return document.querySelector(el)
}

function toggleOpen(el) {
  return el.classList.toggle('is-open')
}

function onClick() {
  const menu = givEl('#header_')
  const language = givEl('#infor')
  const icon = givEl('#burger-p')
  const body = givEl('#body')
  const headerUl = givEl('#header-ul')
  toggleOpen(menu)
  toggleOpen(language)
  toggleOpen(body)
  toggleOpen(headerUl)
  menu.classList.contains('is-open') 
    ? icon.textContent = '✖'
    : icon.textContent = '☰'
}

window.onload = () => {
  const button = givEl('#burger')
  button.addEventListener('click', onClick)
  const navEls = document.querySelectorAll('.navEl')
  navEls.forEach(el => {
    el.addEventListener('click', onClick)
  })
}
