const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: false,
    body:
      "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non."
  },
  {
    _id: "5d2ca9e29c8a94095c1288e0",
    completed: false,
    body:
      "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title:
      "Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum."
  },
  {
    _id: "5d2ca9e2e03d40b3232496aa7",
    completed: false,
    body:
      "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non."
  }
];

(function(arrOfTasks) {
  const themes = {
    light: {
      "--body-bg": "#e9e9e9",
      "--task-bg": "#fefefeee",
      "--task-color": "#000"
    },
    dark: {
      "--body-bg": "#2e2d2d",
      "--task-bg": "#151515ee",
      "--task-color": "#ffffff"
    }
  };
  let lastSelectedThem = localStorage.getItem("app_them") || "light";

  //Получить из иходного массива объкт объектов для более удобной работы.
  const objOfTask = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  // Element UI
  const listContaienr = document.querySelector(".tasks-list");
  const formAddTask = document.forms["create-task"];
  const titleItem = formAddTask.elements["title"];
  const bodyItem = formAddTask.elements["body"];
  const messageVoidArr = document.querySelector(".no-task-message");
  const formListOption = document.forms["form-list-option"];
  const btnShowAllTasks = formListOption.elements["show-all-tasks"];
  const btnShowIncomplitedTasks =
    formListOption.elements["show-incomplited-tasks"];
  const themeSelect = document.getElementById("themeSelect");

  // Events
  setTheme(lastSelectedThem);
  renderAllTasks(objOfTask);
  checkArrayForVoid(objOfTask);
  formAddTask.addEventListener("submit", createNewTask);
  listContaienr.addEventListener("click", deleteTask);
  listContaienr.addEventListener("click", completedTask);
  btnShowAllTasks.addEventListener("click", showAllTasks);
  btnShowIncomplitedTasks.addEventListener("click", showIncomlplitedTasks);
  themeSelect.addEventListener("change", onThemeSelectHeandler);

  // Создание нового элемента списка
  function createNewTaskElement(task) {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.setAttribute("data-task-id", task._id);
    if (task.completed === true) {
      li.classList.add("task-item-complited");
    }

    const h3 = document.createElement("h3");
    h3.textContent = task.title;

    const p = document.createElement("p");
    p.textContent = task.body;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn-delete-taks");
    deleteBtn.textContent = "Delete task";

    const complitedBtn = document.createElement("button");
    complitedBtn.classList.add("btn-complited-taks");
    complitedBtn.textContent = "Complited";

    li.appendChild(h3);
    li.appendChild(p);
    li.appendChild(deleteBtn);
    li.appendChild(complitedBtn);

    return li;
  }
  // Добавление задач из исходного массива
  function renderAllTasks(tasksList) {
    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach(task => {
      const li = createNewTaskElement(task);
      fragment.appendChild(li);
    });
    listContaienr.appendChild(fragment);
  }
  // Создание новой задачи
  function createNewTask(e) {
    e.preventDefault();
    const titleValue = titleItem.value;
    const bodyValue = bodyItem.value;

    if (!titleValue || !bodyValue) {
      alert("Заполните поля!");
      return;
    }

    const newTask = {
      _id: `task-${Math.random()}`,
      completed: false,
      body: bodyValue,
      title: titleValue
    };
    // Добавление в объект с задачами
    objOfTask[newTask._id] = newTask;
    listContaienr.insertAdjacentElement(
      "afterbegin",
      createNewTaskElement(newTask)
    );
    checkArrayForVoid(objOfTask);
    formAddTask.reset();
  }
  // Удаление задачи
  function deleteTask(e) {
    if (e.target.classList.contains("btn-delete-taks")) {
      const parent = e.target.closest("[data-task-id]");
      const parentId = parent.dataset.taskId;
      const isConfirmed = confirm(
        "Вы действительно хотите удалить эту задачу?"
      );
      if (!isConfirmed) return;
      parent.remove();
      delete objOfTask[parentId];
    }
    checkArrayForVoid(objOfTask);
  }

  // Проверка на пустоту массива и вывод сообщения об этом
  function checkArrayForVoid(tasksList) {
    if (Object.keys(tasksList).length === 0) {
      messageVoidArr.style.display = "block";
    } else {
      messageVoidArr.style.display = "none";
    }
  }

  // Сделать функцию завершонной
  function completedTask(e) {
    if (e.target.classList.contains("btn-complited-taks")) {
      const parent = e.target.closest("[data-task-id]");
      const parentId = parent.dataset.taskId;
      parent.classList.toggle("task-item-complited");
      if (objOfTask[parentId].completed === true) {
        objOfTask[parentId].completed = false;
      } else {
        objOfTask[parentId].completed = true;
      }
    }
  }
  // ВЫбор "фильтра для списка"
  function showAllTasks(e) {
    const allTasks = document.querySelectorAll(".task-item");
    allTasks.forEach(element => {
      element.style.display = "block";
    });
  }
  function showIncomlplitedTasks(e) {
    const complitedTasks = document.querySelectorAll(".task-item-complited");
    complitedTasks.forEach(element => {
      element.style.display = "none";
    });
  }

  //Смена цветовой темы
  function onThemeSelectHeandler(e) {
    const selectedTheme = themeSelect.value;
    const isConfirmend = confirm("Вы действительно хотите изменить тему?");
    if (!isConfirmend) {
      themeSelect.value = lastSelectedThem;
      return;
    }
    setTheme(selectedTheme);
    lastSelectedThem = selectedTheme;
    localStorage.setItem("app_them", selectedTheme);
  }
  function setTheme(name) {
    const selectedThemeObj = themes[name];
    Object.entries(selectedThemeObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
})(tasks);
