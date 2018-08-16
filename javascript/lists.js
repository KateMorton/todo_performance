// This code is copyright Ryan Chadwick 2013
// Please do not use this code yourself
// A kitten dies every time you copy my code
// It is also poorly written and will probably do you more harm than good

function ProductivityUnit() {
    this.listmanager = new ListManager();
    this.categorymanager = new CategoryManager();
    this.current_list = -1;
    this.remote_list = -1;
    this.categorymanager.parent = this;
    this.listmanager.parent = this;
    this.default_lists = 0;
    this.unserialise = function(d) {
        var a = true;
        try {
            var b = jQuery.parseJSON(d)
        } catch (c) {
            a = false
        }
        if (a) {
            return this.unpack(b)
        } else {
            return false
        }
    };
    this.unpack = function(b) {
        var a = true;
        this.listmanager.unpack(b.listmanager);
        this.categorymanager.unpack(b.categorymanager);
        this.set_current_list(b.current_list);
        this.default_lists = b.default_lists
    };
    this.create_starting_point = function() {
        var b = new Array();
        var d = new List();
        d.name = "Today's Tasks";
        d.add_todo("Howdy. Let's get you up and running.");
        if (datamanager.supports_local_storage()) {
            d.add_todo("All changes are saved locally, automatically.")
        }
        d.add_todo("Drag this item onto another list (on the right) to transfer it.");
        d.add_todo("Drag this item up or down to re-order it.");
        d.add_todo("Drag the list, Example template, over this lists title above.");
        d.add_todo("The list, Important Info, is worth a quick look.");
        d.add_todo("All done. Tick all the items off then hit the trash icon below.");
        var e = new List();
        e.name = "Projects";
        var a = new List();
        a.name = "Things to do later";
        var f = new List();
        f.name = "Example template";
        f.add_todo("Find the Lock Ness Monster");
        f.add_todo("Eat breakfast on the moon");
        f.add_todo("Run a marathon backwards");
        f.add_todo("You may delete the list, Example template, if you like.");
        var c = new List();
        c.name = "Important Info";
        c.add_todo("Your lists are saved to local storage automatically.");
        c.add_todo("Be aware that certain actions such as clearing your cache may clear local storage.");
        c.add_todo("Syncing your lists to our server is a good way to protect yourself from this.");
        c.add_todo("We maintain backups of your sync'd lists so in the unlikely event something goes wrong we can recover your lists for you.");
        c.add_todo("Now you've read this you may delete this list.");
        b.push(d);
        b.push(e);
        b.push(a);
        b.push(f);
        b.push(c);
        this.listmanager.lists = b;
        this.set_current_list(0);
        this.categorymanager.reset();
        this.default_lists = 0
    };
    this.create_starting_point_mobile = function() {
        var b = new Array();
        var d = new List();
        d.name = "Today's Tasks";
        d.add_todo("Howdy. Let's get you up and running.");
        d.add_todo("Swipe an item from the center to mark it as done or undone.");
        d.add_todo("Swipe from the edge of screen or over list title to switch lists.");
        d.add_todo("All done. Swipe all items off then tap and hold list title below.");
        var e = new List();
        e.name = "Projects";
        var a = new List();
        a.name = "Things to do later";
        var c = new List();
        c.name = "Important Info";
        c.add_todo("Your lists are saved to local storage automatically.");
        c.add_todo("Be aware that certain actions such as clearing your cache may clear local storage.");
        c.add_todo("Syncing your lists to our server is a good way to protect yourself from this.");
        c.add_todo("By syncing your lists they will also be available across all your devices.");
        c.add_todo("Create an account by visiting todolistme.net on your desktop.");
        c.add_todo("Now you've read this you may delete this list by tap and holding on list title below.");
        b.push(d);
        b.push(c);
        b.push(a);
        this.listmanager.lists = b;
        this.set_current_list(0);
        this.categorymanager.reset();
        this.default_lists = 0
    };
    this.set_current_list = function(a) {
        if (this.listmanager.lists.length - 1 < a) {
            this.current_list = this.listmanager.lists.length - 1
        } else {
            if (a < 0) {
                this.current_list = 0
            } else {
                this.current_list = a
            }
        }
        return this.current_list
    };
    this.set_remote_list = function(a) {
        this.remote_list = a;
        return a
    };
    this.add_list = function() {
        this.listmanager.add_list();
        this.categorymanager.categories[0].add_list(this.listmanager.lists.length - 1);
        return this.listmanager.lists.length - 1
    };
    this.delete_list = function(b) {
        var a = this.categorymanager.next_list_after_delete(this.current_list, b);
        this.listmanager.delete_list(b);
        this.categorymanager.adjust_lists_up(b);
        this.set_current_list(a)
    };
    this.delete_category = function(a) {
        while (this.categorymanager.categories[a].lists.length > 0) {
            this.delete_list(this.categorymanager.categories[a].lists[0])
        }
        if (this.categorymanager.remove_category(a) == -1) {
            console.log("Error removing category - not all lists deleted properly.")
        }
    };
    this.copy_list = function(a) {
        var c = this.listmanager.copy_list(a);
        var b = this.categorymanager.which_category_is_list_in(a);
        this.categorymanager.categories[b].splice_in_copy(a, c);
        return c
    };
    this.toJSON = function() {
        return " { " + this.serialise_ancilliary_data() + ', "listmanager" : ' + this.listmanager.toJSON() + ', "categorymanager" : ' + this.categorymanager.toJSON() + " } "
    };
    this.serialise_ancilliary_data = function() {
        return '"current_list" : ' + this.current_list + ' , "default_lists" : ' + this.default_lists + " "
    }
}

function ListManager() {
    this.lists = Array();
    this.parent = "";
    this.add_list = function() {
        var a = new List();
        this.lists.push(a);
        return true
    };
    this.delete_list = function(a) {
        this.lists.splice(a, 1)
    };
    this.copy_list = function(b) {
        var a = new List();
        a.name = "Copy of " + this.lists[b].name;
        for (var c = 0; c < this.lists[b].todos.length; c++) {
            a.todos.push(this.lists[b].todos[c].clone())
        }
        this.lists.push(a);
        return this.lists.length - 1
    };
    this.merge_list = function(d, c) {
        var b = $.now();
        for (var a = 0; a < this.lists[d].todos.length; a++) {
            this.lists[c].todos.push(this.lists[d].todos[a].clone());
            this.lists[c].todos[this.lists[c].todos.length - 1].dateadded = $.now();
            this.lists[c].todos[this.lists[c].todos.length - 1].datecompleted = $.now()
        }
        return a
    };
    this.move_item = function(a, c, b) {
        this.lists[b].todos.push(this.lists[a].todos[c]);
        this.lists[a].remove_todo(c)
    };
    this.check_all_tomorrows = function() {
        var b = 0;
        for (var a = 0; a < this.lists.length; a++) {
            b += this.lists[a].check_tomorrows()
        }
        return b
    };
    this.unpack = function(c) {
        this.lists = new Array();
        for (var b = 0; b < c.lists.length; b++) {
            var a = new List();
            a.unpack(c.lists[b]);
            this.lists.push(a)
        }
        return true
    };
    this.toJSON = function() {
        var a = '{ "lists" : [ ';
        for (var b = 0; b < this.lists.length; b++) {
            a += this.lists[b].toJSON() + ", "
        }
        a = a.replace(/, $/, " ");
        a += " ] }";
        return a
    }
}

function List() {
    this.name = "New List";
    this.todos = new Array();
    this.template = 0;
    this.divider = 0;
    this.sortorder = 0;
    this.listid = -1;
    this.set_name = function(a) {
        this.name = escape(a)
    };
    this.get_name = function() {
        return this.name
    };
    this.get_name_safe = function() {
        return escape(this.name)
    };
    this.add_todo = function(b) {
        var a = new Date();
        todo = new Todo();
        todo.set_name(b);
        todo.dateadded = a.getTime();
        this.todos.push(todo)
    };
    this.remove_todo = function(a) {
        this.todos.splice(a, 1)
    };
    this.how_many_todo = function() {
        var b = 0;
        var a = 0;
        var c = $.now();
        while (b < this.todos.length) {
            if (this.todos[b].done == 0 && this.todos[b].tomorrow < c) {
                a++
            }
            b++
        }
        return a
    };
    this.how_many_done = function() {
        var b = 0;
        var a = 0;
        var c = $.now();
        while (b < this.todos.length) {
            if (this.todos[b].done == 1 && this.todos[b].tomorrow < c) {
                a++
            }
            b++
        }
        return a
    };
    this.how_many_tomorrows = function() {
        var a = 0;
        var d = $.now();
        var c = $.now() + (60 * 60 * 24 * 1000);
        for (var b = 0; b < this.todos.length; b++) {
            if (this.todos[b].tomorrow > d && this.todos[b].tomorrow < c) {
                a++
            }
        }
        return a
    };
    this.how_many_laters = function() {
        var a = 0;
        var c = $.now() + (60 * 60 * 24 * 1000);
        for (var b = 0; b < this.todos.length; b++) {
            if (this.todos[b].tomorrow > c) {
                a++
            }
        }
        return a
    };
    this.check_tomorrows = function() {
        var c = $.now();
        var b = 0;
        var a = 0;
        while (a < this.todos.length) {
            if (this.todos[a].tomorrow < c && this.todos[a].tomorrow != 0) {
                this.untomorrow_item(a);
                b += 1
            }
            a++
        }
        return b
    };
    this.get_not_done_ids = function() {
        var c = new Array();
        var a = 0;
        var b = $.now();
        while (a < this.todos.length) {
            if (this.todos[a].done == 0 && this.todos[a].tomorrow < b) {
                c.push(a)
            }
            a++
        }
        return c
    };
    this.get_done_ids = function() {
        var c = new Array();
        var a = 0;
        var b = $.now();
        while (a < this.todos.length) {
            if (this.todos[a].done == 1 && this.todos[a].tomorrow < b) {
                c.push(a)
            }
            a++
        }
        return c
    };
    this.get_tomorrow_ids = function() {
        var a = this.create_todo_sort_array("later");
        var d = a.sort(sort_item_tomorrow_time);
        var c = new Array();
        for (var b = 0; b < d.length; b++) {
            c.push(d[b].id)
        }
        return c
    };
    this.get_todos_in_order = function() {
        var d = this.create_todo_sort_array("todo");
        var c = new Array();
        if (this.sortorder == 1) {
            c = d.sort(sort_item_alphabetical)
        } else {
            if (this.sortorder == 2) {
                c = d.sort(sort_item_random)
            } else {
                if (this.sortorder == 3) {
                    c = d
                } else {
                    c = d
                }
            }
        }
        var b = new Array();
        for (var a = 0; a < c.length; a++) {
            b.push(c[a].id)
        }
        return b
    };
    this.get_done_ids_in_completed_order = function() {
        var c = this.clone_todos();
        c.sort(sort_item_completed_time);
        var a = new Array();
        for (var b = 0; b < c.length; b++) {
            if (c[b].done > 0) {
                a.push(c[b].id)
            }
        }
        return a
    };
    this.create_todo_sort_array = function(b) {
        var c = this.create_todo_list_clone();
        for (var a = 0; a < c.length; a++) {
            if (b == "done" && c[a].done != 1) {
                c.splice(a, 1);
                a--
            } else {
                if (b == "todo" && (c[a].done == 1 || c[a].tomorrow > $.now())) {
                    c.splice(a, 1);
                    a--
                } else {
                    if (b == "later" && c[a].tomorrow < $.now()) {
                        c.splice(a, 1);
                        a--
                    }
                }
            }
        }
        return c
    };
    this.create_todo_list_clone = function() {
        var b = new Array();
        this.set_todo_ids();
        for (var a = 0; a < this.todos.length; a++) {
            b.push(this.todos[a].clone())
        }
        return b
    };
    this.order_todos = function(f, b) {
        var c = this.todos;
        var e = new Array();
        var d = new Array();
        var a = 0;
        while (a < f.length) {
            c[f[a]].reset_tomorrow();
            c[f[a]].set_unfinished();
            e.push(c[f[a]]);
            d.push(f[a]);
            a++
        }
        var a = 0;
        while (a < b.length) {
            c[b[a]].reset_tomorrow();
            if (c[b[a]].done != 1) {
                c[b[a]].set_finished()
            }
            e.push(c[b[a]]);
            d.push(b[a]);
            a++
        }
        for (a = 0; a < c.length; a++) {
            if (d.indexOf(a) == -1) {
                e.push(c[a])
            }
        }
        this.todos = e
    };
    this.tomorrow_item = function(a) {
        this.todos[a].set_tomorrow()
    };
    this.untomorrow_item = function(a) {
        this.todos[a].reset_tomorrow()
    };
    this.purge_done_items = function() {
        var b = 0;
        for (var a = 0; a < this.todos.length; a++) {
            if (this.todos[a].done == 1) {
                this.todos.splice(a, 1);
                b++;
                a--
            }
        }
        return b
    };
    this.progress = function() {
        var a = this.how_many_todo();
        var b = this.how_many_done();
        if (a + b == 0) {
            return 0
        }
        return Math.round((b / (a + b)) * 100)
    };
    this.render_todos = function(a) {
        var f = "";
        var c = 0;
        var b = 0;
        var e = false;
        var d = this.get_todos_in_order();
        f = '<ul id="mytodos">';
        while (c < d.length) {
            if (this.sortorder == 3 && c >= 3) {
                e = true
            }
            if (this.todos[d[c]].done == 0) {
                f += this.todos[d[c]].render(d[c], a, e);
                b = 1
            }
            c++
        }
        f = f + "</ul>";
        if (b == 0) {
            f += '<p class="notodos">No items.  Why not add one below.</p>'
        }
        return f
    };
    this.render_done_todos = function(a) {
        var e = "";
        var c = 0;
        var b = 0;
        var d = this.get_done_ids_in_completed_order().reverse();
        e = '<ul id="mydonetodos">';
        while (c < d.length) {
            if (this.todos[d[c]].done == 1) {
                e += this.todos[d[c]].render(d[c], a);
                b = 1
            }
            c++
        }
        e += "</ul>";
        if (b == 0) {
            e += '<p class="notodos">No done items.</p>'
        }
        return e
    };
    this.render_tomorrows = function(a) {
        var e = "";
        var c = 0;
        var b = 0;
        var d = this.get_tomorrow_ids();
        e = '<ul id="mytomorrowtodos">';
        while (c < d.length) {
            e += this.todos[d[c]].render_tomorrow(d[c], a);
            b = 1;
            c++
        }
        e += "</ul>";
        if (b == 0) {
            e += '<p class="notodos">Drag todos onto the Tomorrow title above to put them off till tomorrow.</p>'
        }
        return e
    };
    this.render_tomorrows_and_laters = function(a) {
        var d = "";
        var c = this.get_tomorrow_ids();
        var e = 0;
        if (c.length == 0) {
            d += '<p class="notodos">Drag todos onto the Tomorrow or Later titles above to put them off till later.</p>'
        } else {
            for (var b = 0; b < c.length; b++) {
                if (e != this.todos[c[b]].tomorrow) {
                    if (b > 0) {
                        d += "</ul>"
                    }
                    d += "<h4>" + format_date_short(this.todos[c[b]].tomorrow + 1000) + "</h4><ul>";
                    e = this.todos[c[b]].tomorrow
                }
                d += this.todos[c[b]].render_tomorrow(c[b], a)
            }
            d += "</ul>"
        }
        return d
    };
    this.render_todos_print = function() {
        var b = '<ul id="mytodos">';
        for (var a = 0; a < this.todos.length; a++) {
            if (this.todos[a].done == 0) {
                b += this.todos[a].render_print()
            }
        }
        b += "</ul>";
        return b
    };
    this.render_done_todos_print = function(a) {
        var d = '<ul id="mydonetodos">';
        var c = this.get_done_ids_in_completed_order().reverse();
        for (var b = 0; b < c.length; b++) {
            if (this.todos[c[b]].done == 1) {
                d += this.todos[c[b]].render_print()
            }
        }
        d += "</ul>";
        return d
    };
    this.render_simple = function() {
        var a = "  " + decodeURIComponent(this.name) + "\n  ================\n  Todo:\n";
        a += this.render_simple_todo();
        a += "\n  -----------------\n  Done:\n";
        a += this.render_simple_done();
        a += "\n  -----------------\n  Later:\n";
        a += this.render_simple_tomorrows();
        a += "";
        return a
    };
    this.render_simple_todo = function() {
        var b = "";
        var c = this.get_todos_in_order();
        for (var a = 0; a < c.length; a++) {
            b += this.todos[c[a]].render_simple() + "\n"
        }
        return b
    };
    this.render_simple_done = function() {
        var b = "";
        var c = this.get_done_ids_in_completed_order().reverse();
        for (var a = 0; a < c.length; a++) {
            b += this.todos[c[a]].render_simple() + "\n"
        }
        return b
    };
    this.render_simple_tomorrows = function() {
        var c = "";
        var b = this.get_tomorrow_ids();
        for (var a = 0; a < b.length; a++) {
            c += this.todos[b[a]].render_simple() + "\n"
        }
        return c
    };
    this.set_todo_ids = function() {
        for (var a = 0; a < this.todos.length; a++) {
            this.todos[a].id = a
        }
    };
    this.clone_todos = function() {
        var c = new Array();
        this.set_todo_ids();
        for (var b = 0; b < this.todos.length; b++) {
            var a = this.todos[b].clone();
            c.push(a)
        }
        return c
    };
    this.unpack = function(c) {
        this.name = c.name;
        this.template = c.template;
        this.divider = c.divider;
        this.sortorder = c.sortorder;
        var b = new Todo();
        for (var a = 0; a < c.todos.length; a++) {
            b = new Todo();
            b.unpack(c.todos[a]);
            this.todos.push(b)
        }
        return true
    };
    this.toJSON = function() {
        var a = '{ "name" : "' + this.name + '", "template" : ' + this.template + ', "divider" : ' + this.divider + ', "sortorder" : ' + this.sortorder + ' , "todos" : [ ';
        for (var b = 0; b < this.todos.length; b++) {
            a += this.todos[b].toJSON() + ", "
        }
        a = a.replace(/, $/, " ");
        a += " ] } ";
        return a
    }
}

function Todo() {
    this.id = 0;
    this.name = "";
    this.done = 0;
    this.color = 0;
    this.dateadded = 0;
    this.datecompleted = 0;
    this.tomorrow = 0;
    this.set_name = function(a) {
        this.name = escape(a)
    };
    this.get_name = function() {
        return this.name
    };
    this.set_finished = function() {
        var a = new Date();
        this.done = 1;
        this.datecompleted = a.getTime();
        this.tomorrow = 0
    };
    this.set_unfinished = function() {
        this.done = 0
    };
    this.set_tomorrow = function() {
        var a = new Date();
        a.setDate(a.getDate() + 1);
        var b = new Array();
        b[0] = a.getFullYear();
        b[1] = a.getMonth();
        b[2] = a.getDate();
        this.set_later(b)
    };
    this.set_later = function(b) {
        var a = new Date(b[0], b[1], b[2] - 1, 23, 59, 59);
        this.tomorrow = a.getTime();
        this.done = 0
    };
    this.reset_tomorrow = function() {
        this.tomorrow = 0
    };
    this.render = function(b, a, g) {
        var c = "";
        if (g == true) {
            c = "itemdimmed"
        }
        var f = '<li id="todo_' + b + '" class="moveabletodo ' + c + '" data-todoid="' + b + '" data-listid="' + a + '" >';
        var e = "";
        var d = "finish_todo";
        var h = "Added " + format_date(this.dateadded);
        if (this.done == 1) {
            e = "checked";
            d = "unfinish_todo";
            h = "Completed " + format_date(this.datecompleted) + " | " + h
        }
        f += "<input type=checkbox " + e + ' onclick="' + d + "(" + a + ", " + b + ')" >';
        f += '<span id="mytodo_' + b + '" title="' + h + '">' + unescape(this.name) + "</span>";
        f += '<img src="./images/delete.gif" title="Delete Item" class="delete" >';
        f += "</li>";
        return f
    };
    this.render_tomorrow = function(b, a, g) {
        var c = "";
        if (g == true) {
            c = "itemdimmed"
        }
        var f = '<li id="todo_' + b + '" class="moveabletodo ' + c + '" data-todoid="' + b + '" data-listid="' + a + '" data-todotype="later">';
        var e = "";
        var d = "finish_todo";
        var h = "Added " + format_date(this.dateadded);
        if (this.done == 1) {
            e = "checked";
            d = "unfinish_todo";
            h = "Completed " + format_date(this.datecompleted) + " | " + h
        }
        f += "<input type=checkbox " + e + ' onclick="' + d + "(" + a + ", " + b + ')" >';
        f += '<span id="mytodo_' + b + '" ondblclick="modify_todo_name(' + b + ');" title="' + h + '">' + unescape(this.name) + "</span>";
        f += '<img src="./images/delete.gif" title="Delete Item" onclick="delete_todo(' + a + ", " + b + ');"  class="delete" >';
        f += "</li>";
        return f
    };
    this.render_print = function() {
        var a = "<li>";
        var b = '<img src="./images/check.png">';
        if (this.done == 1) {
            b = "<input type=checkbox checked >"
        }
        a += b + unescape(this.name);
        a += "</li>";
        return a
    };
    this.render_print_blank = function() {
        var a = '<li class="blanktodo">';
        var b = '<img src="./images/check.png">';
        a += b + "<div>&nbsp</div>";
        a += "</li>";
        return a
    };
    this.render_simple = function() {
        var a = "[ ]";
        if (this.done == 1) {
            a = "[x]"
        }
        if (this.tomorrow > 0) {
            a = "[-]"
        }
        return "   " + a + "  " + decodeURIComponent(this.name)
    };
    this.clone = function() {
        var a = new Todo();
        a.id = this.id;
        a.name = this.name;
        a.done = this.done;
        a.color = this.color;
        a.dateadded = this.dateadded;
        a.datecompleted = this.datecompleted;
        a.tomorrow = this.tomorrow;
        return a
    };
    this.unpack = function(a) {
        this.name = a.name;
        this.done = a.done;
        this.color = a.color;
        this.dateadded = a.dateadded;
        this.tomorrow = a.tomorrow;
        this.datecompleted = a.datecompleted;
        return true
    };
    this.toJSON = function() {
        var a = '{ "name" : "' + this.name + '" , "done" : ' + this.done + ' , "color" : "' + this.color + '" , "dateadded" : ' + this.dateadded + ' , "tomorrow" : ' + this.tomorrow + ' , "datecompleted" : ' + this.datecompleted + " } ";
        return a
    }
}

function CategoryManager() {
    this.categories = new Array();
    this.parent = "";
    this.add_category = function(b) {
        var a = new Category();
        a.rename(b);
        a.parent = this;
        this.categories.push(a);
        return (this.categories.length - 1)
    };
    this.remove_category = function(a) {
        if (this.categories[a].lists.length > 0) {
            return -1
        }
        this.categories.splice(a, 1);
        return 1
    };
    this.which_category_is_list_in = function(a) {
        var b = 0;
        while (b < this.categories.length) {
            if (this.categories[b].contains_list(a)) {
                return b
            }
            b++
        }
        return false
    };
    this.reorder_categories = function(c) {
        var b = new Array();
        b.push(this.categories[0]);
        for (var a = 1; a < this.categories.length; a++) {
            b.push(this.categories[c[a - 1]])
        }
        this.categories = b
    };
    this.move_list_to_category = function(c, b, a) {
        if (undoagent) {
            undoagent.add_state("Move list")
        }
        this.categories[b].remove_list(a);
        this.categories[c].add_list(a)
    };
    this.clean = function() {
        var a = new Array(this.parent.listmanager.lists.length);
        var b = 0;
        while (b < this.categories.length) {
            list_counter = 0;
            while (list_counter < this.categories[b].lists.length) {
                if (this.categories[b].lists[list_counter] >= productivityunit.listmanager.lists.length) {
                    this.categories[b].remove_list(this.categories[b].lists[list_counter])
                } else {
                    if (a[this.categories[b].lists[list_counter]] == 1) {
                        this.categories[b].remove_list(this.categories[b].lists[list_counter])
                    } else {
                        a[this.categories[b].lists[list_counter]] = 1
                    }
                    list_counter++
                }
            }
            b++
        }
        list_counter = 0;
        while (list_counter < a.length) {
            if (a[list_counter] != 1) {
                this.categories[0].add_list(list_counter)
            }
            list_counter++
        }
        return true
    };
    this.next_list_after_delete = function(a, d) {
        var f = this.which_category_is_list_in(a);
        var c = this.which_category_is_list_in(d);
        if (f != c) {
            return a
        } else {
            if (a == d) {
                if (this.categories[f].lists.length == 1) {
                    return this.categories[0].lists[0]
                } else {
                    return this.categories[f].next_list(a)
                }
            } else {
                var e = this.categories[f].lists.indexOf(a);
                var b = this.categories[c].lists.indexOf(d);
                if (e < b) {
                    return a
                } else {
                    return a - 1
                }
            }
        }
    };
    this.render = function() {
        var a = '<ul class="categories">' + this.categories[0].render(0) + '</ul><ul class="categories" id="mycategories">';
        for (var b = 1; b < this.categories.length; b++) {
            a += this.categories[b].render(b)
        }
        a += "</ul>";
        $("#lists").html(a)
    };
    this.render_remote = function() {
        var b = "<form><select id=\"listdropdown\" onchange=\"set_current_list_remote(document.getElementById('listdropdown').options[document.getElementById('listdropdown').selectedIndex].value);\"><option>Select List</option>";
        var a = 0;
        while (a < this.categories.length) {
            b += this.categories[a].render_remote(a);
            a++
        }
        b += "</select></form>";
        return b
    };
    this.render_simple = function(c) {
        var b = "";
        for (var a = 0; a < this.categories.length; a++) {
            b += this.categories[a].render_simple(c) + ""
        }
        return b
    };
    this.adjust_lists_up = function(b) {
        for (var a = 0; a < this.categories.length; a++) {
            this.categories[a].adjust_lists_up(b)
        }
    };
    this.reset = function() {
        this.categories = new Array();
        var a = new Category();
        a.parent = this;
        a.name = "general";
        this.categories.push(a);
        this.clean()
    };
    this.unpack = function(c) {
        this.categories = new Array();
        var b = new Category();
        for (var a = 0; a < c.categories.length; a++) {
            b = new Category();
            b.parent = this;
            b.unpack(c.categories[a]);
            this.categories.push(b)
        }
        return true
    };
    this.toJSON = function() {
        var a = '{ "categories" : [ ';
        for (var b = 0; b < this.categories.length; b++) {
            a += this.categories[b].toJSON() + ", "
        }
        a = a.replace(/, $/, " ");
        a += " ] }";
        return a
    }
}

function Category() {
    this.name = "";
    this.lists = new Array();
    this.collapsed = 0;
    this.parent = "";
    this.rename = function(a) {
        this.name = trim(a);
        return true
    };
    this.render = function(e) {
        var b = "";
        if (e == 0) {
            b = '<li id="mycategory_' + e + '"><ul class="categorycontainer" id="container_' + e + '">'
        } else {
            var d = "showcategory";
            var h = "Hide category";
            var g = "category_up.png";
            if (this.collapsed == 1) {
                d = "hidecategory";
                h = "Show category";
                g = "category_down.png"
            }
            var f = '<img src="./images/delete.gif" title="Delete category" onclick="delete_category(' + e + ');" class="delete" />';
            if (this.lists.length == this.parent.parent.listmanager.lists.length) {
                f = ""
            }
            b = '<li id="mycategory_' + e + '" class="' + d + '" ><h5 id="category_' + e + '" class="categorytitle"  ondblclick="modify_category_name(' + e + ');"><span id="categoryheading_' + e + '">' + this.name + '</span><img src="./images/' + g + '" title="' + h + '" onclick="show_hide_category(' + e + ');" class="categorycollapsed" id="categoryarrow_' + e + '" />' + f + '</h5><ul class="categorycontainer" id="container_' + e + '" >'
        }
        for (var c = 0; c < this.lists.length; c++) {
            listid = this.lists[c];
            current_class = "";
            if (this.parent.parent.current_list == listid) {
                current_class = "currentlist"
            }
            var a = this.parent.parent.listmanager.lists;
            b += '<li id="mylist_' + listid + '" class="normallist ' + current_class + '" data-listid="' + listid + '" ><span id="list_' + listid + '" class="listname" >' + unescape(a[listid].name) + ' </span> <span class="info">(' + a[listid].how_many_todo() + "/" + a[listid].how_many_done() + ')</span><img src="./images/copy.png" title="Copy List" class="copylist" /><img src="./images/delete.gif" title="Delete list" class="delete" /></li>'
        }
        b += "</ul></li>";
        return b
    };
    this.render_remote = function(d) {
        var b = "";
        if (this.collapsed == 1) {
            b = '<optgroup id="mycategory_' + d + '" class="divider collapsed" label="' + unescape(this.name) + '"> </optgroup>'
        } else {
            b = '<optgroup id="mycategory_' + d + '" class="divider" label="' + unescape(this.name) + '"> </optgroup>';
            var c = 0;
            var a = this.parent.parent.listmanager.lists;
            while (c < this.lists.length) {
                current_class = "";
                if (this.parent.parent.remote_list == this.lists[c]) {
                    current_class = " currentlist "
                }
                b += '<option id="mylist_' + this.lists[c] + '" class="normallist ' + current_class + '" value="' + this.lists[c] + '">' + unescape(a[this.lists[c]].name) + ' <span class="info">(' + a[this.lists[c]].how_many_todo() + "/" + a[this.lists[c]].how_many_done() + ")</span></option>";
                c++
            }
        }
        return b
    };
    this.render_simple = function(d) {
        var c = decodeURIComponent(this.name) + "\n=====================\n\n";
        var b = this.parent.parent.listmanager.lists;
        for (var a = 0; a < this.lists.length; a++) {
            c += b[this.lists[a]].render_simple() + "\n\n"
        }
        c += "\n\n";
        return c
    };
    this.add_list = function(a) {
        this.lists.push(a)
    };
    this.splice_in_copy = function(c, a) {
        var b = this.lists.indexOf(c);
        this.lists.splice(b + 1, 0, a)
    };
    this.remove_list = function(a) {
        var b = this.lists.indexOf(a);
        if (b == -1) {
            return false
        }
        this.lists.splice(b, 1);
        return true
    };
    this.contains_list = function(a) {
        if (this.lists.indexOf(parseInt(a)) == -1) {
            return false
        } else {
            return true
        }
    };
    this.listnumber = function(a) {
        return this.lists.indexOf(parseInt(a))
    };
    this.adjust_lists_up = function(c) {
        var a = 0;
        var b = -1;
        while (a < this.lists.length) {
            if (this.lists[a] == c) {
                var b = a
            }
            if (this.lists[a] > c) {
                this.lists[a]--
            }
            a++
        }
        if (b >= 0) {
            this.lists.splice(b, 1)
        }
    };
    this.next_list = function(b) {
        if (!this.contains_list(b)) {
            return -1
        }
        var a = this.lists.indexOf(b);
        a++;
        if (a > this.lists.length - 1) {
            a = 0
        }
        return this.lists[a]
    };
    this.previous_list = function(b) {
        if (!this.contains_list(b)) {
            return -1
        }
        var a = this.lists.indexOf(b);
        a--;
        if (a < 0) {
            a = this.lists.length - 1
        }
        return this.lists[a]
    };
    this.unpack = function(a) {
        this.name = a.name;
        this.collapsed = a.collapsed;
        this.lists = a.lists;
        return true
    };
    this.toJSON = function() {
        var a = '{ "name" : "' + this.name + '", "collapsed" : ' + this.collapsed + ' , "lists" : [ ' + this.lists.join(" , ") + " ] } ";
        return a
    }
}
var syncchecker;
var syncwatcher;
var syncmessage = 0;

function SyncManager() {
    this.wait = 3;
    this.countdown = -1;
    this.state = -1;
    this.active = 0;
    this.logged_in_as = "";
    this.salt = "";
    this.userid = -1;
    this.lastsync = 0;
    this.changed_since_last = -1;
    this.sync_up = function() {
        data = datamanager.serialise_productivityunit(productivityunit);
        $.ajax("./sync.php", {
            type: "POST",
            data: {
                userid: this.userid,
                salt: this.salt,
                data: data,
                action: "syncup"
            }
        }).error(function(a, b) {
            alert("Well this is embarassing. Something went wrong when trying to sync lists up to the server. " + b)
        }).success(function(a) {
            var b = a.split("_");
            if (b[0] == "true") {
                syncmanager.lastsync = b[1];
                syncmanager.changed_since_last = 0;
                datamanager.save_everything(syncmanager, productivityunit);
                syncmanager.wait = 3;
                sync_indication("synced");
                sync_set_syncd_time()
            } else {
                if (b[0] == "incorrect") {
                    sync_login_outdated()
                } else {
                    alert("Something went wrong on the server when syncing lists up to the server. " + b[0]);
                    sync_indication("notsynced")
                }
            }
        })
    };
    this.sync_down = function() {
        $("body").trigger("lockscreen", ["Loading from server"]);
        $.ajax("./sync.php", {
            type: "POST",
            data: {
                userid: this.userid,
                salt: this.salt,
                action: "syncdown"
            }
        }).error(function(a, b) {
            alert("Well this is embarassing. Something went wrong when trying to sync lists down from the server. " + b)
        }).success(function(a) {
            if (a == "incorrect") {
                sync_login_outdated();
                return
            }
            if (a == "false") {
                sync_loginerror();
                return
            }
            if (undoagent) {
                undoagent.add_state("Sync Down")
            }
            returndata = a.split("_--_");
            syncmanager.lastsync = returndata[0];
            if (returndata[1].match(/^%/)) {
                var c = convert_from_old_format(returndata[1]);
                var b = datamanager.objectify(c)
            } else {
                var b = datamanager.objectify(returndata[1])
            }
            if (b) {
                productivityunit.unpack(b);
                render_everything();
                datamanager.save_everything(syncmanager, productivityunit);
                sync_indication("synced");
                sync_set_syncd_time()
            } else {
                alert("Data sync'd down from the server is corrupted.")
            }
            $("body").trigger("unlockscreen")
        })
    };
    this.login = function() {
        var b = document.getElementById("syncname").value;
        var a = document.getElementById("syncpassword").value;
        if (b == "") {
            alert("Username is empty");
            document.getElementById("syncname").focus();
            return
        }
        if (a == "") {
            alert("Password is empty");
            document.getElementById("syncpassword").focus();
            return
        }
        $.ajax("./sync.php", {
            type: "POST",
            data: {
                username: b,
                password: a,
                action: "login"
            }
        }).error(function(c, d) {
            alert("Well this is embarassing. Something went wrong when trying to log in. " + d)
        }).success(function(c) {
            elements = c.split("_");
            if (elements[0] == "true") {
                syncmanager.userid = elements[1];
                syncmanager.salt = elements[2];
                syncmanager.logged_in_as = document.getElementById("syncname").value;
                syncmanager.active = 1;
                syncmanager.login_check();
                datamanager.save_syncmanager(syncmanager);
                sync_set_login_panel("hide");
                syncmanager.setup_periodicals()
            } else {
                if (elements[0] == "disabled") {
                    syncmanager.logged_in_as = b;
                    sync_loginnotactive()
                } else {
                    sync_login_failed()
                }
            }
        })
    };
    this.logout = function() {
        this.userid = 0;
        this.salt = "";
        this.active = 0;
        this.lastsync = 0;
        datamanager.save_syncmanager(syncmanager);
        sync_set_login_panel("hide");
        sync_indication("blue")
    };
    this.logout_soft = function() {
        this.userid = 0;
        this.salt = "";
        this.active = 0;
        datamanager.save_syncmanager(syncmanager);
        sync_set_login_panel("hide");
        sync_indication("blue")
    };
    this.check = function() {
        $("body").trigger("lockscreen", ["Checking Lists"]);
        if (this.salt.length != 10) {
            return 0
        }
        $.ajax("./sync.php", {
            type: "POST",
            data: {
                userid: this.userid,
                salt: this.salt,
                timestamp: this.lastsync,
                action: "check"
            }
        }).error(function(a, b) {
            alert("Well this is embarassing. Something went wrong when trying to see if lists need to be brought down from the server. " + b)
        }).success(function(a) {
            $("body").trigger("unlockscreen");
            if (a == "nouser") {
                sync_nouser();
                return 0
            } else {
                if (a == "false") {
                    sync_loginerror();
                    return 0
                } else {
                    if (a == "notactive") {
                        sync_loginnotactive();
                        return 0
                    } else {
                        if (a == "syncup") {
                            syncmanager.sync_up();
                            return 1
                        } else {
                            if (a == "syncdown") {
                                syncmanager.sync_down();
                                return 1
                            } else {
                                if (productivityunit.default_lists == 0) {
                                    syncmanager.sync_down()
                                } else {
                                    sync_indication("synced");
                                    sync_set_syncd_time()
                                }
                                return 1
                            }
                        }
                    }
                }
            }
        })
    };
    this.login_check = function() {
        if (this.salt.length != 10) {
            return 0
        }
        $.ajax("./sync.php", {
            type: "POST",
            data: {
                userid: this.userid,
                salt: this.salt,
                timestamp: this.lastsync,
                action: "check"
            }
        }).error(function(a, b) {
            alert("Well this is embarassing. Something went wrong when trying to see if lists need to be brought down from the server. " + b)
        }).success(function(a) {
            if (a == "nouser") {
                sync_nouser();
                return 0
            } else {
                if (a == "false") {
                    sync_loginerror();
                    return 0
                } else {
                    if (a == "notactive") {
                        sync_loginnotactive();
                        return 0
                    } else {
                        if (a == "syncup") {
                            syncmanager.sync_up();
                            return 1
                        } else {
                            if (a == "syncdown") {
                                syncmanager.ask_up_or_down();
                                return 1
                            } else {
                                if (productivityunit.default_lists == 0) {
                                    syncmanager.sync_down()
                                } else {
                                    sync_indication("synced");
                                    sync_set_syncd_time()
                                }
                                return 1
                            }
                        }
                    }
                }
            }
        })
    };
    this.queue_change = function() {
        if (this.active == 1) {
            this.countdown = this.wait;
            sync_indication("waiting")
        }
    };
    this.setup_periodicals = function() {
        if (this.active == 1) {
            this.setup_queue_watcher();
            this.setup_sync_checker()
        }
    };
    this.setup_queue_watcher = function() {
        syncwatcher = setInterval(function() {
            if (syncmanager.countdown == 0 && syncmanager.active == 1) {
                syncmanager.sync_up();
                syncmanager.countdown = -1
            }
            if (syncmanager.countdown > 0) {
                syncmanager.countdown--
            }
        }, 1000)
    };
    this.setup_sync_checker = function() {
        syncchecker = setInterval(function() {
            if (syncmanager.active == 1) {
                $.ajax("./sync.php", {
                    type: "POST",
                    data: {
                        userid: syncmanager.userid,
                        salt: syncmanager.salt,
                        timestamp: syncmanager.lastsync,
                        action: "check"
                    }
                }).error(function(a, b) {
                    alert("Well this is embarassing. Something went wrong while checking lists on the server. " + b)
                }).success(function(a) {
                    if (a == "syncup") {
                        syncmanager.sync_up()
                    } else {
                        if (a == "syncdown") {
                            if (syncmessage == 0) {
                                syncmessage = 1;
                                var b = confirm("A newer version of your lists exists on the server. Would you like to download it?");
                                if (b) {
                                    syncmanager.sync_down()
                                }
                                syncmessage = 0
                            }
                        } else {
                            if (a == "incorrect") {
                                sync_login_outdated()
                            }
                        }
                    }
                })
            }
        }, 300000)
    };
    this.ask_up_or_down = function() {
        $("body").trigger("sync_askupordown");
        $("#messagebox").html("<p>The system believes the lists on the server are newer than those you have locally on your device.</p>  <p>What would you like to do?</p>");
        $("#messagebox").dialog({
            title: "Sync Lists",
            buttons: {
                "Overwrite lists on my device with those I have on the server": function() {
                    syncmanager.sync_down();
                    $("#messagebox").dialog("close")
                },
                "Upload lists on my device to the server": function() {
                    syncmanager.sync_up();
                    $("#messagebox").dialog("close")
                },
                "Log me out, Leave all lists as is.": function() {
                    syncmanager.logout();
                    $("#messagebox").dialog("close")
                }
            },
            modal: true,
            height: 420,
            width: 600,
            dialogClass: "no-close"
        });
        $("#messagebox").dialog("open")
    };
    this.unpack = function(a) {
        this.state = a.state;
        this.active = a.active;
        this.logged_in_as = a.logged_in_as;
        this.salt = a.salt;
        this.userid = a.userid;
        this.lastsync = a.lastsync;
        this.changed_since_last = a.changed_since_last;
        return true
    };
    this.toJSON = function() {
        return '{ "state" : ' + this.state + ' , "active" : ' + this.active + ' , "logged_in_as" : "' + this.logged_in_as + '" , "salt" : "' + this.salt + '" , "userid" : ' + this.userid + ' , "lastsync" : ' + this.lastsync + ' , "changed_since_last" : ' + this.changed_since_last + " }"
    }
};
