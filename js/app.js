{
  (function () {

    let app = {

      LOCAL_STORAGE_KEY: 'zjj-notes',

      init() {
        this.selectedTheme = null;
        this.notes = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY)) || [{"title":"Food","color":"color1","date":"2017/7/21 上午10:33:20","todos":[{"item":"egg","done":false},{"item":"tomato","done":true}]}];

        this.$el = document.querySelector('#app');

        this.$main = this.$el.querySelector('.main'); //主界面
        this.$themes = this.$el.querySelector('.themes'); //主题存放区域
        this.$theme = this.$el.querySelector('.wrap'); //各主题可选中区域
        this.$toolBar = this.$el.querySelector('#toolBar');
        this.$close = this.$el.querySelector('.close');
        this.$bin = this.$el.querySelector('.bin');
        this.$mask = this.$el.querySelector('#mask');

        this.$notes = this.$el.querySelector('.notes'); // 主题详情区域
        this.$addnote = this.$el.querySelector('.note.add'); // 添加便签

        this.$icons = this.$el.querySelectorAll('.icon'); //  是否完成
        this.$content = this.$el.querySelector('.content'); // 便签列表内容区域
        this.$contentId = document.getElementById('nodesList') // 同上 得到元素节点
        this.$subTitle = this.$el.querySelector('.sub-title'); // 该便签主题
        this.$noteitem = this.$el.querySelectorAll('.note'); //每一项

        this.$tools = this.$el.querySelector('.tools'); // 工具栏
        this.$colorRender = this.$el.querySelector('.color-render'); //颜色渲染工具
        this.$colorItem = this.$el.querySelectorAll('.colorItem'); // 各项颜色

        this.$editorTools = this.$el.querySelector('.fa.fa-pencil-square-o'); //是否显示工具
        this.$creatnote = this.$el.querySelector('.creatnote'); //创建新的便签列
        this.$save = this.$el.querySelector('.save'); //保存

        this.$el.addEventListener('click', this); //该对象作为事件监听器
      },
      handleEvent(event) {
        let target = event.target;
        switch (true) {
          case target.matches('.fa.fa-plus'): //添加主题
            this.showAddTheme();
            this.showTools();
            break;
          case target.matches('.fa.fa-reply-all'): //返回主题界面
            this.selectedTheme = null;
            this.back();
            this.renderAll();
            break;
          case target.matches('.wrap .title') || target.matches('.wrap .date'): // 点击各主题
            this.selectedTheme = target.parentElement.dataset.theme;
            this.showAddTheme();
            this.renderTodos();
            break;
          case target.matches('.fa.fa-pencil-square-o'): // 可编辑
            this.showTools();
            break;
          case target.matches('.creatnote') || target.matches('.fa.fa-plus-circle'): // 增加便签
            this.add();
            break;
          case target.matches('.icon'): //  便签项目是否完成
            this.changeIcon(target);
            break;
          case target.matches('.color-render') || target.matches('.fa-cube'): // 调用调色盘
            this.colorList();
            break;
          case target.matches('.colorItem') || target.matches('.fa.fa-circle'): // 颜色选择
            this.changeColor(target);
            break;
          case target.matches('.save'): // 确定保存
            this.save();
            this.renderTodos();
            this.hiddenTools();
            break;
          case target.matches('.fa-trash-o'): // 垃圾桶
            this.showDeletTheme(target);
            break;
          case target.matches('.item-delete'): // 确定删除
            this.deletTheme(target);
            this.renderAll();
            break;
        }
      },
      back() { // 返回主题列表
        this.$main.classList.remove('home');
        this.$notes.className = 'notes';
        this.$subTitle.value = '';
        this.$content.innerHTML = '';
      },
      showAddTheme() { //切换到todos
        this.$main.classList.add('home');
        this.$subTitle.style.display = 'block';
      },
      showDeletTheme(e) {
        let $subTheme = e.parentElement.parentElement.parentElement;
        $subTheme.classList.add('slide');
      },
      deletTheme(e) {          
        this.notes.splice(e.parentElement.dataset.theme, 1);
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.notes));
      },
      add() {
        let $node = document.createElement('div');
        $node.className = 'note';
        $node.innerHTML = '<i class="fa fa-square-o icon"></i><input class="threedot"></input>';
        this.$contentId.appendChild($node);
        $node.querySelector('input').focus();
      },
      changeIcon(e) {
        if (this.selectedTheme && e.parentElement.dataset.index) {
          let seletcNote = e.parentElement.dataset.index;
          let selectedTheme = this.notes[this.selectedTheme];
          let note = selectedTheme.todos[seletcNote]; //当前所选的条目
          note['done'] = !note.done;
          e.classList.remove('fa-check-square-o', 'fa-square-o');
          note['done'] ? e.classList.add('fa-check-square-o') : e.classList.add('fa-square-o');
        } else {
          let flag = e.classList.contains('fa-square-o') ? false : true;
          e.classList.remove('fa-check-square-o', 'fa-square-o');
          flag ? e.classList.add('fa-square-o') : e.classList.add('fa-check-square-o');
        }
      },
      colorList() { // 调色盘展示；		
        this.$tools.classList.add('expansion');
      },
      changeColor(e) { //颜色选取
        if (e.matches('.colorItem')) {
          e = e.firstChild;
        }
        this.$notes.className = 'notes';
        this.$notes.classList.add(e.dataset.color);
        this.$tools.classList.remove('expansion');
      },
      showTools() {
        this.$editorTools.style.visibility = 'hidden';
        this.$tools.style.transform = 'scale(1)';
      },
      hiddenTools() {
        this.$editorTools.style.visibility = 'visible';
        this.$tools.style.transform = 'scale(0)';
      },
      renderAll() {
        this.$themes.innerHTML = this.notes.map(function (item, i) {
          return `<div class="sub-theme wrap ${item.color}" data-theme="${i}" check="-1">
          <div class="title threedot">${item.title}</div>
          <div class="date">${item.date}</div>
          <div class="item-delete"></div>
              </div>`
        }).join('');
      },
      renderTodos() {
        if (this.notes.length == 0) {
          this.selectedTheme = null;
          this.showTools();
          this.showAddTheme();
          return;
        }
        this.hiddenTools();
        let selectedtodo = this.notes[this.selectedTheme];
        this.$subTitle.value = selectedtodo.title;
        if (selectedtodo.color) this.$notes.classList.add(selectedtodo.color);

        this.$content.innerHTML = selectedtodo['todos'].map(function (item, i) {
          return `<div class="note" data-index='${i}'><i class="fa ${item.done ? 'fa-check-square-o' : 'fa-square-o'} icon"></i><input class="threedot" value="${item.item}"></div>`;
        }).join('');
      },
      save() {
        let obj = {};
        obj.todos = [];
        _$subTitle = this.$notes.getElementsByClassName('sub-title')[0]; //HTMLCollection类型实时检测变化
        _$noteItem = this.$content.getElementsByClassName('note');
        obj.title = _$subTitle.value;        
        obj.color = this.$notes.className.replace("notes", "").replace(/\s/g, "");
        for (let $item of _$noteItem) {
          let ele = {};
          ele.item = $item.querySelector('input').value;
          if (!ele.item) { //为空则不加
            continue;
          }
          ele.done = $item.querySelector('i').classList.contains('fa-square-o') ? false : true;
          obj.todos.push(ele);
        }
        if (this.selectedTheme !== null) { //  有选择主题 则增删改。
          obj.date = this.notes[this.selectedTheme].date;
          this.notes[this.selectedTheme] = obj;
        } else { // 没有，则push到数组中
          let d = new Date();
          obj.date = d.toLocaleString();
          this.notes.push(obj);
          this.selectedTheme = this.notes.length - 1;
        }
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.notes));
      },

      //手势操作
      gesture() {
        let self = this;
        let init = function () {
          self.target = event.target;
          self.slideItem = event.target.parentElement; //被滑动的元素
          self.ind = self.slideItem.dataset.theme;
        };
        let isItem = function () {
          return event.target.matches('.title') || event.target.matches('.date');
        };
        let startHandler = function (event) {
          self.countNum = 0;
          if (isItem()) {
            init();
            self.slideItem.style.transition = "";
            self.ishold = true;
          }
          self.startX = event.touches[0].pageX;
          self.startY = event.touches[0].pageY;
          self.offsetX = 0;
          self.startTime = +new Date();

          self.islongtouch = setTimeout(function () {
            if (self.ishold) {
              self.slideItem.setAttribute("check", "1");
              self.slideItem.style.transition = "all 0.2s";
              self.slideItem.style.transform = "translateX(0)";
              self.slideItem.classList.add("waitBeDel");              
              
              multiSelectMode();
            }
          }, 500);
        }
        let moveHandler = function (event) {
          event.count = function () {
            return self.countNum++;
          }();
          self.offsetX = event.touches[0].pageX - self.startX;
          self.offsetY = event.touches[0].pageY - self.startY;
          self.angle = +Math.atan2(self.offsetY, self.offsetX) / Math.PI * 180;
          moveDirection();
          if (isItem() && self.moveDirection === "td") {
            event.preventDefault();
            self.slideItem.style.transform = `translate3d(${self.offsetX}px,0,0)`;
          }
        };
        let endHandler = function (event) {
          self.ishold = false;
          self.slideItem.style.transition = "all 0.2s";
          if (self.offsetX !== 0) {
            if (self.offsetX > -60) {
              self.slideItem.style.transform = "translateX(" + 0 + "px)";
            } else {
              self.slideItem.style.transform = "translateX(" + -80 + "px)";
            }
          }
        };

        let normalMode = function () {
          self.$toolBar.style.display = "none";
          self.$themes.removeEventListener("click", multiSelect);

          self.renderAll();
          self.$themes.addEventListener("touchstart", startHandler);
          self.$themes.addEventListener("touchmove", moveHandler);
          self.$themes.addEventListener("touchend", endHandler);
          self.$el.addEventListener('click', self);
        };

        let multiSelectMode = function () {
          self.$toolBar.style.display = "flex";
          self.$themes.removeEventListener("touchstart", startHandler);
          self.$themes.removeEventListener("touchmove", moveHandler);
          self.$themes.removeEventListener("touchend", endHandler);

          self.$el.removeEventListener('click', self); // 多选时一处其他事件
          self.$close.addEventListener("click", normalMode);
          self.$themes.addEventListener("click", multiSelect);

          self.$bin.addEventListener("click", function () {
            self.$mask.style.display = "flex";
          });
          self.$mask.addEventListener("click", bin);
        };

        let multiSelect = function () {
          if (isItem()) {
            init();
            event.check = function () {
              var ischeck = +self.slideItem.getAttribute("check") * -1;
              self.slideItem.setAttribute("check", `${ischeck}`);
            }();
            if (self.slideItem.getAttribute("check") === "1") {
              self.slideItem.classList.add("waitBeDel");
            } else if (self.slideItem.getAttribute("check") === "-1") {
              self.slideItem.classList.remove("waitBeDel");
            }
          }
        };

        let bin = function () {
          if (event.target.dataset.confirm === "true") {
            delElement();
            self.$mask.style.display = "none";
            normalMode();
          } else if (event.target.dataset.confirm === "false") {
            self.$mask.style.display = "none";
          } else if (event.target.matches("#mask")) {
            self.$mask.style.display = "none";
          }
        };

        let delElement =function () {
          self.$waitBeDel = document.querySelectorAll(".waitBeDel");
          self.$waitBeDel.forEach(function (element) {
            let i = element.dataset.theme;
            self.notes[i].waitBeDel = true;
          }, this);
          self.notes = self.notes.filter(function (element) {
            return element.waitBeDel === undefined;
          })
          localStorage.setItem(self.LOCAL_STORAGE_KEY, JSON.stringify(self.notes));
          self.renderAll();
        };

        let moveDirection = function () {
          self.ishold = false;
          if (self.countNum === 1) {
            if (self.angle > -45 && self.angle < 45 || self.angle < -135 || self.angle > 135) {
              self.moveDirection = "td";
              return; //用户横向滑动 transverse direction
            } else {
              self.moveDirection = "md";
              return; //用户纵向滑动 machine direction
            }
          }
        };
        normalMode();
      }
    };

    document.addEventListener('DOMContentLoaded', function () {
      app.init();
      app.renderAll();
      app.gesture();
    })

  })()
}
