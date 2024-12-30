// Title screen DOM

// Adjust arrow visibility based on option hovered (indicate player choice)
export const addOptionFocus = () => {
  const options = document.getElementsByClassName('option-text');
  Array.from(options).forEach((option) => {
    option.addEventListener('mouseover', () => {
      const arrow = document.getElementById(`${option.id}arrow`);
      if (arrow) arrow.style.visibility = 'visible';
    });

    option.addEventListener('mouseout', () => {
      const arrow = document.getElementById(`${option.id}arrow`);
      if (arrow) arrow.style.visibility = 'hidden';
    });
  });
};

// Rules DOM

// Boat Setup DOM

// Game DOM
