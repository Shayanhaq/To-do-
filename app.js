const column = document.getElementById('todo');

const loadTasksFromLocalStorage = () => {
    const tasks = JSON.parse(localStorage.getItem(column.id)) || [];
    tasks.forEach(task => {
        const ticket = createTicket(task);
        column.insertBefore(ticket, column.querySelector('form'));
    });
    adjustColumnHeight(column);
};

const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem(column.id, JSON.stringify(tasks));
};

const addTask = (event) => {
    event.preventDefault();
    const form = event.target;
    const value = form.elements[0].value.trim(); 

    if (!value) return; 

    const tasks = JSON.parse(localStorage.getItem(column.id)) || [];
    
    if (!tasks.includes(value)) {
        const ticket = createTicket(value);
        column.insertBefore(ticket, form);
        tasks.push(value);
        saveTasksToLocalStorage(tasks);
    }

    form.reset();
};

const createTicket = (value) => {
    const ticket = document.createElement('p');
    ticket.textContent = value;
    ticket.setAttribute('draggable', 'true');

    ticket.addEventListener('dragstart', handleDragStart);
    ticket.addEventListener('dragend', handleDragEnd);

    return ticket;
};

function handleDragStart(event) {
    event.dataTransfer.setData('text', event.target.textContent);
    event.target.classList.add('dragging');
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
}

column.addEventListener('dragover', (event) => {
    event.preventDefault(); 
});

column.addEventListener('drop', (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    
    const existingTickets = Array.from(column.querySelectorAll('p')).map(ticket => ticket.textContent);
    if (!existingTickets.includes(data)) {
        const newTicket = createTicket(data);
        column.insertBefore(newTicket, column.querySelector('form'));

        const tasks = JSON.parse(localStorage.getItem(column.id)) || [];
        tasks.push(data);
        saveTasksToLocalStorage(tasks);
    }
});

const adjustColumnHeight = (column) => {
    const tickets = column.querySelectorAll('p');
    const columnHeight = (tickets.length + 1) * 30;
    column.style.minHeight = columnHeight + 'px';
};

window.addEventListener('load', loadTasksFromLocalStorage);

const form = column.querySelector('form');
form.addEventListener('submit', addTask);
