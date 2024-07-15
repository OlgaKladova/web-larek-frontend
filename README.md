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
    selected: boolean;
}
```

Данные пользователя

```
interface IUserData {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: number;
    items: string[];
}
```

Результат успешного заказа

```
interface IOrderResult {
    id: string;
    total: number;
}
```

Тип карточки товара, отображенной на главной странице

```
type IGalleryItem = Pick<IProduct, 'id' | 'title' | 'image' | 'price' | 'category'>;
```

Тип карточки товара в корзине

```
type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price' | 'selected'>;
```

Тип данных пользователя для модального окна "способ оплаты"

```
type TUserAddress = Pick<IUserData, 'address' | 'payment'>;
```

Тип данных пользователя для модального окна с контактными данными

```
type TUserContacts = Pick<IUserData, 'email' | 'phone'>;
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

3 Класс Component

Реализует управление DOM-элементами. `constructor(protected readonly container: HTMLElement)`

Методы:
- toggleClass(element: HTMLElement, className: string, force?: boolean) - добавляет или убирает класс элементу,
- protected setText(element: HTMLElement, value: unknown) - добавляет текстовое содержание элементу,
- setDisabled(element: HTMLElement, state: boolean) - меняет статус блокировки,
- protected setHidden(element: HTMLElement) - скрывает элемент,
- protected setVisible(element: HTMLElement) - показывает элемент,
- protected setImage(element: HTMLImageElement, src: string, alt?: string) - устанавливает изображение с alt,
- render(data?: Partial<T>): HTMLElement - возвращает корневой DOM-элемент.

### Компоненты модели данных (бизнес-логика)

1 Класс ProductModel

Класс отвечает за хранение и логику работы с данными товаров. `constructor(protected events: IEvents)`

Поля и методы класса:
- _products: IProducts[] - массив товаров,
- _selected: IProduct['selected'] - принимает значение в зависимости от того, выбран товар или нет,
- getselected(id: string): boolean - возвращает true/false в зависимотси от того, выбран конкретный продукт или нет,
- getProduct(id: string): IProduct - возвращает товар по его id,
- changeSelect(id: string): void - изменяет значение поля selected,
- clearSelectedProducts() - обнуляет массив выбпанных товаров,
- сеттеры и геттеры для сохранения и получения данных из полей класса.

2 Класс UserData

Класс отвечает за хранение данных пользователя, которые будут указаны им при оформлении заказа. 
`constructor(events: IEvents)`

Поля и методы класса:
- payment: string - выбор способа оплаты,
- address: string - адрес доставки,
- email: string - почта,
- phone: string - номер телефона,
- total: number - общая сумма заказа,
- items: string[] - список id заказанных товаров,
- events: IEvents - экземпляр класса EventEmitter для инициации событий,
- validate() - для валидации кнопки перехода к следующкему этапу,
- сеттер для сохранения данных пользователя в классе.


### Компоненты представления

1 Класс Modal 

Реализует модальное окно. Наследуется от класса Component. Содержит методы open, close для открытия и закрытия окна. Дополняет родительский метод render. Устанавливает слушатели на клик по оверлею и кнопке-крестик для закрытия окна. `constructor(container: HTMLElement, protected events: IEvents)` 

Поля и методы класса:
- _closeButton: HTMLButtonElement -  элементы кнопки с крестиком,
- _сontent: HTMLElement - контейнер для содержимого темплейт элемента,
- events: IEvents - экземпляр класса EventEmitter для инициации событий.

2 Класс Form

Наследуется от класса Component. Класс для реализации модальных окон с формами. Содержит методы для отображения ошибки при пустых полях ввода. `constructor(protected container: HTMLFormElement, protected events: IEvents)`

Поля и методы класса:
- protected formButton: HTMLButtonElement - кнопка субмита формы,
- protected formErrors: HTMLElement - элемент ошибки,
- protected formInputs: HTMLInputElement[] - массив инпутов.
- 
- clear() - очищает форму,
- protected showError(field: string, message: string) - показывает ошибку,
- protected hideError(field: string)  - убирает ошибку,
- сеттеры для настрройки валидации.

3 Класс Order 

Наследует класс Form. Реализует форму со способом оплаты. `constructor(protected container: HTMLFormElement, protected events: IEvents)`

Поля и методы:
- protected _buttons: HTMLButtonElement[] - массив кнопок для выбора способа оплаты,
- clear() - расширяет родительский метод - разблокирует кнопку выбора способа оплаты и убирает класс '.button_alt-active',
- сеттер для настройки актитвности кнопки оплаты.

4 Класс Contacts

Наследует класс Form. Реализует форму с контактами. `constructor(protected container: HTMLFormElement, protected events: IEvents)`

5 Класс Card

Отвечает за отображение карточки товара. Наследуется от класса Component. `constructor(protected container: HTMLElement, protected events: IEvents)` 

Поля и методы класса:
- protected cardId: string - идентификатор карточки,
- protected cardTitle: HTMLElement - название товара,
- protected cardPrice: HTMLElement - цена товара,
- protected cardDescription?: HTMLElement - описание товара,
- protected cardCategory?: HTMLElement - категория товара,
- protected cardImage?: HTMLImageElement - изображение товраа,
- protected cardButton?: HTMLButtonElement - кнопка на карточке товара,
- protected cardIndex?: HTMLElement - порядковый номер новара в корзине,
- render(data: Partial<IProduct>) - для заполнения элементов карточки товара, возвращает заполненную карточку,
- events: IEvents - экземпляр класса EventEmitter для инициации событий,
- deleteProduct(): void - удаление из разметки карточки товара,
- геттер id - возвращает уникальный идентификатор товара,
- cеттеры - сохраняют значения свойств в классе.

6 Класс CardFull

Наследует класс Card. Реализует отображение товрв в модальном окне. `constructor(protected container: HTMLElement, protected events: IEvents)` 
Вешает слушатель на кнопку карточки товара.

7 GalleryItem

Наследует класс Card. Реализует отображение товрв на главной странице. `constructor(protected container: HTMLElement, protected events: IEvents)` 
Вешает слушатель на саму карточку товара.

8 Класс CardCompact

Наследует класс Card. Реализует отображение товрв в корзинею `constructor(protected container: HTMLElement, protected events: IEvents)` 
Вешает слушатель на кнопку карточки товара.

9 Класс Basket

Наследуется от класса Component. Отвечает за отображение корзины. `constructor(protected container: HTMLElement, protected events: IEvents)` 
Вешает слушатель на кнопкку "Оформить".

Поля и методы:
- protected basketList: HTMLElement - элемент для вывода списка выбранных товаров,
- protected basketButton: HTMLButtonElement - кнопка для перехода к окну оплаты,
- protected basketPrice: HTMLElement - элемент для вывода общей стоимости товаров,
- сеттеры для сохранения значений в полях.

10 Класс Page

Наследуется от класса Component. Отвечает за отображение главной страницы приложения.`constructor(protected container: HTMLElement, protected events: IEvents)` Вешает слушатель на иконку корзины.

Поля и методы:
- protected _counter: HTMLElement - счетчик на иконке корзины,
- protected _gallery: HTMLElement - элемент для отображения карточек,
- protected _bascet: HTMLElement - иконка корзины,
- protected _wrapper: HTMLElement - обертка.
- сеттеры для сохранения данных.

11 Класс Success

Наследуется от класса Component. Отвечает за отображение окна с оповещением об успешной оплате. `constructor(protected container: HTMLElement, protected events: IEvents)` Вешает слушатель на кнопку.

Поля и методы:
- protected _close: HTMLElement - кнопка перехода к главной странице,
- protected _total: HTMLElement - элемент для вывода общей суммы заказа,
- сеттер для сохранения данных.

### Слой коммуникации

Класс AppApi

Наследует базовый класс Api. Предоставляет методы для взаимодействия с бэкендом. `constructor(cdn: string, baseUrl: string, options: RequestInit = {})`

Методы класса: 
- getProducts(): Promise<IProduct[]> - делает GET запрос на сервер, возвращает промис с массивом товаров,
- postData(userData: IUserData): Promise<IOrderResult> - отправляет данные пользователя на сервер.

### Взаимодействие компонентов

Код, находящийся в файле `index.ts` выполняет роль презентера, описывает взаимодействие слоя отображения и слоя данных.
Сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.\
События изменения данных:
- `products:changed` - отрисовка главной страницы.
События, возникающие при взаимодействии пользователя с интерфейсом.
- `product:open` - открытие окна с товаром,
- `select:change` - клик по кнопке внутри карточки товара, изменяющей состояние: выбран/не выбран,
- `select:changed` - изменение поля selected  в модели данных: выбрвн/не бвыбран,
- `bascet:open` - открытие корзины,
- `modal:open` - убирает прокрутку при открытом модальном окне,
- `modal:close` - при закрытии модального окна возвращает прокрутку,
- `order:open` - действия при нажатии на кнопку "оформить" в корзине, открывается модальное окно со способом оплаты,
- `pay:select` - выбор способа оплаты,
- `order:input` - ввод данных в поле формы оплаты заказа,
- `order:submit` - переход к окну контакты,
- `order:change`- активирует кнопку перехода к следующему этапу при заполнении всех полей,
- `order:error` - блокирует кнопку перехода к следующему этапу, если одно из полей не заполнено,
- `contacts:input` - ввод данных в поле формы контактов,
- `contacts:submit` - переход к окну подтверждения и отправка данных на сервер,
- `contacts:change` - активирует кнопку перехода к следующему этапу при заполнении всех полей,
- `contacts:error` - блокирует кнопку перехода к следующему этапу, если одно из полей не заполнено,
- `success:close` - закрвтие модального окна успешной оплаты при нажатии на кнопку "за новыми покупками".