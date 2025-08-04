document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const historyBox = document.getElementById('history');
  const toggleHistoryBtn = document.getElementById('toggle-history');
  const buttons = document.querySelectorAll('.buttons button, .top-buttons button');

  let currentInput = '';
  let resultShown = false;

  toggleHistoryBtn.addEventListener('click', () => {
    historyBox.classList.toggle('hidden');
    toggleHistoryBtn.textContent = historyBox.classList.contains('hidden')
      ? 'Show History'
      : 'Hide History';
  });

  const addToHistory = (expression, result) => {
    const entry = document.createElement('div');
    entry.textContent = `${expression} = ${result}`;
    entry.addEventListener('click', () => {
      currentInput = result.toString();
      display.textContent = currentInput;
      resultShown = false;
    });
    historyBox.appendChild(entry);
    historyBox.scrollTop = historyBox.scrollHeight;
  };

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.textContent;

      if (button.classList.contains('backspace')) {
        currentInput = currentInput.slice(0, -1);
        display.textContent = currentInput || '0';
        return;
      }

      if (button.classList.contains('clear')) {
        currentInput = '';
        display.textContent = '0';
        historyBox.innerHTML = '';
        resultShown = false;
        return;
      }

      if (button.classList.contains('equal') || value === '=') {
        try {
          const expression = currentInput.replace(/%/g, '/100');
          if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
            throw new Error('Invalid characters');
          }
          const result = eval(expression);
          display.textContent = result;
          addToHistory(currentInput, result);
          currentInput = result.toString();
          resultShown = true;
        } catch (err) {
          display.textContent = 'Error';
          currentInput = '';
          resultShown = false;
        }
        return;
      }

      if (resultShown && ['+', '-', '*', '/'].includes(value)) {
        currentInput = currentInput + value;
        resultShown = false;
        display.textContent = currentInput;
        return;
      }

      if (resultShown) {
        currentInput = '';
        resultShown = false;
      }

      currentInput += value;
      display.textContent = currentInput;
    });
  });
});
