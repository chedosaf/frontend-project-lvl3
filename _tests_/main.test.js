import {
  getByRole,
  screen,
} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import init from '../src/init.js';

// выполнится перед каждым тест-кейсом
beforeEach(async () => {
  await init();
});

test('empty input submit must throw error', () => {
  const closeButton = getByRole('button', { name: 'add' });

  userEvent.click(closeButton);
  expect(screen.getByLabelText('URL должен быть рабочим')).toBeInTheDocument();
});
