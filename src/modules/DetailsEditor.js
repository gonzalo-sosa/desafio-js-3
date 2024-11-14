import { TabContentEditor } from './TabContentEditor';

export class DetailsEditor extends TabContentEditor {
  editContent($tabContent, $taskElement) {
    const $details = $tabContent;
    const $title = $details.querySelector('[name=title]');
    const $description = $details.querySelector('[name=description');
    const $dueDate = $details.querySelector('[name=due-date]');
    const $record = $details.querySelector('record-element');

    $title.setAttribute('value', $taskElement.title);
    $description.value = $taskElement.description ?? '';
    $dueDate.setAttribute(
      'value',
      new Date($taskElement.dueDate).toISOString().split('T')[0]
    );

    const id = document.querySelector('tab-manager').getAttribute('task-id');
    const src = localStorage.getItem(`${id}-audio`);

    $record.setAttribute('task-id', id);
    $record.setAttribute('src', src ?? '');
  }
}
