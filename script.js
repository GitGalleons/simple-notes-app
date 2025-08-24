$(document).ready(function() {
    // Initialize Toast
    const toast = new bootstrap.Toast(document.getElementById('toastNotification'));
    
    // Display current date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $('#currentDate').text(now.toLocaleDateString('en-US', options));
    
    // Load saved notes from localStorage
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentNoteId = null;
    renderNoteList();
    
    // New Note button
    $('#newNoteBtn').click(function() {
        currentNoteId = null;
        $('#noteTitle').val('');
        $('#noteContent').val('');
        showNotification('New note ready for editing!');
    });
    
    // Save Note button
    $('#saveNoteBtn').click(function() {
        const title = $('#noteTitle').val().trim();
        const content = $('#noteContent').val().trim();
        
        if (title || content) {
            const noteEntry = {
                id: currentNoteId || Date.now().toString(),
                title: title,
                content: content,
                date: now.toISOString()
            };
            
            // Check if note already exists
            const noteIndex = notes.findIndex(note => note.id === noteEntry.id);
            
            if (noteIndex !== -1) {
                notes[noteIndex] = noteEntry;
            } else {
                notes.unshift(noteEntry);
            }
            
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNoteList();
            currentNoteId = noteEntry.id;
            
            showNotification('Note saved successfully!');
        } else {
            showNotification('Note title or content cannot be empty!', 'danger');
        }
    });
    
    // Load note for editing
    $(document).on('click', '.note-item', function() {
        const noteId = $(this).data('note-id');
        const note = notes.find(n => n.id === noteId);
        
        if (note) {
            currentNoteId = note.id;
            $('#noteTitle').val(note.title);
            $('#noteContent').val(note.content);
        }
    });
    
    // Delete note
    $(document).on('click', '.delete-note', function(e) {
        e.stopPropagation();
        const noteId = $(this).closest('.note-item').data('note-id');
        notes = notes.filter(note => note.id !== noteId);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNoteList();
        
        if (currentNoteId === noteId) {
            currentNoteId = null;
            $('#noteTitle').val('');
            $('#noteContent').val('');
        }
        
        showNotification('Note deleted successfully!', 'warning');
    });
    
    // Search and filter
    $('#searchInput').on('input', function() {
        renderNoteList();
    });
    
    // Render note list
    function renderNoteList() {
        const searchTerm = $('#searchInput').val().toLowerCase();
        $('#noteList').empty();
        
        const filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            note.content.toLowerCase().includes(searchTerm)
        );
        
        if (filteredNotes.length === 0) {
            $('#noteList').append(`
                <div class="text-center text-muted py-3">
                    No notes found
                </div>
            `);
            return;
        }
        
        filteredNotes.forEach(note => {
            const noteDate = new Date(note.date);
            const dateStr = noteDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const preview = note.content.substring(0, 50) + (note.content.length > 50 ? '...' : '');
            
            $('#noteList').append(`
                <div class="list-group-item note-item fade-in" data-note-id="${note.id}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${note.title || 'Untitled'}</strong><br>
                            <small>${preview}</small><br>
                            <small class="text-muted">${dateStr}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger delete-note">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `);
        });
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        $('.toast-body').text(message);
        $('.toast-header').removeClass('bg-success bg-danger bg-warning').addClass(`bg-${type}`);
        toast.show();
        setTimeout(() => {
            $('.toast-header').removeClass(`bg-${type}`).addClass('bg-success');
        }, 3000);
    }
});