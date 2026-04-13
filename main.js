  

let currentUser = null;
    let isLoginMode = true;
    let bookmarks = new Set();

    const trades = [
        { id: 1, user: "Sarah_Designs", avatar: "https://i.pravatar.cc/150?u=sarah", time: "2h ago", title: "Graphic Design for Web Dev", desc: "Professional logos for React help.", img: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=600" },
        { id: 2, user: "Chef_Marie", avatar: "https://i.pravatar.cc/150?u=mario", time: "5h ago", title: "Authentic Italian Cooking", desc: "Learn pasta making! Seeking photography tips.", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600" },
        { id: 3, user: "Yoga_Jenny", avatar: "https://i.pravatar.cc/150?u=jenny", time: "1d ago", title: "Yoga for Guitar Lessons", desc: "Private yoga sessions. I want to learn acoustic guitar.", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600" }
    ];

    function toggleAuthMode() {
        isLoginMode = !isLoginMode;
        document.getElementById('authTitle').innerText = isLoginMode ? "Sign In" : "Create Account";
        document.getElementById('authSubmit').innerText = isLoginMode ? "Login" : "Register";
        document.getElementById('authToggle').innerText = isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Login";
    }

    function handleAuth() {
        const u = document.getElementById('userInput').value;
        if (!u) { alert("Please enter a username"); return; }
        currentUser = { name: u };
        document.getElementById('headerAuthBtn').innerText = `Hi, ${u}`;
        document.getElementById('menuTitle').innerText = `Welcome, ${u}!`;
        document.getElementById('logoutLink').style.display = "block";
        closeAuth();
        renderFeed();
    }

    function openAuth() { document.getElementById('auth-overlay').classList.add('active'); }
    function closeAuth() { document.getElementById('auth-overlay').classList.remove('active'); }

    function toggleMenu(id) {
        closeMenus();
        document.getElementById(id).classList.add('active');
        document.getElementById('main-overlay').classList.add('active');
    }

    function closeMenus() {
        document.querySelectorAll('.sidebar').forEach(m => m.classList.remove('active'));
        document.getElementById('main-overlay').classList.remove('active');
    }

    function viewBookmarks() {
        if (!currentUser) { openAuth(); return; }
        closeMenus();
        if (bookmarks.size === 0) { alert("No bookmarks yet!"); return; }
        renderFeed(true);
    }

    function toggleBookmark(id) {
        if (!currentUser) { openAuth(); return; }
        bookmarks.has(id) ? bookmarks.delete(id) : bookmarks.add(id);
        document.getElementById('bookmarkCount').innerText = bookmarks.size;
        renderFeed();
    }

    async function loadPosts() {
    const response = await fetch("https://dummyjson.com/posts");
    const data = await response.json();

    displayPosts(data.posts);
}
     
function displayPosts(posts) {
    const container = document.getElementById("feed");

    posts.forEach(post => {
        container.innerHTML += `
            <div class="card">
                <div class="card-header">${post.title}</div>
                <div class="card-body">${post.body}</div>
            </div>
        `;
    });
}






    function renderFeed(showOnlyBookmarks = false) {
        const container = document.getElementById('feed-container');
        const list = showOnlyBookmarks ? trades.filter(t => bookmarks.has(t.id)) : trades;
        document.getElementById('feedTitle').innerText = showOnlyBookmarks ? "Your Bookmarks" : "Community Feed";
        document.getElementById('backToFeed').style.display = showOnlyBookmarks ? "block" : "none";

        container.innerHTML = list.map(t => {
            const isBookmarked = bookmarks.has(t.id);
            return `
                <div class="trade-card">
                    <div class="card-header"><img src="${t.avatar}" class="avatar"> <span class="username">${t.user}</span></div>
                    <img src="${t.img}" class="card-image">
                    <div class="card-body">
                        <h4>${t.title}</h4><p>${t.desc}</p>
                        <div class="btn-group">
                            <button class="action-btn msg-btn">Accept</button>
                            <button class="action-btn quiz-btn">🎓 Study</button>
                            <button class="action-btn bookmark-button ${isBookmarked ? 'active' : ''}" onclick="toggleBookmark(${t.id})">
                                ${isBookmarked ? '🌟 Saved' : '⭐ Bookmark'}
                            </button>
                        </div>
                    </div>
                </div>`;
        }).join('');
    }

    function processLogout() {
        currentUser = null;
        bookmarks.clear();
        document.getElementById('headerAuthBtn').innerText = "Login / Sign Up";
        document.getElementById('logoutLink').style.display = "none";
        document.getElementById('bookmarkCount').innerText = "0";
        renderFeed();
        closeMenus();
    }

    renderFeed();
