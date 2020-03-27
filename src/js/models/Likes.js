export default class Likes{
  constructor(){
    this.likes = [];
  }

  addLikes(id, title, author, img) {
    const like = {
      id,
      title,
      author,
      img
    }
    this.likes.push(like);
    return item
  }

  deleteLike(id) {
    const index = this.likes.findIndex(current => current.id === id);
    this.likes.splice(index, 1);
  }

  isLiked(id) {
    return this.likes.findIndex(current => current.id === id) !== -1;
  }

  getNumberOfLikes() {
    return this.likes.length;
  }
};