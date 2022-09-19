const guideScripts = document.querySelectorAll('.guide-article script');
const guideNav = document.querySelector('.guide-nav');
const active_CN = 'active';

const replaceType = () => {
  guideScripts.forEach(script => {
    const originStr = script.attributes.type.value;
    const replaceStr = originStr.replace('html', 'plain');
    script.attributes.type.value = replaceStr;
  });
};

const createGuideUI = () => {
  guideScripts.forEach(script => {
    const div = document.createElement('div');
    const code = script.textContent;
    div.innerHTML = code;
    script.before(div);
  });
};

const handleGuideNav = event => {
  event.preventDefault();
  const target = event.target;
  const targetHash = target.getAttribute('href');
  const targetSection = document.querySelector(targetHash);
  const targetSectionTop = targetSection.offsetTop;
  window.scrollTo({
    top: targetSectionTop,
    behavior: "smooth"
  });
};

const init = () => {
  replaceType();
  createGuideUI();
  guideNav.addEventListener('click', handleGuideNav);
};

init();