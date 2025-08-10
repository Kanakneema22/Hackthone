   (function(){
      const lsKey = 'focus_todo_v1';
      const input = document.getElementById('task-name');
      const addBtn = document.getElementById('add-task');
      const list = document.getElementById('task-list');
      const empty = document.getElementById('empty-state');
      const stats = document.getElementById('stats');
      const filterBtns = document.querySelectorAll('.filter-btn');
      const clearCompletedBtn = document.getElementById('clear-completed');
      const clearAllBtn = document.getElementById('clear-all');

      let tasks = load();
      let activeFilter = 'all';

      function save(){ localStorage.setItem(lsKey, JSON.stringify(tasks)); render(); }
      function load(){ try{ return JSON.parse(localStorage.getItem(lsKey))||[] }catch(e){return []} }

      function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7) }

      function addTask(text){ if(!text||!text.trim()) return; tasks.unshift({id:uid(),text:text.trim(),completed:false,created:Date.now()}); save(); input.value=''; input.focus(); }

      function removeTask(id){ tasks = tasks.filter(t=>t.id!==id); save(); }
      function toggleComplete(id){ tasks = tasks.map(t=> t.id===id? {...t,completed:!t.completed}:t); save(); }
      function clearCompleted(){ tasks = tasks.filter(t=>!t.completed); save(); }
      function clearAll(){ if(!confirm('Clear ALL tasks?')) return; tasks=[]; save(); }

      function setFilter(f){ activeFilter=f; filterBtns.forEach(b=>b.classList.toggle('active', b.dataset.filter===f)); render(); }

      function render(){
        // stats
        const total = tasks.length; const left = tasks.filter(t=>!t.completed).length;
        stats.textContent = `${total} task${total!==1?'s':''} • ${left} left`;

        // filter + show
        const shown = tasks.filter(t=>{
          if(activeFilter==='all') return true;
          if(activeFilter==='active') return !t.completed;
          if(activeFilter==='completed') return t.completed;
        });

        list.innerHTML='';
        if(shown.length===0){ empty.style.display='flex'; } else { empty.style.display='none'; }

        shown.forEach(t=>{
          const li = document.createElement('li');
          li.className = 'task-card' + (t.completed? ' completed':'');
          li.setAttribute('data-id', t.id);

          // checkbox
          const cb = document.createElement('button');
          cb.className = 'checkbox' + (t.completed? ' checked':'');
          cb.setAttribute('aria-label','Toggle complete');
          cb.addEventListener('click', ()=> toggleComplete(t.id));

          const name = document.createElement('div');
          name.className = 'task-name' + (t.completed? ' completed':'');
          name.textContent = t.text;

          const meta = document.createElement('div');
          meta.className = 'task-meta';

          const del = document.createElement('button');
          del.className = 'btn btn-danger';
          del.setAttribute('aria-label','Delete task');
          del.textContent='✕';
          del.addEventListener('click', ()=>{
            // small remove animation
            li.style.transform = 'translateX(30px) scale(.98)'; li.style.opacity=0; setTimeout(()=> removeTask(t.id),180);
          });

          meta.appendChild(del);
          li.appendChild(cb);
          li.appendChild(name);
          li.appendChild(meta);

          list.appendChild(li);
        });
      }

      // events
      addBtn.addEventListener('click', ()=> addTask(input.value));
      input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ addTask(input.value) } });

      filterBtns.forEach(b=> b.addEventListener('click', ()=> setFilter(b.dataset.filter)));
      clearCompletedBtn.addEventListener('click', ()=>{ if(confirm('Remove completed tasks?')) clearCompleted(); });
      clearAllBtn.addEventListener('click', ()=> clearAll());

      // keyboard shortcut: / focuses input
      window.addEventListener('keydown', (e)=>{
        if(e.key==='/' && document.activeElement!==input){ e.preventDefault(); input.focus(); }
      });

      // initial render
      render();

      // expose for debug on devtools
      window.__todo = {addTask, removeTask, toggleComplete, clearAll, clearCompleted, tasks};
    })();