import { TASK_STATES } from "./Task";
import { PopoverElement } from "../Popover/PopoverElement";

export class TaskElement extends HTMLElement {
  constructor() {
    super();
    this.title = this.getAttribute("title");
    this.createdAtDate =
      this.getAttribute("created-at-date") ?? new Date().toLocaleDateString();
    this.expirationDate = this.getAttribute("expiration-date");
    this.state = this.getAttribute("state") ?? TASK_STATES.NEW;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .task {
          position: relative;
          display: grid;
          grid-template-columns: 10% 20% 30% 20% 20%;
          align-content: center;
          align-items: center;
          column-gap: .5rem;
        }
        
        .task__btn {
          margin: auto;
          outline: 0;
          border: none;
          background-color: transparent;
          border-radius: 100%;
          padding: .75rem;
        }

        .task__title{
          flex-grow: 1;  
        }

        .task__description{
          flex-grow: 2;
        }

        .state-list{
          margin: 0;
          padding: 0;
          list-style-type: none;
        }

        .state-list button{
          width: 100%;
          background-color: transparent;
          outline: 0;
          border: 0;
          text-align: start;
        }
      </style>
      <article class="task">
        <button class="task__btn"></button>
        <h4 class="task__title">${this.title}</h4>
        <p class="task__description"><slot></slot></p>
        <span class="task__expirationDate">${this.createdAtDate}</span>
        <span class="task__expirationDate">${this.expirationDate}</span>
        <popover-element></popover-element>
      </article>`;
  }

  // se invoca cuando se añade el elemento al dom
  connectedCallback() {
    this.task = this.shadowRoot.querySelector("article");

    this.btn = this.shadowRoot.querySelector("button");
    this.updateBtn();

    this.popoverElement = this.task.querySelector("popover-element");
    const $list = document.createElement("ul");

    for (const state in TASK_STATES) {
      const $listItem = document.createElement("li");
      const $btn = document.createElement("button");

      $btn.textContent = TASK_STATES[state];
      $btn.addEventListener("click", () =>
        this.updateState(TASK_STATES[state])
      );

      $listItem.appendChild($btn);

      $list.appendChild($listItem);
      $list.classList.add("state-list");

      this.popoverElement.appendChild($list);
    }

    this.btn.addEventListener("click", () =>
      this.popoverElement.togglePopover()
    );
  }

  // se invoca cuando el desconecta del dom
  disconnectedCallback() {
    //this.btn.removeEventListener("click", () => {});
  }

  updateState(state) {
    this.state = state;
    this.setAttribute("state", this.state);
    this.updateBtn();
  }

  updateBtn() {
    const indexOfState = Object.values(TASK_STATES).indexOf(this.state);
    const keys = Object.keys(TASK_STATES_COLOR);

    this.btn.style.backgroundColor = TASK_STATES_COLOR[keys[indexOfState]];
  }
}

customElements.define("task-element", TaskElement);
