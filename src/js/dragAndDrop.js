export default class DnD {
  constructor() {
    this.taskList = document.querySelector('.task-list');
    this.cardPlacesArr = Array.from(document.getElementsByClassName('card-place'));
    this.draggedItem = null;
    this.selectedItem = null;
    this.selectedItemParent = null;
    this.rect = null;
    this.startX = 0;
    this.startY = 0;

    this.run();
  }

  run() {
    const area = document.createElement('div');
    area.classList.add('area');

    document.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('delete-card')) return;
      this.selectedItem = e.target.closest('.card');
      if (!this.selectedItem) return;
      this.selectedItemParent = this.selectedItem.parentElement;

      this.rect = this.selectedItem.getBoundingClientRect();
      this.width = this.selectedItem.clientWidth;
      this.height = this.selectedItem.clientHeight;
      this.startX = e.clientX;
      this.startY = e.clientY;

      const { scrollX, scrollY } = window;

      area.style.height = `${this.height}px`;

      this.draggedItem = this.selectedItem.cloneNode(true);
      this.draggedItem.classList.add('card-dragger');
      this.draggedItem.style.width = `${this.width}px`;
      this.draggedItem.style.height = `${this.height}px`;
      this.draggedItem.style.left = `${this.rect.left + scrollX}px`;
      this.draggedItem.style.top = `${this.rect.top + scrollY}px`;

      this.taskList.appendChild(this.draggedItem);
      document.body.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.selectedItem) return;
      e.preventDefault();

      const { scrollX, scrollY } = window;

      const left = this.rect.left + scrollX + e.clientX - this.startX;
      const top = this.rect.top + scrollY + e.clientY - this.startY;

      this.draggedItem.style.top = `${top}px`;
      this.draggedItem.style.left = `${left}px`;
      this.selectedItem.remove();

      if (e.target.classList.contains('card-place') && !e.target.firstElementChild) {
        e.target.append(area);
      } if (e.target.classList.contains('card') || e.target.closest('.card')) {
        const card = e.target.classList.contains('card') ? e.target : e.target.closest('.card');

        const overElHeight = card.getBoundingClientRect().height;
        const overElTop = card.getBoundingClientRect().top;
        const mousePosition = e.clientY;

        if (mousePosition < overElTop + (overElHeight / 2)) {
          card.insertAdjacentElement('beforebegin', area);
        } else if (mousePosition > overElTop + (overElHeight / 2)) {
          card.insertAdjacentElement('afterend', area);
        }
      }
    });

    this.cardPlacesArr.forEach((item) => {
      item.addEventListener('mouseleave', (e) => {
        if (e.target.querySelector('.area')) {
          e.target.querySelector('.area').remove();
        }
      });
    });

    document.addEventListener('mouseup', (e) => {
      if (!this.selectedItem) return;

      const x = e.clientX;
      const y = e.clientY;
      const changingItem = document.elementFromPoint(x, y);

      if (changingItem.classList.contains('area')) {
        changingItem.closest('.card-place').replaceChild(this.selectedItem, changingItem);
      } else if (!changingItem.classList.contains('area')) {
        this.selectedItemParent.insertAdjacentElement('afterbegin', this.selectedItem);
      }

      this.selectedItem = null;
      this.draggedItem.remove();
      this.draggedItem = null;
      document.body.style.cursor = 'auto';
    });
  }
}
