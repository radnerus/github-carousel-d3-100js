// https://api.github.com/users?since=1000
const imagesEle = document.querySelector('#images');
const indicatorsEle = document.querySelector('#indicators');
const titleEle = document.querySelector('#title');

let users;

let imageTransition = false;

const githubClientId = '9a774d35f8f107fef507';
const githubClientSecret = 'b81c7d6358c86aa726486e70669b44107268ada0';

const loadRandomUser = async () => {
    const randomNumber = Math.floor(Math.random() * 1000);

    const res = await fetch(`https://api.github.com/users?since=${randomNumber}&client_id=${githubClientId}&client_secret=${githubClientSecret}`);
    users = await res.json();

    let allImagesElement = '';
    let allIndicatorsElement = '';

    users.forEach((user, index) => {
        allImagesElement += `
            <div class="carousel-item ${!index && 'active'}" image-position="${index}">
                <img class="d-block w-100" src="${user.avatar_url}" alt="slide">
                <div class="carousel-caption d-none d-md-block">
                    <h5 name-position="${index}"></h5>
                    <p bio-position="${index}"></p>
                </div>
            </div>
            `;
        allIndicatorsElement += `<li data-target="#carousel" data-slide-to="${index}" onclick="changeImageUsingIndicator(event)" ${!index && 'class="active"'}></li>`
    });

    imagesEle.innerHTML = allImagesElement;
    indicatorsEle.innerHTML = allIndicatorsElement;
    titleEle.innerHTML = `User: ${users[0].login}`;

    const currentUser = users[0];

    const response = await fetch(`${currentUser.url}?client_id=${githubClientId}&client_secret=${githubClientSecret}`);
    const user = await response.json();

    const nameEle = document.querySelector(`[name-position='0']`);
    nameEle.innerHTML = user.name;

    const bioEle = document.querySelector(`[bio-position='0']`);
    bioEle.innerHTML = user.bio;



    console.log(users);
}

const changeImage = async (action) => {
    if (imageTransition) return;

    imageTransition = true;


    const activeImage = document.querySelector('.carousel-item.active');
    let activeImagePosition = Number(activeImage.attributes['image-position'].value);

    if (activeImagePosition === 0 && action === 'prev') {
        imageTransition = false;
        return;
    } else if (activeImagePosition === users.length - 1 && action === 'next') {
        imageTransition = false;
        return;
    }

    if (action === 'next') {
        activeImage.nextElementSibling.classList.add('active');
        activeImagePosition++;
    } else {
        activeImage.previousElementSibling.classList.add('active');
        activeImagePosition--;
    };

    const currentUser = users[activeImagePosition];

    const res = await fetch(`${currentUser.url}?client_id=${githubClientId}&client_secret=${githubClientSecret}`);
    const user = await res.json();

    const activeIndicator = document.querySelector('.carousel-indicators .active');
    activeIndicator.classList.remove('active');


    activeImage.classList.remove('active');


    titleEle.innerHTML = `User: ${currentUser.login}`;
    imageTransition = false;

    const toElement = document.querySelector(`[data-slide-to='${activeImagePosition}']`);
    toElement.classList.add('active');



    const nameEle = document.querySelector(`[name-position='${activeImagePosition}']`);
    nameEle.innerHTML = user.name;

    const bioEle = document.querySelector(`[bio-position='${activeImagePosition}']`);
    bioEle.innerHTML = user.bio;

}

const changeImageUsingIndicator = async ({ target }) => {
    if (imageTransition) return;

    imageTransition = true;
    const toSlideIndex = target.attributes['data-slide-to'].value;

    console.log(toSlideIndex);

    const currentUser = users[toSlideIndex];

    const res = await fetch(currentUser.url);
    const user = await res.json();

    const nameEle = document.querySelector(`[name-position='${toSlideIndex}']`);
    nameEle.innerHTML = user.name;

    const bioEle = document.querySelector(`[bio-position='${toSlideIndex}']`);
    bioEle.innerHTML = user.bio;

    const toElement = document.querySelector(`[image-position='${toSlideIndex}']`);

    const activeImage = document.querySelector('.carousel-item.active');
    activeImage.classList.remove('active');

    toElement.classList.add('active');

    const activeIndicator = document.querySelector('.carousel-indicators .active');
    activeIndicator.classList.remove('active');

    titleEle.innerHTML = `User: ${currentUser.login}`;
    target.classList.add('active');
    imageTransition = false;

}


loadRandomUser();