// Функция для получения данных пользователей
async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.status);
        }
        const data = await response.json();
        const userList = document.getElementById("user-list");
        userList.innerHTML = ''; // Очищаем список перед добавлением новых данных
        
        // data.users.forEach(user => {
        data.forEach(user => {
            const tr = document.createElement("tr");
            const tdName = document.createElement("td");
            const tdEmail = document.createElement("td");
            const tdActions = document.createElement("td");

            // Изменение: Создаем редактируемые поля
            const nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.value = user.name; // Заполняем полем имени
            nameInput.disabled = true; // Поле по умолчанию не редактируемое

            const emailInput = document.createElement("input");
            emailInput.type = "email";
            emailInput.value = user.email; // Заполняем полем email
            emailInput.disabled = true; // Поле по умолчанию не редактируемое

            tdName.appendChild(nameInput); // Добавляем поле имени в ячейку
            tdEmail.appendChild(emailInput); // Добавляем поле email в ячейку

            // Изменение: Кнопка редактирования
            const editButton = document.createElement("button");
            editButton.textContent = "Редактировать";
            editButton.onclick = () => {
                if (editButton.textContent === "Редактировать") {
                    nameInput.disabled = false; // Разрешаем редактирование имени
                    emailInput.disabled = false; // Разрешаем редактирование email
                    editButton.textContent = "Сохранить"; // Меняем текст кнопки на "Сохранить"
                } else {
                    updateUser(user.id, { name: nameInput.value, email: emailInput.value }); // Сохраняем изменения
                    editButton.textContent = "Редактировать"; // Меняем текст кнопки обратно
                }
            };

            // Изменение: Кнопка удаления
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Удалить";
            deleteButton.onclick = () => deleteUser(user.id); // Обработчик удаления

            tdActions.appendChild(editButton);
            tdActions.appendChild(deleteButton);
            
            tr.appendChild(tdName);
            tr.appendChild(tdEmail);
            tr.appendChild(tdActions); // Добавляем действия в строку
            userList.appendChild(tr); // Добавляем строку в таблицу
        });
    } catch (error) {
        displayError(error.message); // Обработка ошибок
    }
}

// Функция для редактирования пользователя
async function updateUser(id, updatedData) {
    try {
        const response = await fetch(`http://localhost:3000/users/${id}`, { // Изменение: URL для PUT-запроса
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.status);
        }

        await fetchUsers(); // Обновляем список пользователей после редактирования
    } catch (error) {
        displayError(error.message); // Обработка ошибок
    }
}

// Функция для удаления пользователя
async function deleteUser(id) {
    if (confirm("Вы уверены, что хотите удалить этого пользователя?")) { // Подтверждение удаления
        try {
            const response = await fetch(`http://localhost:3000/users/${id}`, { // Изменение: URL для DELETE-запроса
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Ошибка сети: ' + response.status);
            }

            await fetchUsers(); // Обновляем список пользователей после удаления
        } catch (error) {
            displayError(error.message); // Обработка ошибок
        }
    }
}

// Функция для отображения сообщений об ошибках
function displayError(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = message; // Показываем сообщение об ошибке на странице
    setTimeout(() => errorMessageDiv.textContent = '', 5000); // Скрываем сообщение через 5 секунд
}

// Обработчик отправки формы для добавления нового пользователя
document.getElementById('user-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    const newUser = { 
        name: document.getElementById('name').value,
        email: document.getElementById('email').value 
    };

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.status);
        }

        await fetchUsers(); // Обновляем список пользователей после добавления нового
            this.reset(); // Сбрасываем форму
        } catch (error) {
            displayError(error.message); // Обработка ошибок
        }
    });

    // Загружаем пользователей при загрузке страницы
    window.onload = fetchUsers;