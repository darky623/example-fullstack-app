import React, { useEffect, useState } from 'react';

const TaskForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(
    initialData?.description ?? ''
  );
  const [status, setStatus] = useState(initialData?.status ?? 'pending');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? '');
      setDescription(initialData.description ?? '');
      setStatus(initialData.status ?? 'pending');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Название обязательно');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      status
    };

    onSubmit(payload);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="title">Название</label>
        <input
          id="title"
          type="text"
          value={title}
          maxLength={255}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например, Написать отчёт"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Дополнительные детали задачи"
          rows={3}
        />
      </div>

      <div className="form-field">
        <label htmlFor="status">Статус</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Ожидает</option>
          <option value="in_progress">В работе</option>
          <option value="done">Завершена</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Сохранить' : 'Создать'}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;

