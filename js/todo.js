// TODO App Functionality
class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.currentFilter = 'all';
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        const todoInput = document.getElementById('todoInput');
        const addBtn = document.getElementById('addTodoBtn');
        const todoList = document.getElementById('todoList');
        const clearBtn = document.getElementById('clearCompleted');
        const filterBtns = document.querySelectorAll('.filter-btn');

        if (!todoInput || !addBtn) return;

        // Add event listeners
        addBtn.addEventListener('click', () => this.addTodo());
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        clearBtn.addEventListener('click', () => this.clearCompleted());

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        this.initialized = true;
        this.render();
    }

    loadTodos() {
        const saved = localStorage.getItem('jetson-todos');
        return saved ? JSON.parse(saved) : [];
    }

    saveTodos() {
        localStorage.setItem('jetson-todos', JSON.stringify(this.todos));
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (text === '') return;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        input.value = '';
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const todoList = document.getElementById('todoList');
        const todoCount = document.getElementById('todoCount');

        if (!todoList) return;

        const filteredTodos = this.getFilteredTodos();
        const activeTodos = this.todos.filter(t => !t.completed).length;

        // Update count
        if (todoCount) {
            todoCount.textContent = `${activeTodos} ${activeTodos === 1 ? 'task' : 'tasks'} remaining`;
        }

        // Render todos
        if (filteredTodos.length === 0) {
            todoList.innerHTML = '<li class="empty-state">No tasks to show</li>';
            return;
        }

        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="todoApp.toggleTodo(${todo.id})"
                >
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="todo-delete" onclick="todoApp.deleteTodo(${todo.id})">Delete</button>
            </li>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Create global instance
const todoApp = new TodoApp();

// Initialize when TODO window is opened
const originalOpenWindow = typeof openWindow !== 'undefined' ? openWindow : null;

// Watch for when the TODO window template is inserted into the DOM
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.classList && node.classList.contains('dynamic-window')) {
                const title = node.querySelector('.window-title');
                if (title && title.textContent.toLowerCase() === 'todo') {
                    setTimeout(() => todoApp.init(), 100);
                }
            }
        });
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});
