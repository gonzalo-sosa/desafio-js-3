import { STATES, STATES_COLOR, STATES_LABEL } from "../consts";
import { PopoverElement } from "./PopoverElement";
import { StateIconElement } from "./StateIconElement";

export class TaskElement extends HTMLElement {
  static get observedAttributes() {
    return ["state"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Propiedades
    this.title = this.getAttribute("title") || "";
    this.dueDate = this.getAttribute("due-date") || "";
    this.location = this.getAttribute("location") || "location";
    this.state = this.getAttribute("state") || STATES_LABEL.NEW;
    this.btnColor = STATES_COLOR.NEW;

    this.render();
    this.initElements();
    this.bindEvents();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .task {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 2fr 3fr 1fr 1fr;
          align-content: center;
          align-items: center;
          column-gap: .5rem;
          padding-right: 5px;
        }
        
        .task__btn {
          margin: auto;
          outline: 0;
          border: none;
          border-radius: 100%;
          padding: .75rem;
        }

        .task__title,
        .task__dueDate,
        .task__location
        {
          text-align: center;
        }

        .task__description{
          margin-inline: .5rem;
          text-wrap: balance;
        }

        .task__location{
          padding-right: 1rem;
        }

        .task__action{
          position: absolute;
          top: 0;
          right: 0;
          font-size: 10px;
          outline: 0;
          border: 0;
          border-radius: .25rem;
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
        <span class="task__dueDate">${this.dueDate}</span>
        <span class="task__location">${this.location}</span>
        <button class="task__action"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="7"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg></button>
      </article>`;
  }

  initElements() {
    this.task = this.shadowRoot.querySelector("article");
    this.btn = this.shadowRoot.querySelector(".task__btn");
    this.popoverElement = this.task.querySelector("popover-element");
    this.btnAction = this.shadowRoot.querySelector(".task__action");

    this.updateBtn(this.btnColor);
  }

  bindEvents() {
    this.btn.addEventListener("click", () =>
      this.popoverElement.togglePopover()
    );
    this.btnAction.addEventListener("click", this.handleClick.bind(this));
    this.createStateList();
  }

  createStateList() {
    const $list = document.createElement("ul");
    $list.classList.add("state-list");

    STATES.forEach((state) => {
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
    });

    this.popoverElement.appendChild($list);
  }

  connectedCallback() {
    this.updateBtn(this.btnColor); // Actualiza el botón al agregar el elemento al DOM
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "state" && oldValue !== newValue) {
      this.state = newValue;
      this.updateBtn(STATES_COLOR[newValue]); // Actualiza el color del botón si cambia el estado
    }
  }

  updateState(state) {
    this.state = state;
    this.setAttribute("state", state);
  }

  updateBtn(color) {
    this.btn.style.backgroundColor = color;
  }

  handleClick() {
    console.log("ACTION BTN");
  }

  disconnectedCallback() {
    // Remover eventos si es necesario
    this.btn.removeEventListener("click", this.handleClick);
  }
}

customElements.define("task-element", TaskElement);
