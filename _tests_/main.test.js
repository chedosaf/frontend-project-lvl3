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
fetchMock.get('https://hexlet-allorigins.herokuapp.com/get?url=https%3A%2F%2Fru.hexlet.io%2Flessons.rss', hexletData, { overwriteRoutes: false });
fetchMock.get('https://google.com', { gg: '<rg>' });
// const data = {
//   ff: '200',
// };

beforeEach(async () => {
  document.body.innerHTML = initHtml;
  await init();
});

// afterEach(async () => {
//   window.location.reload();
// });

test('empty input submit click must throw message about empty fuild', async () => {
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.required)).toBeInTheDocument();
  console.log(await screen.getByTestId('feedback').textContent);
});

test('input not url feedback innerText', async () => {
  userEvent.type(screen.getByLabelText('url'), 'vvv');
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.url)).toBeInTheDocument();
});

test('input valid url must seccess', async () => {
  userEvent.type(screen.getByTestId('url'), 'https://ru.hexlet.io/lessons.rss');
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.feedBack)).toBeInTheDocument();
  expect([...await screen.findAllByText(ru.translation.show)].length).toBe(11);
});

test('modal window show correctly', async () => {
  userEvent.type(screen.getByTestId('url'), 'https://ru.hexlet.io/lessons.rss');
  userEvent.click(screen.getByText('Добавить'));
  userEvent.click([...await screen.findAllByText(ru.translation.show)][0]);
  console.log(await screen.findByTestId('modal'));
  expect(await screen.findByTestId('modal')).toBeVisible();
  expect(await screen.findByTestId('modal-body')).toHaveTextContent('Цель: Научиться использовать сериализацию данных');
  expect(await screen.findByTestId('modal-title')).toHaveTextContent('Jbuilder / Ruby: Полный Rails');
  expect(await screen.findByTestId('modal-footer-link')).toHaveAttribute('href', 'https://ru.hexlet.io/courses/rails-full/lessons/jbuilder/theory_unit');
});

test('modal window don\'t show correctly', async () => {
  userEvent.type(screen.getByTestId('url'), 'https://ru.hexlet.io/lessons.rss');
  userEvent.click(screen.getByText('Добавить'));
  userEvent.click([...await screen.findAllByText(ru.translation.show)][0]);
  userEvent.click(await screen.getByText('Закрыть'));
  expect(await screen.findByTestId('modal')).not.toHaveClass('show');
});

// test('input valid url 2 times must show messege: "Фид был добавлен ранее"', async () => {
//   userEvent.type(screen.getByTestId('url'), 'https://ru.hexlet.io/lessons.rss');
//   userEvent.click(screen.getByText('Добавить'));
//   userEvent.type(await screen.findByTestId('url'), 'https://google.com');
//   userEvent.click(await screen.getByText('Добавить'));
//   expect(await screen.findByText(ru.translation.notOneOf)).toBeInTheDocument();
// });
