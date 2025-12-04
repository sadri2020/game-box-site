// Interaction: open box revealing content and handle Netlify form submission
document.addEventListener('DOMContentLoaded', function(){
  const box = document.getElementById('box');
  const reveal = document.getElementById('reveal');
  const form = document.getElementById('subscribe-form');
  const msg = document.getElementById('form-msg');

  function openBox(){
    if(box.classList.contains('open')) return;
    box.classList.add('open');
    setTimeout(()=> reveal.classList.add('show'), 500);
  }

  box.addEventListener('click', openBox);
  box.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); openBox(); } });

  // graceful form submit via fetch (keeps Netlify form compatibility)
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const data = new FormData(form);
    // client-side validation
    const email = data.get('email') || '';
    if(!email.includes('@')){ msg.textContent = 'آدرس ایمیل معتبر نیست.'; return; }

    fetch('/', {
      method:'POST',
      headers:{ 'Accept':'application/json' },
      body: data
    }).then(res=>{
      if(res.ok){
        msg.textContent = 'سپاس! ایمیل شما ثبت شد.';
        form.reset();
      } else {
        // Netlify sometimes returns 200 even on HTML; fallback message
        return res.text().then(text=>{ throw new Error('پاسخ غیرمنتظره: ' + (res.status || '')) });
      }
    }).catch(err=>{
      console.error(err);
      msg.textContent = 'مشکلی پیش آمد — لطفاً دوباره تلاش کنید یا مستقیماً به ایمیل ما پیام بدهید.';
    });
  });
});
