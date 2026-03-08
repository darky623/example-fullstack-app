import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';

const App = () => {
  const [theme, setTheme] = useState(
    () =>
      (typeof window !== 'undefined' && window.localStorage.getItem('theme')) ||
      'dark'
  );
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить задачи.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const handleCreate = async (values) => {
    try {
      setError('');
      await createTask(values);
      await loadTasks();
    } catch (err) {
      console.error(err);
      setError('Не удалось создать задачу.');
    }
  };

  const handleUpdate = async (id, values) => {
    try {
      setError('');
      await updateTask(id, values);
      setEditingTask(null);
      await loadTasks();
    } catch (err) {
      console.error(err);
      setError('Не удалось обновить задачу.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить эту задачу?')) return;
    try {
      setError('');
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      console.error(err);
      setError('Не удалось удалить задачу.');
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        </button>
      </header>

      <main className="app-main">
        <section className="form-section">
          <h2>{editingTask ? 'Редактирование задачи' : 'Новая задача'}</h2>
          <TaskForm
            key={editingTask ? editingTask.id : 'new'}
            initialData={editingTask}
            onSubmit={(values) =>
              editingTask
                ? handleUpdate(editingTask.id, values)
                : handleCreate(values)
            }
            onCancel={editingTask ? handleCancelEdit : null}
          />
        </section>

        <section className="list-section">
          <div className="list-header">
            <h2>Список задач</h2>
            <button
              type="button"
              className="refresh-button"
              onClick={loadTasks}
              disabled={loading}
            >
              Обновить
            </button>
          </div>

          {loading && <p>Загрузка...</p>}
          {error && <p className="error-text">{error}</p>}

          <TaskList
            tasks={tasks}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
};

export default App;

