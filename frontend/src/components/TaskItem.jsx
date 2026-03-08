import React from 'react';

const statusLabels = {
  pending: 'Ожидает',
  in_progress: 'В работе',
  done: 'Завершена'
};

const TaskItem = ({ task, onEdit, onDelete }) => {
  const createdAt = task.created_at
    ? new Date(task.created_at).toLocaleString()
    : '';

  return (
    <article className={`task-item task-item--${task.status}`}>
      <header className="task-item-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`task-status task-status--${task.status}`}>
          {statusLabels[task.status] ?? task.status}
        </span>
      </header>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <footer className="task-footer">
        <span className="task-created-at">
          Создана: {createdAt || '—'}
        </span>
        <div className="task-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onEdit}
          >
            Редактировать
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onDelete}
          >
            Удалить
          </button>
        </div>
      </footer>
    </article>
  );
};

export default TaskItem;

