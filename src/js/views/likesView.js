import {domElements} from './baseSelectors';
import {limitRecipeTitle} from './searchView';

export const toggleLikeButton = isLiked => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`); 
  // icons.svg#icon-heart-outlined
};

export const toggleLikesMenu = numberOfLikes => {
  domElements.likesMenu.style.visibility = numberOfLikes > 0 ? 'visible' : 'hidden';
};

export const renderLikesList = like => {
  const markup = `
    <li>
      <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
          <img src="${like.img}" alt="${like.title}">
        </figure>
        <div class="likes__data">
          <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
          <p class="likes__author">${like.author}</p>
        </div>
      </a>
    </li>
  `;
  domElements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
  const element = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
  if(element) element.parentElement.removeChild(element);
}