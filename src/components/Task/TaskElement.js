import { STATES, STATES_COLOR, STATES_LABEL } from "../consts";
import { PopoverElement } from "../Popover/PopoverElement";
import { StateIconElement } from "../StateIcon/StateIconElement";

export class TaskElement extends HTMLElement {
  constructor() {
    super();
    this.title = this.getAttribute("title");
    this.createdAtDate =
      this.getAttribute("created-at-date") ?? new Date().toLocaleDateString();
    this.expirationDate = this.getAttribute("expiration-date");
    this.state = this.getAttribute("state") ?? STATES_LABEL.NEW;
    this.btnColor = STATES_COLOR.NEW;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .task {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 2fr 3fr 1fr 1fr;
          align-content: center;
          align-items: center;
          column-gap: .5rem;
        }
        
        .task__btn {
          margin: auto;
          outline: 0;
          border: none;
          border-radius: 100%;
          padding: .75rem;
        }

        .task__title,
        .task__createdAtDate,
        .task__expirationDate{
          text-align: center;
        }

        .task__description{
          margin-inline: .5rem;
          text-wrap: balance;
        }

        .state-list{
          display: flex;
          flex-direction: column;
          gap: .25rem;
          margin: 0;
          padding: 0;
          list-style-type: none;
        }

        .state-list button{
          font-size: 10px;
          width: 100%;
          background-color: transparent;
          outline: 0;
          border: 0;
          text-align: start;
        }

        .state-list button state-icon-element{
          font-size: 10px;
          margin-right: 10px;
        }
      </style>
      <article class="task">
        <button class="task__btn"><popover-element></popover-element></button>
        <h4 class="task__title">${this.title}</h4>
        <p class="task__description"><slot></slot></p>
        <span class="task__createdAtDate">${this.createdAtDate}</span>
        <span class="task__expirationDate">${this.expirationDate}</span>
      </article>`;

    this.task = this.shadowRoot.querySelector("article");
    this.btn = this.shadowRoot.querySelector("button");
    this.popoverElement = this.task.querySelector("popover-element");

    this.updateBtn(this.btnColor);
  }

  // se invoca cuando se añade el elemento al dom
  connectedCallback() {
    const $list = document.createElement("ul");
    $list.classList.add("state-list");

    for (const state of STATES) {
      const $listItem = document.createElement("li");
      const $btn = document.createElement("button");
      const $stateIcon = `<state-icon-element color="${state.color}"></state-icon-element>`;

      $btn.textContent = state.label;
      $btn.addEventListener("click", () => {
        this.updateState(state.label);
        this.updateBtn(state.color);
      });

      $btn.insertAdjacentHTML("afterbegin", $stateIcon);
      $listItem.append($btn);

      $list.appendChild($listItem);

      this.popoverElement.appendChild($list);
    }

    this.btn.addEventListener("click", () =>
      this.popoverElement.togglePopover()
    );
  }

  updateState(state) {
    this.state = state;
    this.setAttribute("state", state);
  }

  updateBtn(color) {
    this.btn.style.backgroundColor = color;
  }
}

customElements.define("task-element", TaskElement);
