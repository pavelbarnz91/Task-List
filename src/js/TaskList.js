/* eslint-disable no-shadow */
import DnD from './dragAndDrop';

export default class TaskList {
  constructor(dnd) {
    this.load();

    this.DnD = dnd;
    this.taskList = document.querySelector('.task-list');
    this.todo = this.taskList.querySelector('[data-card-place="todo"]');
    this.inProgress = this.taskList.querySelector('[data-card-place="in-progress"]');
    this.done = this.taskList.querySelector('[data-card-place="done"]');
    this.addAnotherCard = Array.from(document.getElementsByClassName('footer-text'));
    this.footers = Array.from(document.getElementsByClassName('footer'));
    this.img = null;
    this.saveObject = {};

    this.run();
  }

  run() {
    this.save();
    // eslint-disable-next-line no-new
    new DnD();

    this.taskList.addEventListener('mouseover', (e) => {
      if (e.target.classList.contains('card') || e.target.closest('.card')) {
        const item = e.target.classList.contains('card') ? e.target : e.target.closest('.card');
        item.querySelector('.delete-card').classList.remove('hidden');
        item.addEventListener('mouseout', () => {
          const deleteCard = item.querySelector('.delete-card');
          deleteCard.classList.add('hidden');
        });
        item.querySelector('.delete-card').addEventListener('click', (e) => { this.deleteCard(e); });
      }
    });

    this.footers.forEach((item) => {
      item.append(this.createAddCardBox());
    });

    this.addAnotherCard.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.target.closest('.task-list__column').querySelector('.add-card-box').classList.remove('hidden');
        e.target.classList.add('hidden');
      });
    });
  }

  createAddCardBox() {
    const addCardBox = document.createElement('div');
    addCardBox.classList.add('add-card-box');
    addCardBox.classList.add('hidden');
    addCardBox.innerHTML = `
            <div class="add-card-box__image-box hidden"></div>
            <div class="add-card-box__textarea-box">
                <textarea class="add-card-box__textarea"  maxlength="100" required placeholder="Enter text..."></textarea>
            </div>
            <div class="add-card-box__control">
                <div class="add-card__and__file-btn">
                    <button class="add-card-btn">Add</button>
                    <div class="add-file-box">
                        <input class="add-file-box__input" type="file">
                    </div>
                </div>
                <div class="add-card__cancel"></div>
            </div>`;

    const addCardBtn = addCardBox.querySelector('.add-card-btn');
    const addFileBtn = addCardBox.querySelector('.add-file-box__input');
    const cancelAddCard = addCardBox.querySelector('.add-card__cancel');

    addCardBtn.addEventListener('click', (e) => { this.addCard(e); });
    addFileBtn.addEventListener('change', (e) => { this.addImage(e); });
    cancelAddCard.addEventListener('click', (e) => { this.cancelAddCard(e); });

    return addCardBox;
  }

  addImage(e) {
    const file = e.target.files[0];
    this.img = document.createElement('img');
    this.img.src = URL.createObjectURL(file);
    this.img.classList.add('card-image');
  }

  cancelAddCard(e) {
    if (this.img) {
      URL.revokeObjectURL(this.img.src);
      this.img = null;
    }

    e.target.closest('.add-card-box__control').querySelector('.add-file-box__input').value = '';
    e.target.closest('.add-card-box').querySelector('.add-card-box__textarea').value = '';
    e.target.closest('.add-card-box').classList.add('hidden');
    e.target.closest('.footer').firstElementChild.classList.remove('hidden');
  }

  addCard(e) {
    const newCard = document.createElement('div');
    newCard.classList.add('card');

    const cardTextArea = e.target.closest('.add-card-box').querySelector('.add-card-box__textarea');

    newCard.innerHTML = `
        <div class="card-image-box"></div>
        <div class="card-text-box">
            <span class="card-text">${cardTextArea.value}</span>
        </div>
        <div class="card-footer">
            <div class="delete-card hidden"></div>
        </div>`;

    cardTextArea.value = '';

    if (this.img) {
      newCard.querySelector('.card-image-box').append(this.img);
      this.img = null;
      e.target.closest('.add-card__and__file-btn').querySelector('.add-file-box__input').value = '';
    }

    e.target.closest('.task-list__column').querySelector('.card-place').append(newCard);
    e.target.closest('.add-card-box').classList.add('hidden');
    e.target.closest('.footer').firstElementChild.classList.remove('hidden');
    URL.revokeObjectURL(this.img);
  }

  eventsForCards(item) {
    item.addEventListener('mouseover', () => {
      item.querySelector('.delete-card').classList.remove('hidden');
    });

    item.addEventListener('mouseout', () => {
      item.querySelector('.delete-card').classList.add('hidden');
    });

    item.querySelector('.delete-card').addEventListener('click', (e) => { this.deleteCard(e); });
  }

  deleteCard(e) {
    e.target.closest('.card').remove();
    e.target.removeEventListener('click', this.deleteCard);
  }

  save() {
    window.addEventListener('beforeunload', () => {
      this.saveObject.todo = this.todo.outerHTML;
      this.saveObject.inProgress = this.inProgress.outerHTML;
      this.saveObject.done = this.done.outerHTML;
      localStorage.myCards = JSON.stringify(this.saveObject);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  load() {
    if (localStorage.myCards === undefined) return;
    const myCards = JSON.parse(localStorage.myCards);
    document.querySelector('[data-card-place="todo"]').outerHTML = myCards.todo;
    document.querySelector('[data-card-place="in-progress"]').outerHTML = myCards.inProgress;
    document.querySelector('[data-card-place="done"]').outerHTML = myCards.done;
  }
}
