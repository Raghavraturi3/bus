 // Elements
  const openLogin = document.getElementById('openLogin');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('closeBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const loginBtn = document.getElementById('loginBtn');
  const loginForm = document.getElementById('loginForm');

  // open popup
  openLogin.addEventListener('click', () => {
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden','false');
    // Focus username for accessibility
    setTimeout(()=> document.getElementById('username').focus(), 180);
  });

  // close popup
  function closePopup(){
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden','true');
  }
  closeBtn.addEventListener('click', closePopup);
  cancelBtn.addEventListener('click', closePopup);

  // close when clicking outside card
  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) closePopup();
  });

  // basic login action (demo)
  loginBtn.addEventListener('click', () => {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    if(!u || !p){
      alert('Username aur password dono zaroori hain.');
      return;
    }
    // demo: show values (in real app: send to server)
    alert('Logging in as: ' + u);
    closePopup();
  });

  // keyboard: esc to close
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && overlay.classList.contains('show')) closePopup();
  });

  // OPTIONAL: change avatar image easily from JS:
  // document.getElementById('avatarImg').src = 'path/to/your/photo.jpg';