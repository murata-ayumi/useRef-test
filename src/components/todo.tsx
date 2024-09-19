import React, { useRef, useState, useEffect } from 'react';
import { Todo } from '../types/TodoType';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import Button from './button';
import '../App.css';

// TodoAppコンポーネント
const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const taskRef = useRef<HTMLInputElement>(null);

  // ローカルストレージからTodoを取得
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    setTodos(storedTodos);
  }, []);

  // ローカルストレージにTodoを保存
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // 現在の日時を取得する関数
  const getCurrentTimestamp = () => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  // 新しいTodoを追加
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const task = taskRef.current?.value;
    if (task) {
      setTodos([
        ...todos,
        {
          id: uuidv4(),
          task,
          completed: false,
          isEditing: false,
          timestamp: getCurrentTimestamp(),
        },
      ]);
      taskRef.current.value = ''; // フォームのリセット
    }
  };

  // Todoの削除
  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 編集モードの切り替え
  const handleEditTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  // 編集後の保存
  const handleSaveEdit = (id: string, task: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              task,
              isEditing: false,
              timestamp: getCurrentTimestamp(),
            }
          : todo
      )
    );
  };

  // Todoの完了状態の変更
  const handleToggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <form onSubmit={handleAddTodo}>
        <input ref={taskRef} type="text" placeholder="New task..." autoFocus />
        <Button text="Add" onClick={() => handleAddTodo} />
      </form>

      <ul>
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            className="todo-item"
            initial={{ opacity: 0 }} // 初期状態
            animate={{ opacity: 1 }} // アニメーション後の状態
            transition={{ duration: 0.5, ease: 'easeOut' }} // アニメーションの時間
          >
            <li>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {todo.isEditing ? null : (
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                  />
                )}
                {todo.isEditing ? (
                  <input
                    type="text"
                    defaultValue={todo.task}
                    onBlur={(e) => handleSaveEdit(todo.id, e.target.value)}
                  />
                ) : (
                  <span
                    style={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                    }}
                  >
                    {todo.task}
                  </span>
                )}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <Button
                    className={`edit-button ${
                      todo.completed ? 'disabled' : ''
                    }`}
                    text={todo.isEditing ? 'Save' : 'Edit'}
                    onClick={() => handleEditTodo(todo.id)}
                    disabled={todo.completed}
                  />
                  {todo.isEditing ? null : (
                    <Button
                      className="delete-button"
                      text="Delete"
                      onClick={() => handleDeleteTodo(todo.id)}
                    />
                  )}
                </motion.div>
              </motion.div>
            </li>
            <div className="timestamp-container">
              <div className="timestamp">add{todo.timestamp}</div>
              <div className="donetimestamp">
                {todo.completed ? `done${todo.timestamp}` : null}
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
