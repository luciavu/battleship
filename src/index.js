import './css/styles.css';
import { addOptionFocus, addNavigationEventListeners } from './utils/dom.js';
document.addEventListener('DOMContentLoaded', () => {
  addOptionFocus();
  addNavigationEventListeners();
});
