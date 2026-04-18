const fs = require('fs');

const images = [
  { src: 'C:\\Users\\prabh\\.gemini\\antigravity\\brain\\1cb6a15a-7b0b-42b8-aee4-1d9af52e6226\\mission_dog_circle_1776546017355.png', dest: 'c:\\Users\\prabh\\OneDrive\\Desktop\\QuitePaw\\quietpaws\\frontend\\src\\assets\\mission-dog.png' },
  { src: 'C:\\Users\\prabh\\.gemini\\antigravity\\brain\\1cb6a15a-7b0b-42b8-aee4-1d9af52e6226\\mission_cat_circle_1776546033523.png', dest: 'c:\\Users\\prabh\\OneDrive\\Desktop\\QuitePaw\\quietpaws\\frontend\\src\\assets\\mission-cat.png' }
];

images.forEach(img => {
  fs.copyFileSync(img.src, img.dest);
  console.log(`Copied ${img.src} to ${img.dest}`);
});
