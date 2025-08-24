// ...existing code...
$(document).ready(function () {
    const toast = new bootstrap.Toast(document.getElementById('toastNotification'));

    // helpers
    function showNotification(message, type = 'success') {
        $('.toast-body').text(message);
        $('.toast-header').removeClass('bg-success bg-danger bg-warning').addClass(`bg-${type}`);
        toast.show();
        setTimeout(() => {
            $('.toast-header').removeClass(`bg-${type}`).addClass('bg-success');
        }, 3000);
    }

    // Display current date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $('#currentDate').text(now.toLocaleDateString('en-US', options));

    // Test localStorage availability
    let storageAvailable = true;
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
    } catch (e) {
        storageAvailable = false;
        showNotification('LocalStorage is not available. Run this app from a web server.', 'danger');
    }

    // Single robust state
    let notes = [];
    let currentNoteId = null;

    function loadNotes() {
        notes = [];
        if (!storageAvailable) return;
        try {
            const raw = localStorage.getItem('notes');
            const parsed = raw ? JSON.parse(raw) : [];
            notes = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            notes = [];
            localStorage.removeItem('notes');
            showNotification('Saved notes were corrupted and have been reset.', 'warning');
        }
        // normalize
        notes = notes.map(n => ({
            id: n && n.id ? String(n.id) : Date.now().toString(),
            title: (n && typeof n.title === 'string') ? n.title : (n && n.title ? String(n.title) : ''),
            content: (n && typeof n.content === 'string') ? n.content : (n && n.content ? String(n.content) : ''),
            date: (n && n.date) ? String(n.date) : new Date().toISOString()
        }));
    }

    function saveNotes() {
        if (!storageAvailable) return;
        try {
            localStorage.setItem('notes', JSON.stringify(notes));
        } catch (e) {
            showNotification('Failed to save note: LocalStorage quota or permission issue.', 'danger');
        }
    }

    function renderNoteList() {
        const searchTerm = ($('#searchInput').val() || '').toLowerCase();
        $('#noteList').empty();

        const filteredNotes = notes.filter(note => {
            const title = (note.title || '').toLowerCase();
            const content = (note.content || '').toLowerCase();
            return title.includes(searchTerm) || content.includes(searchTerm);
        });

        if (filteredNotes.length === 0) {
            $('#noteList').append(`
                <div class="text-center text-muted py-3">No notes found</div>
            `);
            return;
        }

        filteredNotes.forEach(note => {
            const noteDate = new Date(note.date || Date.now());
            const dateStr = noteDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const contentSafe = note.content || '';
            const preview = contentSafe.substring(0, 50) + (contentSafe.length > 50 ? '...' : '');
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

    // actions
    $('#newNoteBtn').on('click', () => {
        currentNoteId = null;
        $('#noteTitle').val('');
        $('#noteContent').val('');
        showNotification('New note ready for editing!');
    });

    $('#saveNoteBtn').on('click', () => {
        if (!storageAvailable) {
            showNotification('Cannot save: LocalStorage not available!', 'danger');
            return;
        }
        const title = ($('#noteTitle').val() || '').trim();
        const content = ($('#noteContent').val() || '').trim();
        if (!title && !content) {
            showNotification('Note title or content cannot be empty!', 'danger');
            return;
        }

        const id = currentNoteId || Date.now().toString();
        const noteEntry = { id, title, content, date: new Date().toISOString() };

        const idx = notes.findIndex(n => String(n.id) === String(id));
        if (idx !== -1) notes[idx] = noteEntry;
        else notes.unshift(noteEntry);

        saveNotes();
        renderNoteList();
        currentNoteId = id;
        showNotification('Note saved successfully!');
    });

    $(document).on('click', '.note-item', function () {
        const noteId = $(this).data('note-id');
        const note = notes.find(n => String(n.id) === String(noteId));
        if (note) {
            currentNoteId = note.id;
            $('#noteTitle').val(note.title);
            $('#noteContent').val(note.content);
        }
    });

    $(document).on('click', '.delete-note', function (e) {
        e.stopPropagation();
        if (!storageAvailable) {
            showNotification('Cannot delete: LocalStorage not available!', 'danger');
            return;
        }
        const noteId = $(this).closest('.note-item').data('note-id');
        notes = notes.filter(n => String(n.id) !== String(noteId));
        saveNotes();
        renderNoteList();
        if (String(currentNoteId) === String(noteId)) {
            currentNoteId = null;
            $('#noteTitle').val('');
            $('#noteContent').val('');
        }
        showNotification('Note deleted successfully!', 'warning');
    });

    $('#searchInput').on('input', renderNoteList);

    // init
    loadNotes();
    renderNoteList();
});