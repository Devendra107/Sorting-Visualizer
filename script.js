const arrayContainer = document.getElementById('array-container');
const sortButton = document.getElementById('sort-button');
const generateButton = document.getElementById('generate-button');
const stopButton = document.getElementById('stop-button');
const arraySizeInput = document.getElementById('array-size');
const arraySizeValue = document.getElementById('array-size-value');
const speedSelect = document.getElementById('speed');
const algorithmSelect = document.getElementById('algorithm');
const manualArrayInput = document.getElementById('manual-array-input');
const manualArrayButton = document.getElementById('manual-array-button');
const timeComplexityText = document.getElementById('time-complexity');
const spaceComplexityText = document.getElementById('space-complexity');

let array = [];
let delay = 100;
let sortingStopped = false;

const complexities = {
  bubbleSort: {
    bestTime: 'O(n)',
    worstTime: 'O(n^2)',
    space: 'O(1)',
  },
  selectionSort: {
    bestTime: 'O(n^2)',
    worstTime: 'O(n^2)',
    space: 'O(1)',
  },
  insertionSort: {
    bestTime: 'O(n)',
    worstTime: 'O(n^2)',
    space: 'O(1)',
  },
  mergeSort: {
    bestTime: 'O(n log n)',
    worstTime: 'O(n log n)',
    space: 'O(n)',
  },
  quickSort: {
    bestTime: 'O(n log n)',
    worstTime: 'O(n^2)',
    space: 'O(log n)',
  },
};

function generateArray(size) {
  array = [];
  arrayContainer.innerHTML = '';
  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 100) + 1;
    array.push(value);
    const bar = document.createElement('div');
    bar.style.height = `${value * 3}px`;
    bar.classList.add('bar');
    arrayContainer.appendChild(bar);
  }
}

function setManualArray() {
  const userInput = manualArrayInput.value;
  if (userInput) {
    array = userInput.split(',').map(Number);
    arrayContainer.innerHTML = '';
    for (let i = 0; i < array.length; i++) {
      const value = array[i];
      const bar = document.createElement('div');
      bar.style.height = `${value * 3}px`;
      bar.classList.add('bar');
      arrayContainer.appendChild(bar);
    }
  }
}

async function bubbleSort() {
  const bars = document.getElementsByClassName('bar');
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (sortingStopped) return;
      
      bars[j].classList.add('comparing');
      bars[j + 1].classList.add('comparing');

      if (array[j] > array[j + 1]) {
        // Swap the values
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;

        // Swap the heights
        bars[j].style.height = `${array[j] * 3}px`;
        bars[j + 1].style.height = `${array[j + 1] * 3}px`;
      }

      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, delay)
      );

      bars[j].classList.remove('comparing');
      bars[j + 1].classList.remove('comparing');
    }
    bars[array.length - i - 1].classList.add('sorted');
  }
  bars[0].classList.add('sorted');
}

async function selectionSort() {
  const bars = document.getElementsByClassName('bar');
  for (let i = 0; i < array.length; i++) {
    if (sortingStopped) return;
    
    let minIndex = i;
    bars[minIndex].classList.add('comparing');
    for (let j = i + 1; j < array.length; j++) {
      bars[j].classList.add('comparing');
      if (array[j] < array[minIndex]) {
        bars[minIndex].classList.remove('comparing');
        minIndex = j;
        bars[minIndex].classList.add('comparing');
      }
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, delay)
      );
      bars[j].classList.remove('comparing');
    }
    if (minIndex !== i) {
      // Swap the values
      let temp = array[i];
      array[i] = array[minIndex];
      array[minIndex] = temp;

      // Swap the heights
      bars[i].style.height = `${array[i] * 3}px`;
      bars[minIndex].style.height = `${array[minIndex] * 3}px`;
    }
    bars[minIndex].classList.remove('comparing');
    bars[i].classList.add('sorted');
  }
}

async function insertionSort() {
  const bars = document.getElementsByClassName('bar');
  for (let i = 1; i < array.length; i++) {
    if (sortingStopped) return;
    
    let key = array[i];
    let j = i - 1;
    bars[i].classList.add('comparing');
    while (j >= 0 && array[j] > key) {
      bars[j].classList.add('comparing');
      array[j + 1] = array[j];
      bars[j + 1].style.height = `${array[j] * 3}px`;
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, delay)
      );
      bars[j].classList.remove('comparing');
      j = j - 1;
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${key * 3}px`;
    bars[i].classList.remove('comparing');
  }
  for (let i = 0; i < array.length; i++) {
    bars[i].classList.add('sorted');
  }
}

async function mergeSort() {
  const bars = document.getElementsByClassName('bar');
  await mergeSortHelper(array, 0, array.length - 1, bars);
  for (let i = 0; i < array.length; i++) {
    if (sortingStopped) return;
    
    bars[i].classList.add('sorted');
  }
}

async function mergeSortHelper(arr, left, right, bars) {
  if (sortingStopped) return;
  
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSortHelper(arr, left, mid, bars);
  await mergeSortHelper(arr, mid + 1, right, bars);
  await merge(arr, left, mid, right, bars);
}

async function merge(arr, left, mid, right, bars) {
  if (sortingStopped) return;
  
  const n1 = mid - left + 1;
  const n2 = right - mid;
  const L = new Array(n1);
  const R = new Array(n2);
  for (let i = 0; i < n1; i++) {
    L[i] = arr[left + i];
  }
  for (let j = 0; j < n2; j++) {
    R[j] = arr[mid + 1 + j];
  }
  let i = 0, j = 0, k = left;
  while (i < n1 && j < n2) {
    bars[left + i].classList.add('comparing');
    bars[mid + 1 + j].classList.add('comparing');
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      bars[k].style.height = `${L[i] * 3}px`;
      i++;
    } else {
      arr[k] = R[j];
      bars[k].style.height = `${R[j] * 3}px`;
      j++;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    bars[left + i - 1].classList.remove('comparing');
    bars[mid + 1 + j - 1].classList.remove('comparing');
    k++;
  }
  while (i < n1) {
    arr[k] = L[i];
    bars[k].style.height = `${L[i] * 3}px`;
    i++;
    k++;
  }
  while (j < n2) {
    arr[k] = R[j];
    bars[k].style.height = `${R[j] * 3}px`;
    j++;
    k++;
  }
}

async function quickSort() {
  const bars = document.getElementsByClassName('bar');
  await quickSortHelper(array, 0, array.length - 1, bars);
  for (let i = 0; i < array.length; i++) {
    if (sortingStopped) return;
    
    bars[i].classList.add('sorted');
  }
}

async function quickSortHelper(arr, low, high, bars) {
  if (sortingStopped) return;
  
  if (low < high) {
    const pi = await partition(arr, low, high, bars);
    await quickSortHelper(arr, low, pi - 1, bars);
    await quickSortHelper(arr, pi + 1, high, bars);
  }
}

async function partition(arr, low, high, bars) {
  if (sortingStopped) return;
  
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (sortingStopped) return;
    
    bars[j].classList.add('comparing');
    if (arr[j] < pivot) {
      i++;
      await swap(arr, i, j, bars);
    }
    bars[j].classList.remove('comparing');
  }
  await swap(arr, i + 1, high, bars);
  return i + 1;
}

async function swap(arr, idx1, idx2, bars) {
  if (sortingStopped) return;
  
  let temp = arr[idx1];
  arr[idx1] = arr[idx2];
  arr[idx2] = temp;
  bars[idx1].style.height = `${arr[idx1] * 3}px`;
  bars[idx2].style.height = `${arr[idx2] * 3}px`;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

function updateComplexity() {
  const algorithm = algorithmSelect.value;
  timeComplexityText.textContent = `Best Time Complexity: ${complexities[algorithm].bestTime}, Worst Time Complexity: ${complexities[algorithm].worstTime}`;
  spaceComplexityText.textContent = `Space Complexity: ${complexities[algorithm].space}`;
}

function stopSorting() {
  sortingStopped = true;
}

function resetSorting() {
  sortingStopped = false;
}

arraySizeInput.addEventListener('input', (event) => {
  arraySizeValue.textContent = event.target.value;
});

generateButton.addEventListener('click', () => {
  resetSorting();
  generateArray(arraySizeInput.value);
});

sortButton.addEventListener('click', () => {
  resetSorting();
  const algorithm = algorithmSelect.value;
  if (algorithm === 'bubbleSort') {
    bubbleSort();
  } else if (algorithm === 'selectionSort') {
    selectionSort();
  } else if (algorithm === 'insertionSort') {
    insertionSort();
  } else if (algorithm === 'mergeSort') {
    mergeSort();
  } else if (algorithm === 'quickSort') {
    quickSort();
  }
});

stopButton.addEventListener('click', () => {
  stopSorting();
});

algorithmSelect.addEventListener('change', updateComplexity);

speedSelect.addEventListener('change', (event) => {
  delay = parseInt(event.target.value);
});

manualArrayButton.addEventListener('click', () => {
  resetSorting();
  setManualArray();
});

generateArray(arraySizeInput.value);
updateComplexity();
