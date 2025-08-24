$(document).ready(function () {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  function renderNotes(filter = "") {
    $("#notesContainer").empty();
    notes
      .filter(n => n.text.toLowerCase().includes(filter.toLowerCase()))
      .forEach((note, index) => {
        $("#notesContainer").append(`
          <div class="col-md-4">
            <div class="note-card">
              <div class="d-flex justify-content-between align-items-center">
                <span>${note.text}</span>
                <span class="delete-btn" data-index="${index}">&times;</span>
              </div>
            </div>
          </div>
        `);
      });
  }

  // Initial render
  renderNotes();

  // Add Note
  $("#addNoteBtn").click(function () {
    const noteText = $("#noteInput").val().trim();
    if (noteText) {
      notes.push({ text: noteText });
      localStorage.setItem("notes", JSON.stringify(notes));
      $("#noteInput").val("");
      renderNotes($("#searchInput").val());
    }
  });

  // Delete Note
  $(document).on("click", ".delete-btn", function () {
    const index = $(this).data("index");
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes($("#searchInput").val());
  });

  // Search Notes
  $("#searchInput").on("input", function () {
    renderNotes($(this).val());
  });

  // Enter key to add note
  $("#noteInput").keypress(function (e) {
    if (e.which === 13) {
      $("#addNoteBtn").click();
    }
  });
});
