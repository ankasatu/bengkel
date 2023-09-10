var __bengkel__ = (!__bengkel__ ? {} : __bengkel__);

(function (__, _) {
    const C = { REMOVE: "\u2715", TOGGLE: "\u25bd", TOGGLE_EXPAND: "\u25bd", TOGGLE_SHRINK: "\u2014" };

    var div = document.createElement("div");
    var inputText = document.createElement("input"); inputText.type = "text"; inputText.spellcheck = false;
    var button = document.createElement("button");

    function build(cat) {
        var _node = cat.cloneNode(true);
        var _lastevt = () => { };

        function ac(n, w) {
            if (w instanceof Node) n.appendChild(w);
            else if (w.node instanceof Node) n.appendChild(w.node);
            else throw new Error("arg or arg.node is not instance of Node");
        }

        var nodew = {
            node: _node,
            classList(...list) {
                for (var i = 0; i < list.length; i++) {
                    var c = list[i].split("\u0020");
                    for (var j = 0; j < c.length; j++) {
                        _node.classList.add(c[j]);
                    }
                }
                return nodew;
            },
            setTitle(value) { _node.title = value; return nodew; },
            setValue(value) { _node.value = value; return nodew; },
            setInnerHTML(value) { _node.innerHTML = value; return nodew; },
            setInnerText(value) { _node.innerText = value; return nodew; },
            appendChild(...w) { for (var i = 0; i < w.length; i++) ac(_node, w[i]); return nodew; },
            appendTo(w) { ac(w, _node); return nodew; },
            setStyle(style) { _node.style = style; return nodew; },
            setSrc(src) { _node.src = src; return nodew; },
            onClick(callback) { _lastevt = _node.onclick = () => callback(_node); return nodew; },
            onChange(callback) { _lastevt = _node.onchange = (e) => callback(_node, e); return nodew; },
            eventExec(eventName) { _node[eventName.toLowerCase()](); },
            exec() { _lastevt(); return nodew; },
            remove() { _node.remove(); },
        };

        return nodew;
    }

    function Playground(domHtml = null) {

        var CC = {
            playground: "playground",
            meta: "meta",
            title: "title",
            control: "control",
            content: "content",
            // buttonRemove: "action button ic remove",
            // buttonToggle: "action button ic collapsable",
            buttonRemove: "action button",
            buttonToggle: "action button",
        }

        var base = build(div).classList(CC.playground);
        var meta = build(div).appendTo(base).classList(CC.meta);

        var content = build(div).appendTo(base).classList(CC.content);

        if (domHtml instanceof Node) content.appendChild(domHtml);
        else if (domHtml.node instanceof Node) content.appendChild(domHtml.node);
        else content.setInnerHTML(domHtml);

        // title region
        var title = build(div).appendTo(meta).classList(CC.title);
        var text = build(inputText).appendTo(title);

        // control region
        var stateToggleIsOpen = true;

        var control = build(div).appendTo(meta).classList(CC.control);
        var btnRemove = build(button).appendTo(control).classList(CC.buttonRemove).setInnerText(C.REMOVE).setTitle("remove").onClick(base.remove);
        var btnToggle = build(button).appendTo(control).classList(CC.buttonToggle).setInnerText(C.TOGGLE_EXPAND).setTitle("toggle")
            .onClick(function (node) {
                stateToggleIsOpen = !stateToggleIsOpen;

                if (stateToggleIsOpen) {
                    node.innerText = (C.TOGGLE_EXPAND);
                } else {
                    node.innerText = (C.TOGGLE_SHRINK);
                }

                content.node.hidden = stateToggleIsOpen;
            }).exec();

        var actionList = [];
        actionList.push(btnRemove);
        actionList.push(btnToggle);

        var playgroundw = {
            node: base.node,
            setTitle(value) {
                text.setValue(value);
                return playgroundw;
            },
            classList(...classes) {
                base.classList(...classes);
                return playgroundw;
            },
            setStyle(style) {
                base.setStyle(style);
                return playgroundw;
            },
            toggle() {
                btnToggle.eventExec('onclick');
                return playgroundw;
            },
            expand(value) {
                stateToggleIsOpen = value;
                btnToggle.eventExec('onclick');
                return playgroundw;
            },
            remove() {
                btnRemove.eventExec('onclick');
                return playgroundw;
            },
            actionReorder(cb) {
                if (typeof cb !== 'function') throw new Error("argument must be callback");

                var result = cb(actionList);

                if (!Array.isArray(result)) throw new Error("callback return must be array");

                control.node.replaceChildren();
                result.forEach((p) => p.appendTo(control));
                return playgroundw;
            }
        };

        return playgroundw;
    }

    function Manager() {
        var instanceList = [];

        var CC = {
            manager: "playground-manager",
            buttonRemove: "action button",
            buttonExpand: "action button",
            buttonShrink: "action button",
            buttonOther: "action button other"
        }

        function expandable(value) {
            for (var i = 0; i < instanceList.length; i++) {
                instanceList[i].expand(!!value);
            }
        }
        function expand() {
            expandable(true);
        }
        function shrink() {
            expandable(false);
        }

        function remove() {
            for (var i = 0; i < instanceList.length; i++) {
                instanceList[i].remove();
            }
        }

        var base = build(div).classList(CC.manager);

        var actionList = [];

        actionList.push(build(button).classList(CC.buttonRemove).setTitle("remove all").setInnerText(C.REMOVE)
            .appendTo(base)
            .onClick(remove));

        actionList.push(build(button).classList(CC.buttonExpand).setTitle("expand all").setInnerHTML(C.TOGGLE_EXPAND)
            .appendTo(base)
            .onClick(expand));

        actionList.push(build(button).classList(CC.buttonShrink).setTitle("shrink all").setInnerHTML(C.TOGGLE_SHRINK)
            .appendTo(base)
            .onClick(shrink));

        var managerw = {
            node: base.node,
            push(instance) {
                instanceList.push(instance);
                return managerw;
            },
            expand(value) {
                expandable(value);
                return managerw;
            },
            remove() {
                remove();
                return managerw;
            },
            register(node) {
                if (typeof node === 'function') {
                    var b = build(button).classList(CC.buttonOther);
                    var m = node(b);
                    if (m !== b) throw "return value must from argument[0]";
                    actionList.push(m);
                    base.appendChild(m);
                } else {
                    actionList.push(node);
                    base.appendChild(node);
                }
                return managerw;
            },
            reorder(cb) {
                if (typeof cb !== 'function') throw new Error("argument must be callback");

                var result = cb(actionList);

                if (!Array.isArray(result)) throw new Error("callback return must be array");

                base.node.replaceChildren();
                result.forEach((p) => p.appendTo(base));
                return managerw;
            }
        }

        return managerw;
    }

    var manager = new Manager();

    function create(...params) {
        var instance = Playground(...params);

        if (typeof manager !== 'undefined' && typeof manager.push === 'function') {
            manager.push(instance);
        }

        return instance;
    }

    __[_] = { manager, create };

})(__bengkel__, 'playground');