// eslint-disable-next-line
import {
  screen,
} from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import path from 'path';
import fs from 'fs';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import init from '../src/init.js';
import hexletData from '../__fixtures__/hexlet-data';
import ru from '../src/locales/ru';

const index = path.join(__dirname, '..', 'index.html');
const initHtml = fs.readFileSync(index, 'utf-8');
const nockForCors = nock('https://hexlet-allorigins.herokuapp.com').defaultReplyHeaders({
  'access-control-allow-origin': '*',
  'access-control-allow-credentials': 'true',
});

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
  nockForCors.get('/get?disableCache=true&url=https%3A%2F%2Fru.hexlet.io%2Flessons.rss')
    .reply(200, hexletData);
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'https://ru.hexlet.io/lessons.rss');
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.feedBack)).toBeInTheDocument();
  expect([...await screen.findAllByText(ru.translation.show)].length).toBe(11);
});

test('modal window works correctly', async () => {
  nockForCors.get('/get?disableCache=true&url=https%3A%2F%2Fru.hexlet.io%2Flessons.rss')
    .reply(200, hexletData);
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'https://ru.hexlet.io/lessons.rss');
  userEvent.click(screen.getByText('Добавить'));
  userEvent.click([...await screen.findAllByText(ru.translation.show)][0]);
  expect(await screen.findByTestId('modal')).toBeVisible();
  expect(await screen.findByText('Цель: Научиться использовать сериализацию данных')).toBeVisible();
  expect(await screen.findByTestId('modal-title')).toHaveTextContent('Jbuilder / Ruby: Полный Rails');
  expect(await screen.findByTestId('modal-footer-link')).toHaveAttribute('href', 'https://ru.hexlet.io/courses/rails-full/lessons/jbuilder/theory_unit');
  userEvent.click(await screen.getAllByText('Закрыть')[0]);
  expect(await screen.findByTestId('modal')).not.toHaveClass('show');
});

test('input valid url without Rss must show: "Ресурс не содержит валидный RSS"', async () => {
  nockForCors.get('/get?disableCache=true&url=https%3A%2F%2Fgoogle.com')
    .reply(200, { gg: '<rg>' });
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'https://google.com');
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.parseError)).toBeInTheDocument();
});

test('input valid url 2 times must show messege: "Фид был добавлен ранее"', async () => {
  nockForCors.get('/get?disableCache=true&url=https%3A%2F%2Fru.hexlet.io%2Flessons.rss')
    .reply(200, hexletData);
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'https://ru.hexlet.io/lessons.rss');
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.feedBack)).toBeInTheDocument();
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'https://ru.hexlet.io/lessons.rss');
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.notOneOf)).toBeInTheDocument();
});

test('must show messege: "Ошибка сети", if axios wasn\'t ok', async () => {
  nockForCors.get('/get?disableCache=true&url=https%3A%2F%2Fyandex.ru')
    .reply(404);
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'https://yandex.ru');
  userEvent.click(screen.getByText('Добавить'));
  expect(await screen.findByText(ru.translation.netError)).toBeInTheDocument();
});
