/* Front-only enhancement: add View/Edit/Delete inside branch rectangles */
(function enhanceBranchBoxes(){
  const boxes = document.querySelectorAll('.branch-card, .card, .card-plain, .rounded-xl, .rounded-2xl');
  boxes.forEach(box => {
    if (box.querySelector('.btn-action')) return; // already has action bar
    const bar = document.createElement('div');
    bar.className = 'flex items-center gap-2 mt-3';
    bar.innerHTML = `
      <button class="btn-action btn-view">View</button>
      <button class="btn-action btn-edit">Edit</button>
      <button class="btn-action btn-delete">Delete</button>
    `;
    box.appendChild(bar);
  });
})();
