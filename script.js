const addBtn = document.getElementById('btn-add');
const addInput = document.getElementById('input-add');
const mainList = document.getElementById('list');

function createTask(id, done, taskText){
    const task = document.createElement('div');
    task.classList.add('task');

    const left = document.createElement('div');
    left.classList.add('task__left');

    const label = document.createElement('label');
    label.classList.add('task__label')
    label.htmlFor = id;

    const checkBox = document.createElement('input');
    checkBox.classList.add('task__checkbox')
    checkBox.id = id;
    checkBox.type = 'checkbox';

    checkBox.checked = done ? true : false;

    checkBox.addEventListener('change', () => {
        checkDone(id)
    })

    const fakeCheckBox = document.createElement('div');
    fakeCheckBox.classList.add('task__fake');

    label.append(checkBox, fakeCheckBox)

    const idSpan = document.createElement('span');
    idSpan.classList.add('task__id');
    idSpan.textContent = `id: ${id}`;

    left.append(label, idSpan)

    const input = document.createElement('input');
    input.classList.add('task__input');
    input.readOnly = true;
    input.value = taskText;

    const duttons = document.createElement('div');
    duttons.classList.add('task__buttons')
    const changeBtn = document.createElement('button');
    const saveBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    changeBtn.classList.add('task__button', 'task__button--active', 'task__button--edit');
    saveBtn.classList.add('task__button', 'task__button--save');
    deleteBtn.classList.add('task__button', 'task__button--active', 'task__button--delete');
    changeBtn.textContent = 'Edit';
    saveBtn.textContent = 'Save';
    deleteBtn.textContent = 'Delete';

    changeBtn.addEventListener('click', () => {
        input.readOnly = false;
        input.focus()
        changeBtn.classList.remove('task__button--active');
        saveBtn.classList.add('task__button--active');
    })

    saveBtn.addEventListener('click', () => {
        let currentValue = input.value.trim()
        editTask(id, currentValue)
        input.readOnly = true;
        input.value = currentValue;
        saveBtn.classList.remove('task__button--active');
        changeBtn.classList.add('task__button--active');
    })

    deleteBtn.addEventListener('click', () => {
        deleteTask(id);
        renderList(getTasks());
    })

    duttons.append(changeBtn, saveBtn, deleteBtn)
    task.append(left, input, duttons)
    mainList.append(task)
}

function getTasks(){
    if (localStorage.getItem('tasks') === null) {
        localStorage.setItem('tasks', JSON.stringify([]))
    }
    return JSON.parse(localStorage.getItem('tasks'))
}

function renderList(list){
    mainList.innerHTML = '';

    if (list.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = "Hozircha sizda tasklar mavjud emas";
        mainList.append(emptyMessage)
    } else {
        for (let i of list) {
            createTask(i.id, i.done, i.text);
        }
    }
}

renderList(getTasks())

addBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const tasksList = getTasks();
    tasksList.push({'id': getId(), 'done': false, 'text': addInput.value.trim()})
    localStorage.setItem('tasks', JSON.stringify(tasksList))
    
    renderList(getTasks())

    addInput.value = '';
})

function getId(){
    let list = getTasks();
    let max = list.reduce((i, a) => i.id > a.id ? i : a, 0);

    return max === 0 ? 0 : max.id + 1;
}

function deleteTask(id){
    let list = getTasks();
    let newList = list.filter(i => i.id !== id)
    localStorage.setItem('tasks', JSON.stringify(newList))
}

function editTask(id, text){
    let list = getTasks();
    list.find(i => i.id === id).text = text;
    localStorage.setItem('tasks', JSON.stringify(list));
}

function checkDone(id){
    let list = getTasks();
    list.find(i => i.id === id).done = !list.find(i => i.id === id).done;
    localStorage.setItem('tasks', JSON.stringify(list));
}