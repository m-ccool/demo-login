// /public/app.js

const els = {
    btnLogin: document.getElementById('btnLogin'),
    btnProfile: document.getElementById('btnProfile'),
    loginForm: document.getElementById('loginForm'),
    loginError: document.getElementById('loginError'),

    pfName: document.getElementById('pfName'),
    pfAge: document.getElementById('pfAge'),
    pfProgressBar: document.getElementById('pfProgressBar'),
    pfTasks: document.getElementById('pfTasks'),
    btnLogout: document.getElementById('btnLogout')
};


async function fetchJSON(url, opts = {}) {
    const res = await fetch(url, {
        headers: {'content-type': 'application/json'},
        credentials: 'include',
        ...opts
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.error|| 'Request failed'), {status: res.status, data});
    return data;
    }

    // buttons log in/out toggle

    async function checkAuthAndToggle() {
    try {
        const me = await fetchJSON('/api/me.php');
        // Logged in
        els.btnLogin.classlist.add = 'd-none';
        els.btnProfile.classList.remove('d-none');
        window.__user__= me.user;
    } catch (err) {
        // Logged out
        els.btnProfile.classList.add('d-none');
        els.btnLogin.classList.remove('d-none');
        window.__user__ = null;
    }
}


async function handleLogin(e){
    e.preventDefault();
    els.loginError.classList.add('d-none');

    const formData = new FormData(els.loginForm);
    const payload = {
        username: formData.get('username'),
        password: formData.get('password'),
    };

    try {
        await fetchJSON('/api/login.php', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        // close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal && modal.hide();

        // redirect home (blank) and refresh ui state
        history.pushState({}, '', '/');
        await checkAuthAndToggle();
    } catch (err) {
        els.loginError.textContent = err.data?.error || 'Login failed';
        els.loginError.classList.remove('d-none');
    }
} 


function populateProfile(user) {
    if (!user) return;
    els.pfName.textContent = user.name ?? '-';
    els.pfAge.textContent = (user.age ?? '-').toString();

    const pct = Number(user.progress ?? 0);
    els.pfProgressBar.style.width = `${pct}%`;
    els.pfProgressBar.setAttribute('aria-valuenow', String(pct));
    els.pfProgressBar.textContent = `${pct}%`;

    els.pfTasks.textContent = (user.tasks ?? 0).toString;
}


async function openProfileModal() {
    try {
        const me = await fetchJSON('/api/me.php');
        populateProfile(me.user);
    } catch {
        // if session expired, rediredt to login state
        await checkAuthAndToggle();
    }
}

async function handleLogout() {
    try {  
        await fetchJSON('/api/logout.php');
    } catch {}
    await checkAuthAndToggle();
    }

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthAndToggle();
    els.loginForm.addEventListener('submit', handleLogin);
    els.btnProfile.addEventListener('click', openProfileModal);
    els.btnLogout.addEventListener('click', handleLogout);
});
