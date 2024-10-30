import { TASK_STATES } from "./Task";

const TASK_STATES_COLOR = {
  NEW: "#656F7D",
  IN_PROGRESS: "#40A6E6",
  COMPLETED: "#F9BE33",
};

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
          gap: .5rem;
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
        }

        :popover-open{
          width: fit-content;
          height: fit-content;
          position: absolute;
          top: 0;
        }
        
        :popover-open button{
          width: 100%;
          outline: 0;
          border: none;
          background-color: transparent;
          text-align: start;
        }
        
        :popover-open button::before{
          content: "•";
          font-size: 2.5em;
          vertical-align: middle;
          display: inline-block;
          margin-right: .5rem;
        }

      </style>
      <article class="task">
        <button class="task__btn"></button>
        <h4 class="task__title">${this.title}</h4>
        <p class="task__description"><slot></slot></p>
        <span class="task__expirationDate">${this.createdAtDate}</span>
        <span class="task__expirationDate">${this.expirationDate}</span>
      </article>`;
  }

  // se invoca cuando se añade el elemento al dom
  connectedCallback() {
    this.task = this.shadowRoot.querySelector("article");

    this.btn = this.shadowRoot.querySelector("button");
    this.updateBtn();

    const $div = document.createElement("div");
    $div.setAttribute("popover", "");

    const $list = document.createElement("ul");
    $list.classList.add("state-list");

    for (const state in TASK_STATES) {
      const $listItem = document.createElement("li");
      const $btn = document.createElement("button");

      $btn.textContent = TASK_STATES[state];

      $btn.addEventListener("click", () => {
        this.updateState(TASK_STATES[state]);
      });

      $listItem.appendChild($btn);

      $list.appendChild($listItem);
    }
    $div.appendChild($list);

    this.shadowRoot.appendChild($div);

    this.task.appendChild($div);

    this.btn.addEventListener("click", () => {
      this.task.querySelector("div").showPopover();
    });
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
