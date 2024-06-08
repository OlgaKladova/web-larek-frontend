# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Модель товара

```
interface IProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number | null;
    addProduct (id: string): void;
    deleteProduct (id: string): void;
}
```

Данные пользователя

```
interface IUserData {
    payment: 'online' | 'personally';
    address: string;
    email: string;
    tel: number;
}
```

Список товаров в корзине

```
interface IBascet {
    products: Map<string, number>;
    deleteProduct: IProduct['deleteProduct'];
    summationPrice(price: number | null): number | null;
}
```

Массив карточек товаров

```
interface IProductRender {
    products: TProductRender[];
    getProduct(id: string): IProduct;
}
```

Тип карточки товара, отображенной на главной странице

```
type TProductRender = Omit<IProduct, 'description'>;
```

Тип данных пользователя для модального окна "способ оплаты"

```
type TUserAddress = Pick<IUserData, 'address' | 'payment'>;
```

Тип данных пользователя для модального окна с контактными данными

```
type TUserContacts = Pick<IUserData, 'email' | 'tel'>;
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления отвечает за отображение данных на странице,
- слой данных отвечает за хранение и изменение данных,
- презентер отвечает за связь представления и данных.

### Базовый код

1 Класс Api

Реализует отправку запросов на сервер. 

`constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).

Имеет методы:

- `get` - выполняет GET-запрос по переданному в аргументах адресу сервера и получает промис с ответом.
- `post` - выполняет POST-запрос, в аргументах принимает адрес сервера, объект с данными, которые будут преданы в JSON в теле запроса. Метод POST выполняется по умолчанию, но он может быть переопределен заданием третьего аргумента при вызове.  Возвращается промис с объектом.
- `handleResponse` - принимает промис с ответом от сервера, проверяет на наличие ошибок, возвращает промис с ответом, если запрос исполнен, в противном случае - ошибку.

2 Класс EventEmitter 

Реализует брокер событий, позволяет подписываться на события и уведомлять о наступлении события.
`constructor()` - конструктор не принимает параметры на вход.

Класс имеет методы: 

- `on` — для установки обработчика на событие,
- `off` - для снятия обработчика с события,
- `emit` - для инициации события с данными,
- `onAll` - для подписки на все события, 
- `offAll`  — для сброса всех обработчиков,
- `trigger` - возвращает функцию, генерирующую событие при вызове.

### Компоненты модели данных (бизнес-логика)

1 Класс ProductALL

Класс отвечает за хранение и логику работы с данными товаров. `constructor(events: IEvents)`

Поля и методы класса:
- _products: TProductRender[] - массив товаров,
- events: IEvents - экземпляр класса EventEmitter для инициации событий,
- getProduct(id: string): IProduct - возвращает товар по его id,
- сеттеры и геттеры для сохранения и получения данных из полей класса.

2 Класс Product 

Класс отвечает за хранение данных одного товара, добавление товара в корзину. `constructor(events: IEvents)`

Поля и методы класса:
- id: string - идентификатор товара,
- title: string -название товара,
- description: string - описание товара,
- category: string - категория товара,
- image: string картинка товара,
- price: number | null цена товара,
- events: IEvents - экземпляр класса EventEmitter для инициации событий,
- addProduct (id: string): void- добавление товара в корзину,

3 Класс Bascet

Класс отвечает за хранение выбранных товаров и удаление товаров из корзины. `constructor(events: IEvents)`

Поля и методы класса:
- _products: Map<string, number> - массив выбранных товаров,
- events: IEvents - экземпляр класса EventEmitter для инициации событий,
- deleteProduct: IProduct['deleteProduct'] - удаление товара из корзины.

4 Класс UserData

Класс отвечает за хранение данных пользователя, которые будут указаны им при оформлении заказа. 
`constructor(events: IEvents)`

Поля и методы класса:
- payment: 'online' | 'personally' - выбор способа оплаты,
- address: string - адрес доставки,
- email: string - почта,
- tel: number - номер телефона,
- events: IEvents - экземпляр класса EventEmitter для инициации событий.


### Компоненты представления

1 Класс Modal 

Реализует модальное окно. Содержит методы open, close для открытия и закрытия окна. Устанавливает слушатели на клик по оверлею и кнопке-крестик для закрытия окна. `constructor(modal: HTMLElement)` 

Поля и методы класса:
- modal: HTMLElement - html-элемент модального окна,
- modalContent: HTMLElement - контейнер для содержимого темплейт элемента,
- events: IEvents - экземпляр класса EventEmitter для инициации событий.

2 Класс ModalForm

Расширяет класс Modal. Реализует модальные окна с формами. Содержит методы для отображения ошибки при пустых полях ввода. `constructor(form: HTMLFormElement)`

Поля и методы класса:
- form: HTMLFormElement - элемент формы,
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода в форме,
- events: IEvents - экземпляр класса EventEmitter для инициации событий,
- setInputError(input: string): void - для выведения или скрытия текста ошибки под полем ввода,
- showInputError(input: string): void - показывает ошибку,
- hideInputError(input: string): void - убирает ошибку.

3 Класс CardProduct

Отвечает за отображение карточки товара. `constructor(template:HTMLTemplateElement, events: IEvents)` 

Поля и методы класса:
- setData(CardData: IProduct): void - для заполнения элементов карточки товара,
- events: IEvents - экземпляр класса EventEmitter для инициации событий,
- deleteProduct(): void - удаление из разметки карточки товара,
- render(): HTMLElement - возвращает заполненную карточку товара с установленными слушателями,
- геттер возвращает уникальный идентификатор товара.

4 Класс Component

Реализует управление DOM-элементами. `constructor(template: HTMLTemplateElement)`

Поля и методы:
- list: HTMLElement[] - контейнер для списка карточек,
- toggleButtonState(isValid: boolean): void - изменяет активность кнопки перехода к следующему этапу,
- changeButtonText(id: string): void - для изменения текста на кнопке в зависимости наличия товара в корзине,
- summationPrice(price: number | null): number | null - вычисление итоговой суммы за все товары.

### Слой коммуникации

Класс AppApi

Принимает в конструктор экземпляр класса Api и предоставляет методы для взаимодействия с бэкендом `constructor(api: Api)`

### Взаимодействие компонентов

Код, находящийся в файле `index.ts` выполняет роль презентера, описывает взаимодействие слоя отображения и слоя данных.
Сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.\
События изменения данных:
- `products:changed` - изменение массива товаров,
- `product:selected` - изменение открываемого в модальном окне товара.

События, возникающие при взаимодействии пользователя с интерфейсом.
- `product:open` - открытие окна с товаром,
- `bascet:open` - открытие корзины,
- `bascet:click` - действия при нажатии на кнопку "оформить" в корзине,
- `payment:submit` - событие при нажатии на кнопку "далее" в модальном окне со способом оплаты,
- `contact:submit` - событие при нажатии на кнопку "оплатить" в окне с контактами,
- `success:close` - закрвтие модального окна успешной оплаты при нажатии на кнопку "за новыми покупками",
- `product:add` - добавление продукта в корзину,
- `product:delete` - удаление продукта из корзины,
- `forma:input` - пользователь вводит данные в форме.