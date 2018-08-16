// This code is copyright Ryan Chadwick 2013
// Please do not use this code yourself
// A kitten dies every time you copy my code
// It is also poorly written and will probably do you more harm than good

var productivityunit = new ProductivityUnit();
var statemanager = new StateManager();
var datamanager = new DataManager();
var syncmanager = new SyncManager();
var undoagent = new UndoAgent();
if (remote == 0) {
    var syncmanager = new SyncManager()
}
var modify_category;
var modify_list;
var modify_todo;
var remote_modify_list;
var remote_modify_tody;
var motivation = new Array("Almost there!", "Almost done", "C'mon", "Going Strong", "Awesome", "Great");
var motivation_remote = new Array("Almost there!", "Almost done", "C'mon", "Going Strong", "Awesome", "Great");
var tempobject;
var temp_list_holder;
var list_sort_flag = 0;
var list_sort_object = {
    active: 0
};
var drop_flag = 0;
var tabtimer = 0;
var later_todo_id = -1;
var previous_scroll = -1;

function StateManager() {
    this.get_productivityunit = function() {
        if (remote == 0) {
            return productivityunit
        } else {
            return window.opener.productivityunit
        }
    };
    this.add_list = function() {
        if (remote == 0) {
            productivityunit.set_current_list(productivityunit.add_list());
            this.save();
            undoagent.hide_undo_icon();
            productivityunit.default_lists = 1
        } else {
            window.opener.statemanager.add_list()
        }
    };
    this.delete_list = function(a) {
        if (remote == 0) {
            undoagent.add_state("Delete List");
            productivityunit.delete_list(a);
            this.save()
        } else {
            window.opener.statemanager.deletelist(a)
        }
    };
    this.rename_list = function(a, b) {
        if (remote == 0) {
            undoagent.add_state("Rename List");
            productivityunit.listmanager.lists[a].set_name(b);
            this.save()
        } else {
            window.opener.statemanager.rename_list(a, b)
        }
    };
    this.rename_category = function(a, b) {
        if (remote == 0) {
            undoagent.add_state("Rename Category");
            productivityunit.categorymanager.categories[a].rename(b);
            this.save()
        } else {
            window.opener.statemanager.rename_category(a, b)
        }
    };
    this.copy_list = function(a) {
        if (remote == 0) {
            var b = productivityunit.copy_list(a);
            productivityunit.set_current_list(b);
            this.save();
            undoagent.hide_undo_icon()
        } else {
            window.opener.statemanager.copy_list(a)
        }
    };
    this.merge_list = function(b, a) {
        if (remote == 0) {
            undoagent.add_state("Merge Lists");
            productivityunit.listmanager.merge_list(b, a);
            this.save()
        } else {
            window.opener.statemanager.marge_list(b, a)
        }
    };
    this.add_todo = function(b, a) {
        if (remote == 0) {
            productivityunit.listmanager.lists[a].add_todo(b);
            productivityunit.default_lists = 1;
            this.save();
            undoagent.hide_undo_icon()
        } else {
            window.opener.statemanager.add_todo(b, a)
        }
    };
    this.delete_todo = function(a, b) {
        if (remote == 0) {
            undoagent.add_state("Delete item");
            productivityunit.listmanager.lists[a].todos.splice(b, 1);
            this.save()
        } else {
            window.opener.statemanager.delete_todo(a, b)
        }
    };
    this.rename_todo = function(a, c, b) {
        if (remote == 0) {
            undoagent.add_state("Rename item");
            productivityunit.listmanager.lists[a].todos[c].set_name(b);
            this.save()
        } else {
            window.opener.statemanager.rename_todo(a, c, b)
        }
    };
    this.reorder_todos = function(a, c, b) {
        if (remote == 0) {
            undoagent.add_state("Reorder items");
            productivityunit.listmanager.lists[a].order_todos(c, b);
            this.save()
        } else {
            window.opener.statemanager.reorder_todos(a, c, b)
        }
    };
    this.reorder_categories = function(a) {
        if (remote == 0) {
            undoagent.add_state("Reorder categories");
            productivityunit.categorymanager.reorder_categories(a);
            this.save()
        } else {
            window.opener.statemanager.reorder_categories(a)
        }
    };
    this.finish_todo = function(a, b) {
        if (remote == 0) {
            productivityunit.listmanager.lists[a].todos[b].set_finished();
            this.save();
            undoagent.hide_undo_icon()
        } else {
            window.opener.statemanager.finish_todo(a, b)
        }
    };
    this.unfinish_todo = function(a, b) {
        if (remote == 0) {
            productivityunit.listmanager.lists[a].todos[b].set_unfinished();
            this.save();
            undoagent.hide_undo_icon()
        } else {
            window.opener.statemanager.unfinish_todo(a, b)
        }
    };
    this.purge_done_todos = function(a) {
        if (remote == 0) {
            undoagent.add_state("Purge done items");
            productivityunit.listmanager.lists[a].purge_done_items();
            this.save()
        } else {
            window.opener.statemanager.purge_done_todos(a)
        }
    };
    this.move_todo = function(a, c, b) {
        if (remote == 0) {
            undoagent.add_state("Move item");
            productivityunit.listmanager.move_item(a, c, b);
            this.save()
        } else {
            window.opener.statemanager.purge_done_todos(listid)
        }
    };
    this.tomorrow_todo = function(a, b) {
        if (remote == 0) {
            undoagent.add_state("Tomorrow item");
            productivityunit.listmanager.lists[a].todos[b].set_tomorrow();
            this.save()
        } else {
            window.opener.statemanager.tomorrow_todo(a, b)
        }
    };
    this.untomorrow_todo = function(a, b) {
        if (remote == 0) {
            undoagent.add_state("UnTomorrow item");
            productivityunit.listmanager.lists[a].todos[b].reset_tomorrow();
            this.save()
        } else {
            window.opener.statemanager.untomorrow_todo(a, b)
        }
    };
    this.later_todo = function(a, b, c) {
        if (remote == 0) {
            undoagent.add_state("Later item");
            productivityunit.listmanager.lists[a].todos[b].set_later(c);
            this.save()
        } else {
            window.opener.statemanager.later_todo(a, b, c)
        }
    };
    this.check_all_tomorrows = function() {
        if (remote == 0) {
            if (productivityunit.listmanager.check_all_tomorrows() > 0) {
                this.save()
            }
        } else {
            window.opener.statemanager.check_all_tomorrows()
        }
    };
    this.reset_lists = function() {
        if (remote == 0) {
            undoagent.add_state("Reset lists");
            productivityunit.create_starting_point();
            this.save()
        } else {
            window.opener.statemanager.unfinish_todo(listid, todoid)
        }
    };
    this.save = function() {
        if (remote == 0) {
            datamanager.save_productivityunit(productivityunit);
            syncmanager.queue_change()
        } else {
            window.opener.statemanager.save()
        }
    }
}

function UndoAgent() {
    this.states = [];
    this.steps = 10;
    this.undotab = $("#undotab");
    this.add_state = function(a) {
        var c = new UndoState();
        c.action = a;
        c.timestamp = $.now();
        c.productivityunit = productivityunit.toJSON();
        var b = this.states.push(c);
        if (b > this.steps) {
            this.states.splice(0, (this.states.length - this.steps - 1))
        }
        document.getElementById("undotab").title = "Undo " + a;
        this.show_undo_icon()
    };
    this.retrieve_state = function() {
        var a = this.states.pop();
        productivityunit.unpack(datamanager.objectify(a.productivityunit));
        statemanager.save();
        render_everything();
        $("#undomessage").text(a.action + " undone.").removeClass().addClass("introduce");
        setTimeout(function() {
            document.getElementById("undomessage").className = "reset"
        }, 2000);
        if (this.states.length <= 0) {
            this.undotab.attr("title", "No undo recorded at the moment.");
            this.hide_undo_icon()
        } else {
            this.undotab.attr("title", "Undo " + this.states[this.states.length - 1].action)
        }
    };
    this.hide_undo_icon = function() {
        this.undotab.css("right", "-32px")
    };
    this.show_undo_icon = function() {
        this.undotab.css("right", "0px")
    }
}

function UndoState() {
    this.productivityunit = "";
    this.timestamp = "";
    this.action = ""
}

function open_remote() {
    if (!remote_window_open()) {
        remotewindow = window.open("./remote.php", "remotewindow", "status=0,toolbar=0,menubar=0,location=0,resizable=1,scrollbars=1,height=600,width=375")
    }
    remotewindow.focus()
}

function open_print_view() {
    printwindow = window.open("./print.php", "printwindow", "status=0,toolbar=0,menubar=0,location=0,resizable=1,scrollbars=1,height=800,width=800");
    printwindow.focus()
}

function add_category() {
    var a = productivityunit.categorymanager.add_category("New Category");
    productivityunit.default_lists = 1;
    statemanager.save();
    refresh_lists();
    modify_category_name(a)
}

function add_list() {
    statemanager.add_list();
    render_everything();
    modify_list_name(productivityunit.current_list)
}

function copy_category_list() {
    var a = $(this).closest(".normallist").data("listid");
    statemanager.copy_list(a);
    render_everything();
    modify_list_name(productivityunit.current_list)
}

function merge_list(a, b) {
    var c = strip_chars_from_id(b.draggable.attr("id"));
    statemanager.merge_list(c, productivityunit.current_list);
    render_everything()
}

function add_todo() {
    var a = $.trim($("#newtodo").val());
    if (a.match(/^\s*$/)) {
        alert("Did you forget to type your item?");
        $("#newtodo").focus();
        return
    }
    if (remote == 0) {
        statemanager.add_todo(a, productivityunit.current_list);
        render_everything();
        $("#todo_" + (productivityunit.listmanager.lists[productivityunit.current_list].todos.length - 1)).fadeOut(0).fadeIn(250)
    } else {
        statemanager.add_todo(a, productivityunit.remote_list);
        render_everything();
        $("#todo_" + (productivityunit.listmanager.lists[productivityunit.remote_list].todos.length - 1)).fadeOut(0).fadeIn(250)
    }
}

function finish_todo(a, b) {
    statemanager.finish_todo(a, b);
    $("#todo_" + b).hide("blind", {}, 250);
    setTimeout(render_everything, 400)
}

function unfinish_todo(a, b) {
    statemanager.unfinish_todo(a, b);
    $("#todo_" + b).hide("blind", {}, 250);
    setTimeout(render_everything, 400)
}

function modify_list_name(a) {
    modify_list = a;
    list = document.getElementById("list_" + a);
    list.onclick = null;
    list.ondblclick = null;
    in_place_editor("list_" + a, "save_list_name")
}

function edit_list_name() {
    var a = $(this).closest(".normallist").data("listid");
    modify_list_name(a)
}

function modify_category_name(a) {
    modify_category = a;
    category = document.getElementById("categoryheading_" + a);
    category.onclick = null;
    category.ondblclick = null;
    in_place_editor("categoryheading_" + a, "save_category_name")
}

function modify_todo_name() {
    modify_list = $(this).closest("li").data("listid");
    modify_todo = $(this).closest("li").data("todoid");
    in_place_editor("mytodo_" + modify_todo, "save_todo_name")
}

function tomorrow_todo(a, b) {
    drop_flag = 1;
    statemanager.tomorrow_todo(b.draggable.data("listid"), b.draggable.data("todoid"));
    render_everything()
}

function later_todo(b, d) {
    drop_flag = 1;
    list_sort_flag = 1;
    var a = d.draggable.attr("id");
    var c = $("#" + a).data("todoid");
    later_todo_id = c;
    $("#todo_" + c).hide();
    $("#laterdialog").dialog("option", "title", productivityunit.listmanager.lists[$("#" + a).data("listid")].todos[c].get_name());
    $("#laterdialog").on("dialogclose", later_todo_cancel);
    var e = $("#laterdialog").dialog("open");
    $("#choosewhen").datepicker("option", "minDate", 1);
    $("#choosewhen").datepicker("refresh");
    e.dialog("option", "position", {
        my: "left top",
        at: "right top",
        of: "#latertitle"
    })
}

function set_later_todo(d, c) {
    var b = d.split("/");
    var a = new Array();
    a[0] = parseInt(b[2]);
    a[1] = parseInt(b[0]);
    a[2] = parseInt(b[1]);
    a[1]--;
    statemanager.later_todo(productivityunit.current_list, later_todo_id, a);
    $("#laterdialog").dialog("close")
}

function later_todo_cancel() {
    render_everything()
}

function delete_list() {
    var a = $(this).closest(".normallist").data("listid");
    statemanager.delete_list(a);
    render_everything()
}

function delete_todo() {
    var a = $(this).closest("li");
    statemanager.delete_todo(a.data("listid"), a.data("todoid"));
    a.hide("blind", {}, 250);
    setTimeout(render_everything, 400)
}

function delete_category(a) {
    undoagent.add_state("Delete Category");
    if (productivityunit.categorymanager.which_category_is_list_in(productivityunit.current_list) == a) {
        productivityunit.current_list == 0
    }
    productivityunit.delete_category(a);
    statemanager.save();
    render_everything()
}

function purge_done_items() {
    if (remote == 0) {
        statemanager.purge_done_todos(productivityunit.current_list)
    } else {
        statemanager.purge_done_todos(productivityunit.remote_list)
    }
    render_everything()
}

function save_list_name() {
    var a = trim(document.getElementById("updatebox").value);
    if (a == "") {
        alert("Name can't be blank.");
        document.getElementById("updatebox").focus()
    } else {
        statemanager.rename_list(modify_list, a);
        render_everything()
    }
}

function save_todo_name() {
    var a = trim(document.getElementById("updatebox").value);
    if (a == "") {
        alert("Name can't be blank.");
        document.getElementById("updatebox").focus()
    } else {
        statemanager.rename_todo(modify_list, modify_todo, a);
        render_everything()
    }
}

function save_category_name() {
    var a = trim(document.getElementById("updatebox").value);
    if (a == "") {
        alert("Name can't be blank.");
        document.getElementById("updatebox").focus()
    } else {
        statemanager.rename_category(modify_category, a);
        render_everything()
    }
}

function cancel_update() {
    render_everything()
}

function save_category_list_order(d, e) {
    var b = strip_chars_from_id($(this).attr("id"));
    var c = productivityunit.categorymanager.categories[b].lists.length;
    var a = strip_chars_from_ids($("#container_" + b).sortable("toArray"));
    productivityunit.categorymanager.categories[b].lists = a;
    var f = productivityunit.categorymanager.categories[b].lists.length;
    if (f != c && list_sort_object.active == 0) {
        list_sort_object.active = 1;
        return
    }
    list_sort_object.active = 0;
    statemanager.save();
    render_everything();
    undoagent.hide_undo_icon()
}

function move_list_to_category(b, d) {
    var a = strip_chars_from_id(b.id);
    var c = strip_chars_from_id(d.id);
    original_category_id = categorymanager.which_category_is_list_in(a);
    if (c != original_category_id) {
        categorymanager.move_list_to_category(c, original_category_id, a)
    }
    render_everything()
}

function save_category_order(a, b) {
    statemanager.reorder_categories(strip_chars_from_ids($("#mycategories").sortable("toArray")));
    render_everything()
}

function save_todo_order(a) {
    if (list_sort_flag == 1) {
        list_sort_flag = 0;
        return
    }
    if (drop_flag == 1) {
        drop_flag = 0;
        return
    }
    var b = $("#mytodos").sortable("toArray", {
        attribute: "data-todoid"
    });
    var c = $("#mydonetodos").sortable("toArray", {
        attribute: "data-todoid"
    });
    b = b.map(function(d) {
        return parseInt(d)
    });
    c = c.map(function(d) {
        return parseInt(d)
    });
    if (remote == 0) {
        statemanager.reorder_todos(productivityunit.current_list, b, c)
    } else {
        statemanager.reorder_todos(productivityunit.remote_list, b, c)
    }
    render_everything()
}

function receive_todo(a, b) {
    console.log("receive todo");
    if ($(b.item.context).data("todotype") != "later") {
        list_sort_flag = 1
    }
}

function verify_reset_lists() {
    var a = confirm("Are you sure?  This will delete all your lists.");
    if (a) {
        reset_lists()
    }
}

function set_current_list() {
    var a = $(this).closest(".normallist").data("listid");
    productivityunit.set_current_list(a);
    if (remote == 0) {
        statemanager.save()
    }
    render_list();
    adjust_sort_order_items()
}

function set_current_list_remote(a) {
    productivityunit.set_remote_list(a);
    if (remote == 1) {}
    render_list()
}

function move_item(c, e) {
    drop_flag = 1;
    var a = productivityunit.current_list;
    var d = $(e.draggable.context).data("todoid");
    var b = strip_chars_from_id($(this).attr("id"));
    if (a != b) {
        statemanager.move_todo(a, d, b);
        render_everything()
    }
}

function tab_lists(a) {
    if (a.keyCode == 9 && document.activeElement.id != "syncname" && document.activeElement.id != "syncpassword" && document.activeElement.id != "syncbutton" && document.activeElement.id != "registersyncname" && document.activeElement.id != "registersyncpassword" && document.activeElement.id != "registerbutton") {
        if (a.altKey || a.ctrlKey || tabtimer + 250 > Date.now()) {
            return
        }
        a.preventDefault();
        productivityunit.current_list = productivityunit.categorymanager.categories[productivityunit.categorymanager.which_category_is_list_in(productivityunit.current_list)].next_list(productivityunit.current_list);
        statemanager.save();
        render_everything()
    }
}

function switch_sort_order(a) {
    productivityunit.listmanager.lists[productivityunit.current_list].sortorder = a;
    statemanager.save();
    render_everything()
}

function adjust_sort_order_items() {
    if (remote == 1) {
        return
    }
    document.getElementById("sort0").className = "";
    document.getElementById("sort1").className = "";
    document.getElementById("sort2").className = "";
    document.getElementById("sort3").className = "";
    document.getElementById("sort" + productivityunit.listmanager.lists[productivityunit.current_list].sortorder).className = "current";
    if (productivityunit.listmanager.lists[productivityunit.current_list].sortorder == 0) {
        document.getElementById("sortbutton").title = "Sorting items normally"
    }
    if (productivityunit.listmanager.lists[productivityunit.current_list].sortorder == 1) {
        document.getElementById("sortbutton").title = "Sorting items alphabetically"
    }
    if (productivityunit.listmanager.lists[productivityunit.current_list].sortorder == 2) {
        document.getElementById("sortbutton").title = "Sorting items randomly"
    }
    if (productivityunit.listmanager.lists[productivityunit.current_list].sortorder == 3) {
        document.getElementById("sortbutton").title = "Priority view (top 3 highlighted)"
    }
}

function show_hide_sort_selector() {
    if (document.getElementById("sortselect").style.display == "none") {
        Effect.BlindDown("sortselect", {
            duration: 0.5
        })
    } else {
        Effect.BlindUp("sortselect", {
            duration: 0.5
        })
    }
}

function show_hide_tomorrow() {
    var a = $("#tomorrowitemspanel");
    if (a.hasClass("show")) {
        a.removeClass("show").addClass("hide");
        $("#tomorrowarrow").attr("src", image_arrow_down.src).attr("title", "Show items to be done later.")
    } else {
        a.removeClass("hide").addClass("show");
        $("#tomorrowarrow").attr("src", image_arrow_up.src).attr("title", "Hide items to be done later.")
    }
}

function show_hide_category(b) {
    var a = $("#mycategory_" + b);
    if (a.hasClass("showcategory")) {
        a.removeClass("showcategory").addClass("hidecategory");
        $("#categoryarrow_" + b).attr("src", image_category_down.src).attr("title", "Show category lists.");
        productivityunit.categorymanager.categories[b].collapsed = 1
    } else {
        a.removeClass("hidecategory").addClass("showcategory");
        $("#categoryarrow_" + b).attr("src", image_category_up.src).attr("title", "Hide category lists.");
        productivityunit.categorymanager.categories[b].collapsed = 0
    }
    statemanager.save()
}

function perform_undo() {
    if (undoagent.states.length > 0) {
        undoagent.retrieve_state()
    } else {
        alert("You have not performed an action that can be undone.")
    }
}

function showhidedone() {
    var a = document.getElementById("doneitemscontainer");
    if (a.style.display == "none") {
        a.style.display = "block";
        document.getElementById("showhidedone").innerHTML = "Hide Done"
    } else {
        a.style.display = "none";
        document.getElementById("showhidedone").innerHTML = "Show Done"
    }
}

function blanktodo(c) {
    if (c == "plus") {
        var b = document.createElement("li");
        b.setAttribute("class", "blanktodo");
        b.innerHTML = '<img src="./images/check.png"><span>&nbsp</span>';
        document.getElementById("mytodos").appendChild(b)
    } else {
        var a = $(".blanktodo");
        if (a.length != 0) {
            document.getElementById("mytodos").removeChild(a[0])
        }
    }
}

function render_everything() {
    if (remote == 0) {
        refresh_lists_normal();
        render_list_normal();
        if (remote_window_open()) {
            remotewindow.refresh_lists();
            remotewindow.render_list()
        }
        adjust_sort_order_items()
    } else {
        refresh_lists_remote();
        render_list_remote();
        window.opener.refresh_lists();
        window.opener.render_list()
    }
}

function refresh_lists() {
    if (remote == 0) {
        refresh_lists_normal();
        if (remote_window_open()) {
            remotewindow.refresh_lists_remote()
        }
        make_items_active()
    } else {
        refresh_lists_remote();
        window.opener.refresh_lists_normal();
        window.opener.make_items_active()
    }
}

function refresh_lists_normal() {
    productivityunit.categorymanager.render();
    return
}

function refresh_lists_remote() {
    $("#listsmenu").html(window.opener.productivityunit.categorymanager.render_remote());
    return
}

function render_list() {
    if (remote == 0) {
        render_list_normal()
    } else {
        render_list_remote()
    }
}

function render_list_normal() {
    var d = productivityunit.current_list;
    var a = 0;
    var k = document.getElementById("mytitle");
    var b = document.getElementById("todolistpanel");
    var i = document.getElementById("doneitemspanel");
    var h = document.getElementById("tomorrowitemspanel");
    if (remote_window_open()) {
        if (productivityunit.current_list == productivityunit.remote_list) {
            document.title = unescape(productivityunit.listmanager.lists[d].name)
        } else {
            document.title = "(" + productivityunit.listmanager.lists[d].how_many_todo() + "/" + productivityunit.listmanager.lists[d].how_many_done() + ") " + unescape(productivityunit.listmanager.lists[d].name)
        }
    } else {
        document.title = "(" + productivityunit.listmanager.lists[d].how_many_todo() + "/" + productivityunit.listmanager.lists[d].how_many_done() + ") " + unescape(productivityunit.listmanager.lists[d].name)
    }
    newdiv = document.createElement("div");
    newdiv.innerHTML = productivityunit.listmanager.lists[d].render_todos(d);
    k.innerHTML = unescape(productivityunit.listmanager.lists[d].name);
    b.innerHTML = "";
    b.appendChild(newdiv);
    i.innerHTML = productivityunit.listmanager.lists[d].render_done_todos(d);
    h.innerHTML = productivityunit.listmanager.lists[d].render_tomorrows_and_laters(d);
    var f = b.offsetTop;
    b.innerHTML = b.innerHTML;
    document.getElementById("newtodo").value = "";
    document.getElementById("newtodo").focus();
    $(".currentlist").removeClass("currentlist");
    $("#mylist_" + productivityunit.current_list).addClass("currentlist");
    var c = document.getElementById("todoprogress");
    var e = document.getElementById("doneprogress");
    progress = productivityunit.listmanager.lists[d].progress();
    current_width = c.style.width;
    c.style.width = progress + "%";
    e.style.width = progress + "%";
    var j = document.getElementById("motivationmessage");
    if (progress > 70 && progress < 100) {
        randomnumber = Math.floor(Math.random() * (motivation.length));
        if (Math.random() > 0.7) {
            j.innerHTML = motivation[randomnumber]
        } else {
            j.innerHTML = ""
        }
    } else {
        j.innerHTML = ""
    }
    var g = productivityunit.listmanager.lists[productivityunit.current_list].how_many_tomorrows();
    var l = productivityunit.listmanager.lists[productivityunit.current_list].how_many_laters();
    if (g == 0) {
        document.getElementById("tomorrow_number").innerHTML = ""
    } else {
        document.getElementById("tomorrow_number").innerHTML = "( " + productivityunit.listmanager.lists[productivityunit.current_list].how_many_tomorrows() + " )"
    }
    if (l == 0) {
        document.getElementById("later_number").innerHTML = ""
    } else {
        document.getElementById("later_number").innerHTML = "( " + productivityunit.listmanager.lists[productivityunit.current_list].how_many_laters() + " )"
    }
    $("#menupanel").css("margin-top", "0px");
    make_items_active()
}

function render_list_remote() {
    lists = window.opener.productivityunit.listmanager.lists;
    var d = productivityunit.remote_list;
    var j = document.getElementById("mytitle");
    var b = document.getElementById("todolistpanel");
    var h = document.getElementById("doneitemspanel");
    var g = document.getElementById("tomorrowitemspanel");
    document.title = "(" + lists[d].how_many_todo() + "/" + lists[d].how_many_done() + ") " + unescape(lists[d].name);
    j.innerHTML = unescape(lists[d].name);
    b.innerHTML = lists[d].render_todos(d);
    h.innerHTML = lists[d].render_done_todos(d);
    g.innerHTML = lists[d].render_tomorrows(d);
    var f = b.offsetTop;
    document.getElementById("newtodo").value = "";
    document.getElementById("newtodo").focus();
    var a = 0;
    while (a < lists.length) {
        list = document.getElementById("mylist_" + a);
        if (list == null) {
            a++;
            continue
        }
        if (lists[a].divider == 0 && a == d) {
            list.className = "normallist currentlist"
        } else {
            if (lists[a].divider == 0) {
                list.className = "normallist"
            } else {
                list.className = "divider"
            }
        }
        a++
    }
    document.getElementById("tomorrow_number").innerHTML = "( " + lists[d].how_many_tomorrows() + " )";
    document.getElementById("listdropdown").options[0].selected = true;
    var c = document.getElementById("todoprogress");
    var e = document.getElementById("doneprogress");
    progress = lists[d].progress();
    current_width = c.style.width;
    c.style.width = progress + "%";
    e.style.width = progress + "%";
    var i = document.getElementById("motivationmessage");
    if (progress > 70 && progress < 100) {
        randomnumber = Math.floor(Math.random() * (motivation.length));
        if (Math.random() > 0.7) {
            i.innerHTML = motivation_remote[randomnumber]
        } else {
            i.innerHTML = ""
        }
    } else {
        i.innerHTML = ""
    }
    make_remote_items_active()
}

function render_print_view() {
    productivityunit = window.opener.productivityunit;
    $("#mytitle").html(unescape(productivityunit.listmanager.lists[productivityunit.current_list].name));
    $("#todoitems").html(productivityunit.listmanager.lists[productivityunit.current_list].render_todos_print());
    $("#doneitems").html(productivityunit.listmanager.lists[productivityunit.current_list].render_done_todos_print())
}

function in_place_editor(a, c) {
    var e = document.getElementById(a).innerHTML;
    e = e.replace(/'/g, "&#39;");
    var b = 13;
    if (document.getElementById(a).parentNode.className.match(/moveabletodo/)) {
        b = 30
    }
    var d = '<div id="inplaceeditor"><form onsubmit="' + c + '();return false;"><input type="text" id="updatebox" value=\'' + (trim(e)) + "' size=\"" + b + '"><input type="submit" value="Save"><input type="button" value="Cancel" onclick="cancel_update(\'' + a + "', '" + escape(e) + "');\"></form></div>";
    document.getElementById(a).parentNode.innerHTML = d;
    document.getElementById("updatebox").focus();
    document.getElementById("updatebox").select()
}

function make_items_active() {
    var c = 0;
    drop_flag = 0;
    list_sort_flag = 0;
    try {
        $(":ui-sortable").sortable.destroy()
    } catch (d) {}
    try {
        $(":ui-draggable").draggable.destroy()
    } catch (d) {}
    try {
        $(":ui-droppable").droppable.destroy()
    } catch (d) {}
    $mytodos = $("#mytodos").sortable({
        dropOnEmpty: true,
        placeholder: "sortable-placeholder",
        forcePlaceholderSize: true,
        update: save_todo_order,
        receive: receive_todo
    });
    $mydonetodos = $("#mydonetodos").sortable({
        dropOnEmpty: true,
        placeholder: "sortable-placeholder",
        forcePlaceholderSize: true,
        update: save_todo_order,
        receive: receive_todo
    });
    $mytodos.sortable("option", "connectWith", "#mydonetodos");
    $mydonetodos.sortable("option", "connectWith", "#mytodos");
    $(".categorycontainer").sortable({
        dropOnEmpty: true,
        placeholder: "sortable-placeholder",
        update: save_category_list_order,
        connectWith: ".categorycontainer"
    });
    if (productivityunit.categorymanager.categories.length > 2) {
        $("#mycategories").sortable({
            placeholder: "sortable-placeholder",
            handle: "h5",
            update: save_category_order
        })
    }
    $("#mytitle").droppable({
        accept: ".normallist",
        tolerance: "pointer",
        drop: merge_list,
        hoverClass: "dropontolist"
    });
    $("#tomorrowtitle").droppable({
        accept: ".moveabletodo",
        tolerance: "pointer",
        drop: tomorrow_todo,
        hoverClass: "dropontolist"
    });
    $("#latertitle").droppable({
        accept: ".moveabletodo",
        tolerance: "pointer",
        drop: later_todo,
        hoverClass: "dropontolist"
    });
    for (c = 0; c < productivityunit.listmanager.lists.length; c++) {
        $("#mylist_" + c).droppable({
            accept: ".moveabletodo",
            tolerance: "pointer",
            drop: move_item,
            hoverClass: "dropontolist"
        })
    }
    $("#tomorrowitemspanel").find(".moveabletodo").draggable({
        connectToSortable: "#mytodos, #mydonetodos",
        revert: "false",
        helper: "clone"
    });
    var a = $(".moveabletodo").on("click", ".delete", delete_todo);
    var b = $(".normallist");
    b.off("click", ".delete", delete_list);
    b.off("click", ".listname", set_current_list);
    b.off("click", ".copylist", copy_category_list);
    b.off("dblclick", ".listname", edit_list_name);
    a.off("dblclick", "span", modify_todo_name);
    b.on("click", ".delete", delete_list);
    b.on("click", ".listname", set_current_list);
    b.on("click", ".copylist", copy_category_list);
    b.on("dblclick", ".listname", edit_list_name);
    a.on("dblclick", "span", modify_todo_name);
    if (productivityunit.listmanager.lists.length <= 1) {
        $("#lists").find(".categorycontainer").find(".delete").hide()
    }
}

function make_remote_items_active() {
    try {
        $(":ui-sortable").sortable.destroy()
    } catch (b) {}
    try {
        $(":ui-draggable").draggable.destroy()
    } catch (b) {}
    try {
        $(":ui-droppable").droppable.destroy()
    } catch (b) {}
    $mytodos = $("#mytodos").sortable({
        dropOnEmpty: true,
        placeholder: "sortable-placeholder",
        forcePlaceholderSize: true,
        update: save_todo_order,
        receive: receive_todo,
        axis: "y",
        scrollSensitivity: 5
    });
    $mydonetodos = $("#mydonetodos").sortable({
        dropOnEmpty: true,
        placeholder: "sortable-placeholder",
        forcePlaceholderSize: true,
        update: save_todo_order,
        receive: receive_todo,
        axis: "y",
        scrollSensitivity: 5
    });
    $mytodos.sortable("option", "connectWith", "#mydonetodos");
    $mydonetodos.sortable("option", "connectWith", "#mytodos");
    $("#tomorrowtitle").droppable({
        accept: ".moveabletodo",
        tolerance: "pointer",
        drop: tomorrow_todo,
        hoverClass: "dropontotomorrow"
    });
    var a = $(".moveabletodo").on("click", ".delete", delete_todo);
    a.off("dblclick", "span", modify_todo_name);
    a.on("dblclick", "span", modify_todo_name)
}
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(a) {
        window.setTimeout(a, 1000 / 60)
    }
})();

function manage_scroll() {
    var a = $(window).scrollTop();
    if (previous_scroll == a) {
        requestAnimFrame(manage_scroll);
        return
    } else {
        previous_scroll = a
    }
    var b;
    var g = $(document).height() - $(window).height();
    var f = $("#headerpanel").offset().top;
    var d = f - a;
    var h = $("#head");
    if (d < (h.outerHeight() - 10)) {
        $("#title").hide();
        b = $("#mytitle").detach();
        h.find(".setwidth").first().prepend(b);
        $("#mytitlefiller").show()
    } else {
        $("#title").show();
        b = $("#mytitle").detach();
        $("#headerpanel").prepend(b);
        $("#mytitlefiller").hide()
    }
    var c = $("#menupanel").innerHeight();
    var e = $("#mainstuffcontainer").innerHeight();
    if ((c + 20) < e) {
        var i = Math.floor((a / g) * 100);
        var j = Math.floor((e - c) * (i / 100));
        $("#menupanel").css("margin-top", j + "px")
    }
    requestAnimFrame(manage_scroll)
}

function close_remote() {
    if (remote_window_open()) {
        remotewindow.close()
    }
}

function reset_lists() {
    statemanager.reset_lists();
    statemanager.save();
    render_everything()
}

function remote_window_open() {
    if (typeof(remotewindow) != "object") {
        return false
    } else {
        return !remotewindow.closed
    }
}

function main_window_open() {
    return !window.opener.closed
}

function show_functionality() {
    $("#additempanel").css("display", "block");
    $("#adddivider, #addlist").css("display", "inline")
}

function sync_init() {
    if (syncmanager.active == 1) {
        sync_set_login_panel("normal");
        syncmanager.setup_periodicals();
        syncmanager.check()
    }
}

function sync_login() {
    syncmanager.login()
}

function sync_logout() {
    syncmanager.logout();
    document.getElementById("syncpassword").value = "";
    window.setTimeout(syncform_hide, 600)
}

function syncform_switch() {
    $("#syncform").toggle("blind", 400)
}

function syncform_hide() {
    $("#syncform").hide("blind", 400)
}

function create_account() {
    var c = document.getElementById("registersyncname").value;
    var d = document.getElementById("registersyncpassword").value;
    if (c.match(/^\s*$/)) {
        alert("Please supply an email address.");
        document.getElementById("registersyncname").focus();
        return
    }
    if (!c.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i)) {
        alert("You have not supplied a valid email address.");
        document.getElementById("registersyncname").focus();
        return
    }
    if (d.match(/^\s*$/)) {
        alert("Please supply a password for your account.");
        document.getElementById("registersyncpassword").focus();
        return
    }
    if (!d.match(/^\S{4,}$/)) {
        alert("Your password should be atleast 4 characters long (no spaces).");
        document.getElementById("registersyncpassword").focus();
        return
    }
    var a = c;
    var b = d;
    $.ajax("./sync.php", {
        type: "POST",
        data: {
            email: c,
            password: d,
            action: "register"
        }
    }).error(function(e, f) {
        alert("Well this is embarassing. Something went wrong when asking the server to create your account. " + f)
    }).success(function(e) {
        var f = "";
        if (e == "success") {
            f = "<p class=\"red\">Your account has been created and an email has been sent for verification (check your spam folder if you don't see it).  Once you verify your email you'll be able to start syncing your lists.</p>"
        } else {
            if (e == "error") {
                f = '<p class="red">Well this is embarassing.  Please try again shortly or email us and we\'ll take a look at it.</p>'
            } else {
                if (e == "duplicate") {
                    f = '<p class="red">Oh dear.  It looks like this email address already has an account.  Click forgotten password to find out what it is.</p>'
                }
            }
        }
        document.getElementById("registerformmessage").innerHTML = f
    })
}

function sync_indication(a) {
    if (a == "synced") {
        document.getElementById("sync_icon").src = image_sync_good.src;
        document.getElementById("sync_icon").title = "Lists synced"
    } else {
        if (a == "waiting") {
            document.getElementById("sync_icon").src = image_sync_waiting.src;
            document.getElementById("sync_icon").title = "Lists about to be synced"
        } else {
            if (a == "notsynced") {
                document.getElementById("sync_icon").src = image_sync_bad.src;
                document.getElementById("sync_icon").title = "Oh dear, something went wrong."
            } else {
                document.getElementById("sync_icon").src = image_sync_neutral.src
            }
        }
    }
}

function sync_nouser() {
    alert("Userid does not exist on the server.");
    syncmanager.logout_soft();
    syncmanager.set_login_panel();
    syncform_show()
}

function sync_loginerror() {
    alert("Error logging in.  Try logging in again.");
    syncmanager.logout_soft();
    syncmanager.set_login_panel();
    syncform_show()
}

function sync_loginnotactive() {
    alert("Your account is not active yet. Check your email for an activation link.");
    syncmanager.logout_soft();
    syncmanager.set_login_panel();
    syncform_show()
}

function sync_login_failed() {
    alert("Login credentials incorrect. Please try again.")
}

function sync_login_outdated() {
    alert("You need to log in again.  Most likely this is because you have changed your password on another device.");
    syncmanager.logout_soft();
    syncmanager.set_login_panel();
    syncform_show()
}

function sync_set_syncd_time() {
    document.getElementById("synctime").innerHTML = format_date(syncmanager.lastsync * 1000)
}

function sync_set_login_panel(a) {
    if (syncmanager.active == 1) {
        document.getElementById("loggedinas").innerHTML = syncmanager.logged_in_as;
        document.getElementById("loginpanel").style.display = "none";
        document.getElementById("loggedinpanel").style.display = "block";
        sync_set_syncd_time()
    } else {
        document.getElementById("loggedinas").innerHTML = "";
        document.getElementById("loginpanel").style.display = "block";
        document.getElementById("loggedinpanel").style.display = "none";
        if (syncmanager.logged_in_as.length > 0) {
            document.getElementById("syncname").value = syncmanager.logged_in_as
        }
    }
    if (a == "hide") {
        window.setTimeout(syncform_hide, 800)
    } else {}
}

function launch() {
    if (remote == 0) {
        $(window).load(set_up_main)
    } else {
        if (remote == 2) {
            $(window).load(set_up_print)
        } else {
            $(window).load(set_up_remote)
        }
    }
}

function set_up_main() {
    $(window).bind("keyup", function(b) {
        tab_lists(b)
    });
    $(window).bind("focus", function(b) {
        focus_check(b)
    });
    $(window).bind("unload", function(b) {
        close_remote(b)
    });
    manage_scroll();
    if (datamanager.supports_local_storage()) {
        $("#top_lists_saved").attr({
            src: "./images/top_saved.png",
            title: "Lists being saved"
        });
        var a = datamanager.retrieve_local_syncmanager();
        if (a) {
            syncmanager.unpack(a);
            sync_init()
        } else {
            console.log("Error retrieving syncmanager from localstorage")
        }
        a = datamanager.retrieve_local_productivityunit();
        if (a) {
            productivityunit.unpack(a);
            productivityunit.categorymanager.clean()
        } else {
            productivityunit.create_starting_point();
            console.log("Error retrieving productivityunit from localstorage")
        }
    } else {
        productivityunit.create_starting_point()
    }
    if (productivityunit.current_list == -1) {
        productivityunit.set_current_list(0)
    }
    $("#choosewhen").datepicker({
        onSelect: set_later_todo
    });
    $("#laterdialog").dialog({
        autoOpen: false,
        modal: true,
        closeText: "Cancel"
    });
    $("#newtodo").on("keypress", check_key);
    render_everything();
    show_functionality()
}

function set_up_remote() {
    productivityunit = window.opener.productivityunit;
    productivityunit.remote_list = productivityunit.current_list;
    render_everything();
    $("#newtodo").on("keypress", check_key)
}

function set_up_print() {
    render_print_view()
}

function focus_check(a) {
    tabtimer = Date.now()
}

function check_key(a) {
    if (a.which == 13) {
        add_todo()
    }
    return
}
var image_sync_good = new Image();
image_sync_good.src = "./images/top_sync_on.png";
var image_sync_bad = new Image();
image_sync_bad.src = "./images/top_sync_error.png";
var image_sync_waiting = new Image();
image_sync_waiting.src = "./images/top_sync_waiting.png";
var image_sync_neutral = new Image();
image_sync_neutral.src = "./images/top_sync.png";
var image_arrow_up = new Image();
image_arrow_up.src = "./images/arrow_up.png";
var image_arrow_down = new Image();
image_arrow_down.src = "./images/arrow_down.png";
var image_category_up = new Image();
image_category_up.src = "./images/category_up.png";
var image_category_down = new Image();
image_category_down.src = "./images/category_down.png";