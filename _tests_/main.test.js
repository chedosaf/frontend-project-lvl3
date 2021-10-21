import {
  screen,
} from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import path from 'path';
import fs from 'fs';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock';
import init from '../src/init.js';
import hexletData from '../_fixtures_/hexlet-data';
import ru from '../src/locales/ru';

// выполнится перед каждым тест-кейсом
const index = path.join(__dirname, '..', 'index.html'); // путь
const initHtml = fs.readFileSync(index, 'utf-8');

fetchMock.get('https://hexlet-allorigins.herokuapp.com/get?url=https%3A%2F%2Fru.hexlet.io%2Flessons.rss', hexletData);
// fetchMock.get('https://hexlet-allorigins.herokuapp.com/get?url=https%3A%2F%2Fru.hexlet.io%2Flessons.rss', hexletData, { overwriteRoutes: false });
fetchMock.get('https://hexlet-allorigins.herokuapp.com/get?url=https%3A%2F%2Fgoogle.com', { gg: '<rg>' });
fetchMock.get('https://hexlet-allorigins.herokuapp.com/get?url=https%3A%2F%2Fyandex.ru', 404);

beforeEach(async () => {
  document.body.innerHTML = initHtml;
  await init();
});

test('empty input submit click must throw message about empty field', async () => {
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.required)).toBeInTheDocument();
});

test('input not url feedback innerText', async () => {
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'vvv');
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.url)).toBeInTheDocument();
});

test('input valid url must seccess', async () => {
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'https://ru.hexlet.io/lessons.rss');
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.feedBack)).toBeInTheDocument();
  expect([...await screen.findAllByText(ru.translation.show)].length).toBe(11);
});

test('modal window show correctly', async () => {
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'https://ru.hexlet.io/lessons.rss');
  userEvent.click(screen.getByText('Добавить'));
  userEvent.click([...await screen.findAllByText(ru.translation.show)][0]);
  console.log(await screen.findByTestId('modal'));
  expect(await screen.findByTestId('modal')).toBeVisible();
  expect(await screen.findByText('Цель: Научиться использовать сериализацию данных')).toBeVisible();
  expect(await screen.findByTestId('modal-title')).toHaveTextContent('Jbuilder / Ruby: Полный Rails');
  expect(await screen.findByTestId('modal-footer-link')).toHaveAttribute('href', 'https://ru.hexlet.io/courses/rails-full/lessons/jbuilder/theory_unit');
});

test('modal window close show correctly', async () => {
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'https://ru.hexlet.io/lessons.rss');
  userEvent.click(screen.getByText('Добавить'));
  userEvent.click([...await screen.findAllByText(ru.translation.show)][0]);
  userEvent.click(await screen.getByText('Закрыть'));
  expect(await screen.findByTestId('modal')).not.toHaveClass('show');
});

test('input valid url without Rss must show: "Ресурс не содержит валидный RSS"', async () => {
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'https://google.com');
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.parseError)).toBeInTheDocument();
});

test('input valid url 2 times must show messege: "Фид был добавлен ранее"', async () => {
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'https://ru.hexlet.io/lessons.rss');
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.feedBack)).toBeInTheDocument();
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'https://ru.hexlet.io/lessons.rss');
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.notOneOf)).toBeInTheDocument();
});

test('must show messege: "Ошибка сети", if fetch wasn\'t ok', async () => {
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'https://yandex.ru');
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.netError)).toBeInTheDocument();
});
