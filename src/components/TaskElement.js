import { STATES, STATES_COLOR, STATES_LABEL } from "../consts";
// eslint-disable-next-line no-unused-vars
import { PopoverElement, StateIconElement } from "./index";

export class TaskElement extends HTMLElement {
  static get observedAttributes() {
    return ["state"];
  }

  constructor(id, title, description, dueDate, location, state) {
    super();
    this.attachShadow({ mode: "open" });

    // Propiedades
    this.id = id ?? this.getAttribute("id");
    this.title = title ?? this.getAttribute("title");
    this.description = description ?? this.getAttribute("description");
    this.dueDate = dueDate
      ? dueDate instanceof Date
        ? dueDate
        : new Date(dueDate)
      : new Date(this.getAttribute("due-date"));
    this.location = location ?? [
      this.getAttribute("latitude"),
      this.getAttribute("longitude"),
    ];
    this.state = (state || this.getAttribute("state")) ?? STATES.NEW;
    this.btnColor = STATES_COLOR[this.state];

    // drag y drop
    this.draggable = true;

    this.render();
    this.initElements();
    this.bindEvents();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .task{
          padding: .35rem;
          display: flex;
          flex-direction: row;
          gap: 1.2rem;
          align-items: center;
          justify-content: space-between;
        }
        .task__btn{
          margin-top: .35rem;
          align-self: start;
          width: 15px;
          height: 15px;
          border-radius: 100%;
          border: none;
          outline: 0;
        }
        .task__data{
          display: flex;
          flex-direction: column;
          gap: .35rem;
        }
        .task__dueDate{
          font-size: .75rem;
          opacity: .5;
        }
        .task__delete{
          align-self: start;
          border-radius: .5rem;
          padding: .35rem .75rem;
          border: none;
          outline: 0;
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
        <button class="task__btn"><popover-element open="false"></popover-element></button>
        <div class="task__data">
          <span class="task__title">${this.title}</span>
          <span class="task__dueDate">Vencimiento: ${
            this.dueDate.toISOString().split("T")[0]
          }</span>
        </div>
        <button class="task__delete">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="7px"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
          </svg>
        </button>
      </article>`;
  }

  initElements() {
    this.$task = this.shadowRoot.querySelector(".task");
    this.$btnState = this.$task.querySelector(".task__btn");
    this.$popover = this.$task.querySelector("popover-element");
    this.$btnDelete = this.$task.querySelector(".task__delete");
  }

  bindEvents() {
    this.$btnState.addEventListener("click", () =>
      this.$popover.togglePopover()
    );

    this.$btnDelete.addEventListener("click", this.handleDelete.bind(this));
    this.createStateList();
  }

  createStateList() {
    const $list = document.createElement("ul");
    $list.classList.add("state-list");

    for (const state in STATES) {
      const $listItem = document.createElement("li");
      const $btn = document.createElement("button");
      const $stateIcon = `<state-icon-element color="${STATES_COLOR[state]}"></state-icon-element>`;

      $btn.textContent = STATES_LABEL[state];
      $btn.addEventListener("click", () => {
        this.updateState(state);
      });

      $btn.insertAdjacentHTML("afterbegin", $stateIcon);
      $listItem.append($btn);
      $list.appendChild($listItem);
    }

    this.$popover.appendChild($list);
  }

  connectedCallback() {
    this.setAttribute("description", this.description);
    this.setAttribute("state", this.state);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "state" && oldValue !== newValue) {
      this.state = newValue;
      this.updateBtn(STATES_COLOR[newValue]); // Actualiza el color del botón si cambia el estado
      this.handleChangeState();
    }
  }

  updateState(state) {
    this.state = state;
    this.setAttribute("state", state);
  }

  updateBtn(color) {
    this.$btnState.style.backgroundColor = color;
  }

  handleChangeState() {
    this.dispatchEvent(
      new CustomEvent("state-changed", {
        detail: { id: this.id, state: this.state },
        bubbles: true,
        composed: true,
      })
    );
  }

  handleDelete() {
    this.dispatchEvent(
      new CustomEvent("task-deleted", {
        detail: { id: this.id },
        bubbles: true,
        composed: true,
      })
    );
    this.remove();
  }

  disconnectedCallback() {
    this.$btnState.removeEventListener("click", this.$popover.togglePopover());
    this.$btnDelete.removeEventListener("click", this.handleDelete);
  }
}

customElements.define("task-element", TaskElement);
