# 🧩 AI Search Frontend

Це фронтенд-додаток на базі **React**, створений для взаємодії з бекендом на FastAPI.  
Проєкт реалізує інтерфейс для семантичного пошуку товарів у великій базі даних.

---

## 🔧 Використовувані бібліотеки

- [React](https://reactjs.org/)
- [MUI (Material UI)](https://mui.com/)
- [PrimeReact](https://primereact.org/)
- [Axios](https://axios-http.com/)

---

## 🚀 Швидкий старт

1. **Клонуй репозиторій**

    ```bash
    git clone https://github.com/band-it-space/ai-search-frontend.git
    cd ai-search-frontend
    ```

2. **Встанови залежності**

    ```bash
    npm install
    ```

3. **Налаштуй `.env`**

    Створи файл `.env` у корені проєкту та вкажи адресу бекенду:

    ```env
    REACT_APP_BACKEND_URL=http://localhost:8000
    ```

    > Якщо використовуєш віддалений сервер — заміни `localhost` на його публічну IP-адресу.

4. **Запусти розробницький сервер**

    ```bash
    npm start
    ```

    Додаток буде доступний у браузері за адресою:  
    [http://localhost:3000](http://localhost:3000)

---

## 📦 Білд для продакшну

Для створення production-версії додатку:

```bash
npm run build
